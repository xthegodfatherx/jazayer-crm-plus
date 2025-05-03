import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronDown, ChevronUp, Clock, DollarSign, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import TaskSummary from '@/components/dashboard/TaskSummary';
import RevenueChart from '@/components/dashboard/RevenueChart';
import { tasksApi } from '@/services/tasks-api';
import { teamApi } from '@/services/team-api';
import { projectsApi } from '@/services/api';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    pendingInvoices: 0,
    activeProjects: 0,
    completedTasks: 0,
    pendingTasks: 0,
    teamMembers: 0
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all required data in parallel
        const [tasksData, teamData, projectsData] = await Promise.all([
          tasksApi.getAll(),
          teamApi.getMembers(),
          projectsApi.getAll()
        ]);
        
        // Calculate dashboard metrics
        const completedTasks = tasksData.data.filter(task => task.status === 'done').length;
        const pendingTasks = tasksData.data.filter(task => task.status !== 'done').length;
        
        setDashboardData({
          totalRevenue: 125000,
          totalExpenses: 45000,
          pendingInvoices: 12,
          activeProjects: projectsData.data.filter(project => project.status === 'active').length,
          completedTasks,
          pendingTasks,
          teamMembers: teamData.data.length
        });
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Tabs defaultValue={period} onValueChange={(value) => setPeriod(value as 'day' | 'week' | 'month')}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon">
            <CalendarDays className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalRevenue.toLocaleString()} DZD</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ChevronUp className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-green-500">+12.5%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalExpenses.toLocaleString()} DZD</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ChevronDown className="h-4 w-4 mr-1 text-red-500" />
              <span className="text-red-500">-4.2%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.pendingInvoices}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ChevronUp className="h-4 w-4 mr-1 text-amber-500" />
              <span className="text-amber-500">+2</span>
              <span className="ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.activeProjects}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ChevronUp className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-green-500">+1</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Status</CardTitle>
                <CardDescription>Distribution of tasks by status</CardDescription>
              </CardHeader>
              <CardContent>
                <TaskSummary period={period} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Monthly revenue overview</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <RevenueChart />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tasks Completed</CardTitle>
                <CardDescription>This {period}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dashboardData.completedTasks}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <ChevronUp className="h-4 w-4 mr-1 text-green-500" />
                  <span className="text-green-500">+8.2%</span>
                  <span className="ml-1">from last {period}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dashboardData.pendingTasks}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <ChevronDown className="h-4 w-4 mr-1 text-red-500" />
                  <span className="text-red-500">-2.5%</span>
                  <span className="ml-1">from last {period}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Active contributors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{dashboardData.teamMembers}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>No change</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Analytics will be shown here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Reports will be shown here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Notifications will be shown here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <div className="space-y-2">
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge>Invoice</Badge>
                <span className="font-medium">New invoice #INV-2023-012 created</span>
              </div>
              <span className="text-sm text-muted-foreground">1 hour ago</span>
            </div>
          </div>
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Task</Badge>
                <span className="font-medium">Task "Update API documentation" completed</span>
              </div>
              <span className="text-sm text-muted-foreground">3 hours ago</span>
            </div>
          </div>
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Project</Badge>
                <span className="font-medium">New project "E-commerce Redesign" created</span>
              </div>
              <span className="text-sm text-muted-foreground">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
