
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

// Utility function to sanitize input
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>\"'&]/g, '');
};

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const storedUser = sessionStorage.getItem('user');
    const authToken = sessionStorage.getItem('authToken');
    
    if (storedUser && authToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Validate stored user data
        if (parsedUser.id && parsedUser.email && parsedUser.role) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          // Clear invalid data
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('userRole');
        }
      } catch (error) {
        console.error('Error parsing stored user data');
        sessionStorage.clear();
      }
    }
  }, []);

  // Enhanced login with proper validation
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Input validation and sanitization
      const sanitizedEmail = sanitizeInput(email);
      
      if (!isValidEmail(sanitizedEmail)) {
        console.error('Invalid email format');
        return false;
      }

      if (!isValidPassword(password)) {
        console.error('Password does not meet security requirements');
        return false;
      }

      if (!role || (role !== 'patient' && role !== 'clinic')) {
        console.error('Invalid user role');
        return false;
      }

      // Log login attempt WITHOUT password
      console.log('Login attempt for:', { email: sanitizedEmail, role });
      
      // Mock successful login with enhanced security
      const mockUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: role === 'patient' ? 'Patient User' : 'Dr. Clinic User',
        email: sanitizedEmail,
        role
      };
      
      // Generate a mock JWT-like token
      const authToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
      
      // Store in sessionStorage instead of localStorage for better security
      sessionStorage.setItem('authToken', authToken);
      sessionStorage.setItem('userRole', role);
      sessionStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      console.log('Login successful for user:', sanitizedEmail);
      return true;
    } catch (error) {
      console.error('Login failed:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  };

  // Enhanced registration with proper validation
  const register = async (userData: { name: string; email: string; password: string; role: UserRole; [key: string]: any }): Promise<boolean> => {
    try {
      // Input validation and sanitization
      const sanitizedName = sanitizeInput(userData.name);
      const sanitizedEmail = sanitizeInput(userData.email);

      if (!sanitizedName || sanitizedName.length < 2) {
        console.error('Invalid name');
        return false;
      }

      if (!isValidEmail(sanitizedEmail)) {
        console.error('Invalid email format');
        return false;
      }

      if (!isValidPassword(userData.password)) {
        console.error('Password does not meet security requirements');
        return false;
      }

      if (!userData.role || (userData.role !== 'patient' && userData.role !== 'clinic')) {
        console.error('Invalid user role');
        return false;
      }

      // Log registration attempt WITHOUT password or sensitive data
      console.log('Registration attempt for:', { 
        name: sanitizedName, 
        email: sanitizedEmail, 
        role: userData.role 
      });
      
      // Mock successful registration
      const mockUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: sanitizedName,
        email: sanitizedEmail,
        role: userData.role
      };
      
      // Generate a mock JWT-like token
      const authToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
      
      // Store in sessionStorage instead of localStorage
      sessionStorage.setItem('authToken', authToken);
      sessionStorage.setItem('userRole', userData.role);
      sessionStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      console.log('Registration successful for user:', sanitizedEmail);
      return true;
    } catch (error) {
      console.error('Registration failed:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  };

  const logout = () => {
    // Clear all storage and state
    sessionStorage.clear();
    localStorage.removeItem('authenticated'); // Clean up any old localStorage data
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    
    setUser(null);
    setIsAuthenticated(false);
    
    console.log('User logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
