
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
      console.log('Starting registration for:', userData.email, 'as role:', userData.role);
      
      // Validar dados obrigatórios
      if (!userData.name || !userData.email || !userData.password || !userData.role) {
        console.error('Missing required fields');
        return { success: false, error: 'Todos os campos obrigatórios devem ser preenchidos' };
      }

      // Limpar e preparar os dados
      const cleanName = userData.name.trim();
      const cleanEmail = userData.email.trim().toLowerCase();
      
      // Preparar metadados com nomes de campos consistentes
      const userMetadata: any = {
        name: cleanName,
        role: userData.role,
      };

      // Adicionar campos específicos por tipo de usuário
      if (userData.role === 'patient') {
        if (userData.age) userMetadata.age = userData.age.toString();
        if (userData.condition) userMetadata.condition = userData.condition.trim();
      } else if (userData.role === 'clinic') {
        if (userData.clinicName) userMetadata.clinicName = userData.clinicName.trim();
        if (userData.crm) userMetadata.crm = userData.crm.trim();
        if (userData.specialty) userMetadata.specialty = userData.specialty.trim();
      }

      console.log('Registration metadata:', userMetadata);
      
      console.log('Calling supabase.auth.signUp...');
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: userData.password,
        options: {
          data: userMetadata
        }
      });

      console.log('Supabase signup response:', { 
        user: data.user ? 'User created' : 'No user', 
        session: data.session ? 'Session created' : 'No session',
        error: error ? error.message : 'No error'
      });
      
      if (error) {
        console.error('Supabase signup error:', error);
        
        // Tratamento específico de erros
        if (error.message.includes('User already registered')) {
          return { success: false, error: 'Este e-mail já está cadastrado' };
        } else if (error.message.includes('Invalid email')) {
          return { success: false, error: 'E-mail inválido' };
        } else if (error.message.includes('Password')) {
          return { success: false, error: 'Senha deve ter pelo menos 6 caracteres' };
        } else if (error.message.includes('Database error')) {
          return { success: false, error: 'Erro no banco de dados. Verifique se todos os campos estão preenchidos corretamente.' };
        }
        
        return { success: false, error: `Erro no cadastro: ${error.message}` };
      }

      if (data.user) {
        console.log('User registered successfully:', data.user.id);
        
        // Se o usuário foi criado mas não há sessão (confirmação de email necessária)
        if (!data.session) {
          return { success: true };
        }
        
        return { success: true };
      }

      return { success: false, error: 'Falha no cadastro' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: `Erro interno: ${error?.message || 'Tente novamente.'}` };
    } finally {
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
