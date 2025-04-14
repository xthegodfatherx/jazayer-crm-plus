
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  User, 
  UserCheck, 
  UserPlus,
  Save,
  RefreshCw 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: string[];
}

const RoleManagement = () => {
  // Sample permissions data - in a real app this would come from an API
  const [permissions, setPermissions] = useState<Permission[]>([
    { id: 'view-dashboard', name: 'View Dashboard', description: 'Access to view dashboard' },
    { id: 'create-projects', name: 'Create Projects', description: 'Ability to create new projects' },
    { id: 'assign-tasks', name: 'Assign Tasks', description: 'Ability to assign tasks to users' },
    { id: 'view-all-projects', name: 'View All Projects', description: 'Access to view all projects' },
    { id: 'create-tasks', name: 'Create Tasks', description: 'Ability to create new tasks' },
    { id: 'edit-tasks', name: 'Edit Tasks', description: 'Ability to edit tasks' },
    { id: 'track-time', name: 'Track Time', description: 'Ability to track time on tasks' },
    { id: 'view-time-logs', name: 'View Time Logs', description: 'Access to view time tracking logs' },
    { id: 'rate-tasks', name: 'Rate Tasks', description: 'Ability to rate task performance' },
    { id: 'pin-tasks', name: 'Pin Tasks', description: 'Ability to pin important tasks' },
    { id: 'filter-reports', name: 'Filter Reports', description: 'Ability to filter and customize reports' },
    { id: 'view-reports', name: 'View Reports', description: 'Access to view analytics reports' },
    { id: 'manage-users', name: 'Manage Users', description: 'Ability to create, edit and delete users' },
    { id: 'view-invoices', name: 'View Invoices', description: 'Access to view invoices' },
    { id: 'edit-invoices', name: 'Edit Invoices', description: 'Ability to edit invoice details' },
    { id: 'use-invoice-builder', name: 'Use Invoice Builder', description: 'Access to the invoice builder tool' },
    { id: 'view-subscriptions', name: 'View Subscriptions', description: 'Access to view subscription plans' },
    { id: 'view-company-performance', name: 'View Company Performance', description: 'Access to view overall company metrics' }
  ]);

  // Sample roles with corresponding permissions
  const [roles, setRoles] = useState<Role[]>([
    { 
      id: 'admin', 
      name: 'Admin', 
      description: 'Full system access', 
      color: 'bg-red-100 text-red-800 border-red-200',
      permissions: [
        'view-dashboard', 'create-projects', 'assign-tasks', 'view-all-projects',
        'create-tasks', 'edit-tasks', 'view-time-logs', 'rate-tasks',
        'pin-tasks', 'filter-reports', 'view-reports', 'manage-users',
        'view-invoices', 'edit-invoices', 'use-invoice-builder', 'view-subscriptions',
        'view-company-performance'
      ]
    },
    { 
      id: 'manager', 
      name: 'Manager / Team Lead', 
      description: 'Team management capabilities', 
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      permissions: [
        'view-dashboard', 'create-projects', 'assign-tasks', 'view-all-projects',
        'create-tasks', 'edit-tasks', 'track-time', 'view-time-logs', 
        'rate-tasks', 'pin-tasks', 'filter-reports', 'view-reports',
        'view-invoices', 'edit-invoices', 'use-invoice-builder', 'view-subscriptions'
      ]
    },
    { 
      id: 'employee', 
      name: 'Employee / Team Member', 
      description: 'Basic access for team members', 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      permissions: [
        'view-dashboard', 'view-all-projects', 'create-tasks', 'edit-tasks',
        'track-time', 'view-time-logs', 'pin-tasks', 'filter-reports', 'view-reports'
      ]
    },
    { 
      id: 'client', 
      name: 'Client', 
      description: 'Limited access for clients', 
      color: 'bg-green-100 text-green-800 border-green-200',
      permissions: [
        'view-dashboard', 'view-all-projects', 'view-invoices', 'view-subscriptions'
      ]
    }
  ]);

  const [activeRole, setActiveRole] = useState<string>('admin');

  const handlePermissionToggle = (roleId: string, permissionId: string) => {
    setRoles(prevRoles => 
      prevRoles.map(role => {
        if (role.id === roleId) {
          const updatedPermissions = role.permissions.includes(permissionId)
            ? role.permissions.filter(id => id !== permissionId)
            : [...role.permissions, permissionId];
          
          return { ...role, permissions: updatedPermissions };
        }
        return role;
      })
    );
  };

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'admin': return <Shield className="h-5 w-5 mr-2 text-red-600" />;
      case 'manager': return <UserCheck className="h-5 w-5 mr-2 text-purple-600" />;
      case 'employee': return <User className="h-5 w-5 mr-2 text-blue-600" />;
      case 'client': return <Users className="h-5 w-5 mr-2 text-green-600" />;
      default: return <User className="h-5 w-5 mr-2" />;
    }
  };

  const getActiveRole = () => roles.find(role => role.id === activeRole);

  const handleSavePermissions = () => {
    // In a real app, this would send the updated roles to an API
    console.log('Saving updated permissions:', roles);
    // Show toast or notification
    alert('Permissions saved successfully!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Role & Permission Management</CardTitle>
            <Button onClick={handleSavePermissions}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
          <CardDescription>
            Configure user roles and their permissions to control access to system features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeRole} onValueChange={setActiveRole} className="space-y-4">
            <TabsList className="grid grid-cols-4 gap-2">
              {roles.map(role => (
                <TabsTrigger key={role.id} value={role.id} className="flex items-center">
                  {getRoleIcon(role.id)}
                  <span>{role.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {roles.map(role => (
              <TabsContent key={role.id} value={role.id} className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center">
                      {getRoleIcon(role.id)}
                      <h3 className="text-lg font-medium">{role.name}</h3>
                      <Badge className={`ml-2 ${role.color}`}>
                        {role.permissions.length} Permissions
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset to Default
                    </Button>
                    <Button variant="outline" size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add New Role
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Permission</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[100px] text-center">Enabled</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permissions.map(permission => (
                        <TableRow key={permission.id}>
                          <TableCell className="font-medium">{permission.name}</TableCell>
                          <TableCell>{permission.description}</TableCell>
                          <TableCell className="text-center">
                            <Checkbox 
                              checked={role.permissions.includes(permission.id)} 
                              onCheckedChange={() => handlePermissionToggle(role.id, permission.id)}
                              className="mx-auto"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement;
