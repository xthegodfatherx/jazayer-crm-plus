
import React from 'react';
import { usePermissions, UserRole } from '@/contexts/PermissionsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, UserCheck, User, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const RoleSwitcher = () => {
  const { userRole, setUserRole, permissions } = usePermissions();

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return <Shield className="h-5 w-5 mr-2 text-red-600" />;
      case 'manager': return <UserCheck className="h-5 w-5 mr-2 text-purple-600" />;
      case 'employee': return <User className="h-5 w-5 mr-2 text-blue-600" />;
      case 'client': return <Users className="h-5 w-5 mr-2 text-green-600" />;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'manager': return 'Manager / Team Lead';
      case 'employee': return 'Employee / Team Member';
      case 'client': return 'Client';
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'manager': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'employee': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'client': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Role Simulator</CardTitle>
        <CardDescription>Test the application with different user roles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Current Role:</span>
            <Badge className={getRoleBadgeColor(userRole)}>
              <div className="flex items-center">
                {getRoleIcon(userRole)}
                <span>{getRoleLabel(userRole)}</span>
              </div>
            </Badge>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Switch Role</label>
            <Select value={userRole} onValueChange={(value) => setUserRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-red-600" />
                    <span>Admin</span>
                  </div>
                </SelectItem>
                <SelectItem value="manager">
                  <div className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-2 text-purple-600" />
                    <span>Manager / Team Lead</span>
                  </div>
                </SelectItem>
                <SelectItem value="employee">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Employee / Team Member</span>
                  </div>
                </SelectItem>
                <SelectItem value="client">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-green-600" />
                    <span>Client</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Active permissions: {permissions.length}</p>
            <p className="text-xs mt-1">The UI will adapt based on the selected role's permissions</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleSwitcher;
