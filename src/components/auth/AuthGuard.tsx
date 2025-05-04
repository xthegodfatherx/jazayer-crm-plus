
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface AuthGuardProps {
  requiredPermission?: string;
  redirectPath?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  requiredPermission,
  redirectPath = '/login'
}) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // If checking permission and user doesn't have it, show unauthorized toast
  useEffect(() => {
    if (!isLoading && isAuthenticated && requiredPermission && !hasPermission(requiredPermission)) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access this resource.",
        variant: "destructive",
      });
    }
  }, [isLoading, isAuthenticated, requiredPermission, hasPermission, toast]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-[50vh] space-y-4">
        <Skeleton className="h-12 w-48 rounded-md" />
        <Skeleton className="h-4 w-64 rounded-md" />
        <Skeleton className="h-32 w-full max-w-md rounded-md" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If permission is required but user doesn't have it, redirect to dashboard
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has required permissions, render the protected route
  return <Outlet />;
};

export default AuthGuard;
