
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/services/auth-api';
import { usersApi, User } from '@/services/users-api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: 'admin' | 'manager' | 'employee' | 'client' | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  userRole: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  hasPermission: () => false,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'manager' | 'employee' | 'client' | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        // Get current authenticated user
        const { data: currentUser } = await usersApi.getCurrentUser();
        setUser(currentUser);
        
        // Map the role from API to our internal role format
        let mappedRole: 'admin' | 'manager' | 'employee' | 'client' = 'employee';
        if (currentUser.role === 'Admin') {
          mappedRole = 'admin';
        } else if (currentUser.role === 'Team Lead') {
          mappedRole = 'manager';
        } else if (currentUser.role === 'Member') {
          mappedRole = 'employee';
        } else if (currentUser.role === 'Client') {
          mappedRole = 'client';
        }
        
        setUserRole(mappedRole);
        
        // Here you would also fetch the user's permissions from your API
        // For now, we'll use the permissions from the PermissionsContext
        // This would be replaced with actual API data in a production app
        
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authApi.login({ email, password });
      
      // After login success, fetch user data
      const { data: currentUser } = await usersApi.getCurrentUser();
      setUser(currentUser);
      
      // Map the role from API
      let mappedRole: 'admin' | 'manager' | 'employee' | 'client' = 'employee';
      if (currentUser.role === 'Admin') {
        mappedRole = 'admin';
      } else if (currentUser.role === 'Team Lead') {
        mappedRole = 'manager';
      } else if (currentUser.role === 'Member') {
        mappedRole = 'employee';
      } else if (currentUser.role === 'Client') {
        mappedRole = 'client';
      }
      
      setUserRole(mappedRole);
      
      toast({
        title: "Login successful",
        description: "Welcome back!"
      });
      
      // Redirect based on role
      if (mappedRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    setIsLoading(true);
    try {
      await authApi.register({ name, email, password, password_confirmation: passwordConfirmation });
      
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account."
      });
      
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: "Registration failed",
        description: "Could not create your account. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      setUserRole(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Logout failed",
        description: "Could not log out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const hasPermission = (permission: string): boolean => {
    // In a real app, this would check against permissions fetched from the API
    // For now, we'll use a simplified approach based on the user role
    if (!userRole) return false;
    
    // Default permissions based on role
    const rolePermissions: Record<string, string[]> = {
      'admin': [
        'admin.access', 'users.manage', 'roles.manage', 'tasks.manage', 'projects.manage',
        'invoices.manage', 'settings.manage', 'reports.access', 'categories.manage',
        'salary.manage', 'team.manage', 'system.manage'
      ],
      'manager': [
        'dashboard.access', 'tasks.manage', 'projects.manage', 'team.view',
        'team.manage', 'reports.access', 'clients.manage', 'invoices.view', 'estimates.manage'
      ],
      'employee': [
        'dashboard.access', 'tasks.view', 'tasks.update', 'projects.view',
        'time.track', 'profile.manage'
      ],
      'client': [
        'dashboard.access', 'projects.view', 'invoices.view', 'estimates.view',
        'profile.manage', 'support.access'
      ]
    };
    
    return rolePermissions[userRole]?.includes(permission) || false;
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user,
        userRole,
        login,
        register,
        logout,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
