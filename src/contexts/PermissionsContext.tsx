
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the user roles and permissions types
export type UserRole = 'admin' | 'manager' | 'employee' | 'client';
type Permission = string;

interface PermissionsContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | null>(null);

// Role-based permissions mapping
const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    'admin.access',
    'users.manage',
    'roles.manage',
    'tasks.manage',
    'projects.manage',
    'invoices.manage',
    'settings.manage',
    'reports.access',
    'categories.manage',
    'salary.manage',
    'team.manage',
    'system.manage'
  ],
  manager: [
    'dashboard.access',
    'tasks.manage',
    'projects.manage',
    'team.view',
    'team.manage',
    'reports.access',
    'clients.manage',
    'invoices.view',
    'estimates.manage'
  ],
  employee: [
    'dashboard.access',
    'tasks.view',
    'tasks.update',
    'projects.view',
    'time.track',
    'profile.manage'
  ],
  client: [
    'dashboard.access',
    'projects.view',
    'invoices.view',
    'estimates.view',
    'profile.manage',
    'support.access'
  ]
};

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('admin'); // Default to admin for demonstration
  const [permissions, setPermissions] = useState<Permission[]>(rolePermissions.admin);

  // Update permissions when role changes
  useEffect(() => {
    setPermissions(rolePermissions[userRole] || []);
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

export const usePermissions = () => useContext(PermissionsContext);
