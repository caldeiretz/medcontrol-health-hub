
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

  // Função para buscar perfil do usuário
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Configurar listener de mudanças de autenticação
  useEffect(() => {
    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        
        if (session?.user) {
          // Buscar perfil do usuário
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          } else {
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

    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        if (profile) {
          setUser(profile);
          setSession(data.session);
          setIsAuthenticated(true);
          return { success: true };
        } else {
          return { success: false, error: 'Perfil de usuário não encontrado' };
        }
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
      
      // Simplificar o processo de registro
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            // Adicionar dados específicos do role
            ...(userData.role === 'patient' ? {
              age: userData.age?.toString(),
              condition: userData.condition
            } : {}),
            ...(userData.role === 'clinic' ? {
              clinicName: userData.clinicName,
              crm: userData.crm,
              specialty: userData.specialty
            } : {})
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        
        // Fornecer mensagens de erro mais específicas
        if (error.message.includes('User already registered')) {
          return { success: false, error: 'Este e-mail já está cadastrado' };
        } else if (error.message.includes('Database error')) {
          return { success: false, error: 'Erro no banco de dados. Verifique se todas as tabelas foram criadas corretamente.' };
        } else if (error.message.includes('Invalid input')) {
          return { success: false, error: 'Dados inválidos. Verifique os campos obrigatórios.' };
        }
        
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('User registered successfully:', data.user.id);
        
        // Se a confirmação de email estiver desabilitada, o usuário já estará logado
        if (data.session) {
          // Aguardar um pouco para o trigger criar o perfil
          setTimeout(async () => {
            const profile = await fetchUserProfile(data.user.id);
            if (profile) {
              setUser(profile);
              setSession(data.session);
              setIsAuthenticated(true);
            }
          }, 1000);
        }
        
        return { success: true };
      }

      return { success: false, error: 'Falha no cadastro' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Erro interno. Tente novamente.' };
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
