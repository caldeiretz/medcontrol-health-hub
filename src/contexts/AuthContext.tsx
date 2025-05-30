import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type UserRole = 'patient' | 'clinic' | null;

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: { 
    name: string; 
    email: string; 
    password: string; 
    role: UserRole; 
    [key: string]: any 
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching user profile for:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('User profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          } else {
            console.warn('Profile not found for user:', session.user.id);
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      
      if (session?.user) {
        fetchUserProfile(session.user.id).then((profile) => {
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
            setSession(session);
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }

      if (data.user && data.session) {
        console.log('Login successful for user:', data.user.id);
        return { success: true };
      }

      return { success: false, error: 'Falha no login' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erro interno. Tente novamente.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { 
    name: string; 
    email: string; 
    password: string; 
    role: UserRole; 
    [key: string]: any 
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      console.log('=== STARTING REGISTRATION PROCESS ===');
      console.log('Registration attempt for:', userData.email, 'as role:', userData.role);
      console.log('Full userData received:', userData);
      
      // Validar dados obrigatórios
      if (!userData.name || !userData.email || !userData.password || !userData.role) {
        console.error('Missing required fields:', {
          name: !!userData.name,
          email: !!userData.email,
          password: !!userData.password,
          role: !!userData.role
        });
        return { success: false, error: 'Todos os campos obrigatórios devem ser preenchidos' };
      }

      // Preparar metadados exatamente como esperado pelo trigger
      const userMetadata: any = {
        name: userData.name.trim(),
        role: userData.role,
      };

      // Adicionar campos específicos por role
      if (userData.role === 'patient') {
        if (userData.age) {
          const ageNum = parseInt(userData.age.toString());
          if (!isNaN(ageNum) && ageNum > 0) {
            userMetadata.age = ageNum.toString();
            console.log('Added patient age:', userMetadata.age);
          }
        }
        if (userData.condition && userData.condition.trim()) {
          userMetadata.condition = userData.condition.trim();
          console.log('Added patient condition:', userMetadata.condition);
        }
      } else if (userData.role === 'clinic') {
        if (userData.clinicName && userData.clinicName.trim()) {
          userMetadata.clinicName = userData.clinicName.trim();
          console.log('Added clinic name:', userMetadata.clinicName);
        }
        if (userData.crm && userData.crm.trim()) {
          userMetadata.crm = userData.crm.trim();
          console.log('Added CRM:', userMetadata.crm);
        }
        if (userData.specialty && userData.specialty.trim()) {
          userMetadata.specialty = userData.specialty.trim();
          console.log('Added specialty:', userMetadata.specialty);
        }
      }

      console.log('=== FINAL METADATA TO SEND ===');
      console.log(JSON.stringify(userMetadata, null, 2));
      
      console.log('=== CALLING SUPABASE SIGNUP ===');
      const { data, error } = await supabase.auth.signUp({
        email: userData.email.trim(),
        password: userData.password,
        options: {
          data: userMetadata
        }
      });

      console.log('=== SUPABASE RESPONSE ===');
      console.log('Response data:', JSON.stringify(data, null, 2));
      
      if (error) {
        console.error('=== SUPABASE ERROR DETAILS ===');
        console.error('Error object:', error);
        console.error('Error message:', error.message);
        console.error('Error status:', error.status);
        console.error('Error code:', error.code);
        
        // Tratar erros específicos com mensagens em português
        if (error.message.includes('User already registered') || error.message.includes('already been registered')) {
          return { success: false, error: 'Este e-mail já está cadastrado' };
        } else if (error.message.includes('Database error') || error.status === 500) {
          return { success: false, error: 'Erro no banco de dados. Tente novamente ou contate o suporte.' };
        } else if (error.message.includes('Invalid email')) {
          return { success: false, error: 'E-mail inválido' };
        } else if (error.message.includes('Password')) {
          return { success: false, error: 'Senha deve ter pelo menos 6 caracteres' };
        }
        
        return { success: false, error: `Erro no cadastro: ${error.message}` };
      }

      if (data.user) {
        console.log('=== REGISTRATION SUCCESS ===');
        console.log('User registered with ID:', data.user.id);
        console.log('User email confirmed:', data.user.email_confirmed_at !== null);
        
        // Aguardar processamento do trigger
        console.log('Waiting for database trigger to process...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return { success: true };
      }

      console.error('=== UNEXPECTED: NO USER DATA RETURNED ===');
      return { success: false, error: 'Falha no cadastro - dados não retornados' };
    } catch (error: any) {
      console.error('=== REGISTRATION CATCH ERROR ===');
      console.error('Catch error:', error);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      return { success: false, error: `Erro interno: ${error?.message || 'Tente novamente.'}` };
    } finally {
      console.log('=== REGISTRATION PROCESS COMPLETED ===');
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isAuthenticated, 
      isLoading, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
