
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
  RefreshCw,
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi, Permission, Role } from '@/services/roles-api';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const RoleManagement = () => {
  const [activeRole, setActiveRole] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch roles and permissions
  const { 
    data: roles = [], 
    isLoading: isLoadingRoles, 
    error: rolesError 
  } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await rolesApi.getAll();
      if (response.data.length > 0 && !activeRole) {
        setActiveRole(response.data[0].id);
      }
      return response.data;
    }
  });
  
  const { 
    data: permissions = [], 
    isLoading: isLoadingPermissions, 
    error: permissionsError 
  } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const response = await rolesApi.getPermissions();
      return response.data;
    }
  });
  
  // Mutation to update role permissions
  const updateRolePermissionsMutation = useMutation({
    mutationFn: ({roleId, permissionIds}: {roleId: string, permissionIds: string[]}) => 
      rolesApi.updateRolePermissions(roleId, permissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: 'Permissions updated',
        description: 'Role permissions have been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Update failed',
        description: 'Could not update role permissions. Please try again.',
        variant: 'destructive',
      });
      console.error('Error updating role permissions:', error);
    },
  });

  const handlePermissionToggle = (roleId: string, permissionId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    
    const updatedPermissions = role.permissions.includes(permissionId)
      ? role.permissions.filter(id => id !== permissionId)
      : [...role.permissions, permissionId];
    
    // Optimistically update UI
    queryClient.setQueryData(['roles'], (oldRoles: Role[] | undefined) => {
      if (!oldRoles) return roles;
      return oldRoles.map(r => {
        if (r.id === roleId) {
          return { ...r, permissions: updatedPermissions };
        }
        return r;
      });
    });
  };

  const handleSavePermissions = () => {
    const roleToUpdate = roles.find(role => role.id === activeRole);
    if (!roleToUpdate) return;
    
    updateRolePermissionsMutation.mutate({
      roleId: roleToUpdate.id,
      permissionIds: roleToUpdate.permissions
    });
  };

  const getRoleIcon = (role: Role) => {
    switch (role.name.toLowerCase()) {
      case 'admin': return <Shield className="h-5 w-5 mr-2 text-red-600" />;
      case 'manager': 
      case 'team lead': return <UserCheck className="h-5 w-5 mr-2 text-purple-600" />;
      case 'employee': 
      case 'member': return <User className="h-5 w-5 mr-2 text-blue-600" />;
      case 'client': return <Users className="h-5 w-5 mr-2 text-green-600" />;
      default: return <User className="h-5 w-5 mr-2" />;
    }
  };

  const getActiveRole = () => roles.find(role => role.id === activeRole);
  
  // Handle loading and error states
  if (isLoadingRoles || isLoadingPermissions) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (rolesError || permissionsError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load roles and permissions. Please refresh and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Role & Permission Management</CardTitle>
            <Button 
              onClick={handleSavePermissions} 
              disabled={updateRolePermissionsMutation.isPending}
            >
              {updateRolePermissionsMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
          <CardDescription>
            Configure user roles and their permissions to control access to system features
          </CardDescription>
        </CardHeader>
        <CardContent>
          {roles.length === 0 ? (
            <Alert>
              <AlertTitle>No roles found</AlertTitle>
              <AlertDescription>
                No roles have been defined yet. Please create at least one role to manage permissions.
              </AlertDescription>
            </Alert>
          ) : (
            <Tabs defaultValue={activeRole} onValueChange={setActiveRole} className="space-y-4">
              <TabsList className="grid grid-cols-4 gap-2">
                {roles.map(role => (
                  <TabsTrigger key={role.id} value={role.id} className="flex items-center">
                    {getRoleIcon(role)}
                    <span>{role.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {roles.map(role => (
                <TabsContent key={role.id} value={role.id} className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center">
                        {getRoleIcon(role)}
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
                        {permissions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center">
                              No permissions found
                            </TableCell>
                          </TableRow>
                        ) : (
                          permissions.map(permission => (
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
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement;
