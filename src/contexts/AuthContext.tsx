
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserRole = 'patient' | 'clinic' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (userData: { name: string; email: string; password: string; role: UserRole; [key: string]: any }) => Promise<boolean>;
  logout: () => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Mock login for development
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // This would be replaced with an actual API call
      console.log('Login attempt:', { email, password, role });
      
      // Mock successful login
      const mockUser: User = {
        id: '123',
        name: role === 'patient' ? 'Patient User' : 'Dr. Clinic User',
        email,
        role
      };
      
      // Store in local storage
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('userRole', role || '');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // Mock registration for development
  const register = async (userData: { name: string; email: string; password: string; role: UserRole; [key: string]: any }): Promise<boolean> => {
    try {
      // This would be replaced with an actual API call
      console.log('Register attempt:', userData);
      
      // Mock successful registration
      const mockUser: User = {
        id: '123',
        name: userData.name,
        email: userData.email,
        role: userData.role
      };
      
      // Store in local storage
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('userRole', userData.role || '');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    // Clear storage and state
    localStorage.removeItem('authenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
