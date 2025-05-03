
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePermissions } from '@/contexts/PermissionsContext';
import RoleSwitcher from '@/components/admin/RoleSwitcher';
import TaskCategorySettings from '@/components/admin/TaskCategorySettings';

const Admin: React.FC = () => {
  const { userRole } = usePermissions();
  
  // Check if user has admin permissions
  if (userRole !== 'admin') {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">
                You don't have permission to access this page. Please contact an administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>

      <Tabs defaultValue="roles">
        <TabsList>
          <TabsTrigger value="roles">Role Management</TabsTrigger>
          <TabsTrigger value="task-categories">Task Categories</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RoleSwitcher />
            <Card>
              <CardHeader>
                <CardTitle>Permission Overview</CardTitle>
                <CardDescription>
                  Current system permissions by role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Configure detailed permissions in the Role Management tab.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="task-categories" className="mt-6">
          <TaskCategorySettings />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure global system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                System settings configuration will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
