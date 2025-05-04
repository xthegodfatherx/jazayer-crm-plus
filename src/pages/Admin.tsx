
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  UserCheck,
  Building,
  ChevronRight
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

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
import { settingsApi } from '@/services/settings-api';
import CompanySettings from '@/components/admin/CompanySettings';
import { useAuth } from '@/contexts/AuthContext';

const Admin: React.FC = () => {
  const { userRole, hasPermission, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Fetch company info using React Query
  const { 
    data: systemSettings, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: () => settingsApi.getSystemSettings(),
    meta: {
      onError: (err: Error) => {
        toast({
          title: "Error loading system settings",
          description: "Please try again or contact support.",
          variant: "destructive"
        });
        console.error("Error fetching system settings:", err);
      }
    }
  });

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && userRole !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [userRole, authLoading, navigate, toast]);
  
  // Check if user has admin permissions
  if (authLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }
  
  if (userRole !== 'admin') {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access this page. Please contact an administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-[1400px] mx-auto">
      <div className="bg-gradient-to-r from-purple-100 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center">
              <span className="bg-purple-600 text-white p-2 rounded-lg mr-3">
                <Settings className="h-6 w-6" />
              </span>
              {systemSettings?.company_name || "Admin Dashboard"} 
              <ChevronRight className="h-5 w-5 mx-2 text-slate-500" />
              <span className="text-purple-600 dark:text-purple-400">Admin Control Panel</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Manage your organization's settings, users, teams, and more
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 dark:text-slate-400">Current role:</span>
            <RoleSwitcher />
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load system settings. Please refresh and try again.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-950 pt-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <TabsList className="grid md:grid-cols-6 gap-1 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
            <TabsTrigger value="company" className="flex items-center whitespace-nowrap data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm">
              <Building className="h-4 w-4 mr-2" />
              <span>Company</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center whitespace-nowrap data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm">
              <Users className="h-4 w-4 mr-2" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center whitespace-nowrap data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm">
              <ShieldCheck className="h-4 w-4 mr-2" />
              <span>Roles</span>
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center whitespace-nowrap data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm">
              <UserCheck className="h-4 w-4 mr-2" />
              <span>Teams</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center whitespace-nowrap data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm">
              <Star className="h-4 w-4 mr-2" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="salary" className="flex items-center whitespace-nowrap data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>Salary</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center whitespace-nowrap data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm">
              <FileText className="h-4 w-4 mr-2" />
              <span>Invoices</span>
            </TabsTrigger>
            <TabsTrigger value="emails" className="flex items-center whitespace-nowrap data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm">
              <Mail className="h-4 w-4 mr-2" />
              <span>Emails</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center whitespace-nowrap data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm">
              <Lock className="h-4 w-4 mr-2" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center whitespace-nowrap data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm">
              <Settings className="h-4 w-4 mr-2" />
              <span>System</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center whitespace-nowrap data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm">
              <Activity className="h-4 w-4 mr-2" />
              <span>Logs</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="company" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Building className="h-5 w-5 text-purple-500" />
                  Company Settings
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Manage your organization's profile and general settings
                </p>
                <Separator className="my-4" />
              </div>
              <CompanySettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  User Management
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Add, edit, or remove users and manage their permissions
                </p>
                <Separator className="my-4" />
              </div>
              <AdminUserManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-purple-500" />
                  Role Management
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Define and manage user roles and their associated permissions
                </p>
                <Separator className="my-4" />
              </div>
              <RoleManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="teams" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-purple-500" />
                  Team Management
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Create and manage teams, assign members, and set team leaders
                </p>
                <Separator className="my-4" />
              </div>
              <AdminTeamManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-500" />
                  Categories & Pricing
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Manage task categories and pricing tiers
                </p>
                <Separator className="my-4" />
              </div>
              <TaskCategorySettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-500" />
                  Salary Settings
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Configure salary calculations, bonuses, and payment schedules
                </p>
                <Separator className="my-4" />
              </div>
              <AdminSalarySettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  Invoice Settings
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Configure invoice templates, payment terms, and tax settings
                </p>
                <Separator className="my-4" />
              </div>
              <InvoiceSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-500" />
                  Email & Notifications
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Manage email templates and notification settings
                </p>
                <Separator className="my-4" />
              </div>
              <EmailTemplateSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-500" />
                  Security Settings
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Configure password policies, two-factor authentication, and other security features
                </p>
                <Separator className="my-4" />
              </div>
              <SecuritySettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-500" />
                  System Information
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  View system status, version information, and configuration details
                </p>
                <Separator className="my-4" />
              </div>
              <SystemSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                  Audit Logs
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  View user activity and system event logs
                </p>
                <Separator className="my-4" />
              </div>
              <AuditLogs />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
