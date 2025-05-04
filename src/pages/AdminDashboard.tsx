
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Users, 
  Folders, 
  CheckSquare, 
  Clock, 
  FileText,
  CreditCard,
  Settings,
  BarChart,
  ShieldCheck,
  Mail,
  Star,
  DollarSign,
  Activity
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminUserManagement from '@/components/admin/AdminUserManagement';
import AdminProjectManagement from '@/components/admin/AdminProjectManagement';
import AdminTaskManagement from '@/components/admin/AdminTaskManagement';
import AdminTimeTracking from '@/components/admin/AdminTimeTracking';
import AdminInvoiceManagement from '@/components/admin/AdminInvoiceManagement';
import AdminSubscriptions from '@/components/admin/AdminSubscriptions';
import AdminReports from '@/components/admin/AdminReports';
import AdminSettings from '@/components/admin/AdminSettings';
import RoleManagement from '@/components/admin/RoleManagement';
import AuditLogs from '@/components/admin/AuditLogs';
import EmailTemplates from '@/components/admin/EmailTemplates';
import TaskCategorySettings from '@/components/admin/TaskCategorySettings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
    { id: 'users', label: 'Users', icon: <Users className="h-4 w-4 mr-2" /> },
    { id: 'roles', label: 'Roles', icon: <ShieldCheck className="h-4 w-4 mr-2" /> },
    { id: 'projects', label: 'Projects', icon: <Folders className="h-4 w-4 mr-2" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="h-4 w-4 mr-2" /> },
    { id: 'categories', label: 'Categories', icon: <Star className="h-4 w-4 mr-2" /> },
    { id: 'time', label: 'Time Tracking', icon: <Clock className="h-4 w-4 mr-2" /> },
    { id: 'invoices', label: 'Invoices', icon: <FileText className="h-4 w-4 mr-2" /> },
    { id: 'subscriptions', label: 'Subscriptions', icon: <CreditCard className="h-4 w-4 mr-2" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart className="h-4 w-4 mr-2" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4 mr-2" /> },
    { id: 'emails', label: 'Emails', icon: <Mail className="h-4 w-4 mr-2" /> },
    { id: 'salary', label: 'Salary', icon: <DollarSign className="h-4 w-4 mr-2" /> },
    { id: 'logs', label: 'Audit Logs', icon: <Activity className="h-4 w-4 mr-2" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-muted/50 rounded-lg p-1 overflow-x-auto">
          <TabsList className="inline-flex min-w-full md:grid md:grid-cols-7 gap-1">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center whitespace-nowrap">
                {tab.icon}
                <span className="hidden md:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <AdminOverview />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <AdminUserManagement />
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-6">
          <RoleManagement />
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-6">
          <AdminProjectManagement />
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-6">
          <AdminTaskManagement />
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-6">
          <TaskCategorySettings />
        </TabsContent>
        
        <TabsContent value="time" className="space-y-6">
          <AdminTimeTracking />
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-6">
          <AdminInvoiceManagement />
        </TabsContent>
        
        <TabsContent value="subscriptions" className="space-y-6">
          <AdminSubscriptions />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <AdminReports />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <AdminSettings />
        </TabsContent>
        
        <TabsContent value="emails" className="space-y-6">
          <EmailTemplates />
        </TabsContent>
        
        <TabsContent value="salary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Salary Settings</CardTitle>
              <CardDescription>Configure salary calculation methods and rules</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Salary settings are configured in the System Settings tab, under the Salary section.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-6">
          <AuditLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
