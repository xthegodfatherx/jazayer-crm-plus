
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define all possible permissions
export type Permission = 
  | 'view-dashboard'
  | 'create-projects'
  | 'assign-tasks'
  | 'view-all-projects'
  | 'create-tasks'
  | 'edit-tasks'
  | 'track-time'
  | 'view-time-logs'
  | 'rate-tasks'
  | 'pin-tasks'
  | 'filter-reports'
  | 'view-reports'
  | 'manage-users'
  | 'view-invoices'
  | 'edit-invoices'
  | 'use-invoice-builder'
  | 'view-subscriptions'
  | 'view-company-performance';

// Define user roles
export type UserRole = 'admin' | 'manager' | 'employee' | 'client';

interface PermissionsContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const permissionsByRole: Record<UserRole, Permission[]> = {
  admin: [
    'view-dashboard', 'create-projects', 'assign-tasks', 'view-all-projects',
    'create-tasks', 'edit-tasks', 'view-time-logs', 'rate-tasks',
    'pin-tasks', 'filter-reports', 'view-reports', 'manage-users',
    'view-invoices', 'edit-invoices', 'use-invoice-builder', 'view-subscriptions',
    'view-company-performance'
  ],
  manager: [
    'view-dashboard', 'create-projects', 'assign-tasks', 'view-all-projects',
    'create-tasks', 'edit-tasks', 'track-time', 'view-time-logs', 
    'rate-tasks', 'pin-tasks', 'filter-reports', 'view-reports',
    'view-invoices', 'edit-invoices', 'use-invoice-builder', 'view-subscriptions'
  ],
  employee: [
    'view-dashboard', 'view-all-projects', 'create-tasks', 'edit-tasks',
    'track-time', 'view-time-logs', 'pin-tasks', 'filter-reports', 'view-reports'
  ],
  client: [
    'view-dashboard', 'view-all-projects', 'view-invoices', 'view-subscriptions'
  ]
};

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In a real application, this would be fetched from an API or authentication system
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [permissions, setPermissions] = useState<Permission[]>(permissionsByRole.admin);

  useEffect(() => {
    // Update permissions when role changes
    setPermissions(permissionsByRole[userRole]);
  }, [userRole]);

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  return (
    <PermissionsContext.Provider value={{ userRole, setUserRole, permissions, hasPermission }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = (): PermissionsContextType => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

// Higher-order component for permission-based access control
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: Permission
): React.FC<P> {
  return (props: P) => {
    const { hasPermission } = usePermissions();
    
    if (!hasPermission(requiredPermission)) {
      return <div className="p-4 text-center">You don't have permission to access this feature.</div>;
    }
    
    return <Component {...props} />;
  };
}
