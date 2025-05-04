
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePermissions } from '@/contexts/PermissionsContext';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  ShieldCheck, 
  Star, 
  DollarSign, 
  FileText, 
  Mail, 
  Lock, 
  Settings, 
  Activity,
  UserCheck
} from 'lucide-react';

// Admin components
import RoleSwitcher from '@/components/admin/RoleSwitcher';
import RoleManagement from '@/components/admin/RoleManagement';
import AdminUserManagement from '@/components/admin/AdminUserManagement';
import TaskCategorySettings from '@/components/admin/TaskCategorySettings';
import AdminSalarySettings from '@/components/admin/AdminSalarySettings';
import AuditLogs from '@/components/admin/AuditLogs';
import AdminTeamManagement from '@/components/admin/AdminTeamManagement';
import InvoiceSettings from '@/components/admin/InvoiceSettings';
import EmailTemplateSettings from '@/components/admin/EmailTemplateSettings';
import SecuritySettings from '@/components/admin/SecuritySettings';
import SystemSettings from '@/components/admin/SystemSettings';

const Admin: React.FC = () => {
  const { userRole } = usePermissions();
  const [activeTab, setActiveTab] = useState('users');
  
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
        <h1 className="text-3xl font-bold">Admin Settings</h1>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="bg-muted/50 rounded-lg p-1 overflow-x-auto">
          <TabsList className="inline-flex min-w-full md:grid md:grid-cols-5 gap-1">
            <TabsTrigger value="users" className="flex items-center whitespace-nowrap">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">User Management</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center whitespace-nowrap">
              <ShieldCheck className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Role Management</span>
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center whitespace-nowrap">
              <UserCheck className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Team Management</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center whitespace-nowrap">
              <Star className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Categories & Pricing</span>
            </TabsTrigger>
            <TabsTrigger value="salary" className="flex items-center whitespace-nowrap">
              <DollarSign className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Salary Settings</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center whitespace-nowrap">
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Invoice Settings</span>
            </TabsTrigger>
            <TabsTrigger value="emails" className="flex items-center whitespace-nowrap">
              <Mail className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Email & Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center whitespace-nowrap">
              <Lock className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center whitespace-nowrap">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">System Info</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center whitespace-nowrap">
              <Activity className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Audit Logs</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="users" className="mt-6">
          <AdminUserManagement />
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <RoleManagement />
          </div>
        </TabsContent>
        
        <TabsContent value="teams" className="mt-6">
          <AdminTeamManagement />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <TaskCategorySettings />
        </TabsContent>

        <TabsContent value="salary" className="mt-6">
          <AdminSalarySettings />
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <InvoiceSettings />
        </TabsContent>

        <TabsContent value="emails" className="mt-6">
          <EmailTemplateSettings />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <SystemSettings />
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <AuditLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
