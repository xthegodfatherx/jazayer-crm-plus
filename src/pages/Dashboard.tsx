
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Users } from 'lucide-react';
import TaskSummary from '@/components/dashboard/TaskSummary';
import RevenueChart from '@/components/dashboard/RevenueChart';
import StatisticsChart, { MetricType } from '@/components/dashboard/StatisticsChart';
import { tasksApi } from '@/services/tasks-api';
import { teamApi } from '@/services/team-api';
import { useToast } from '@/hooks/use-toast';
import RecentActivity from '@/components/dashboard/RecentActivity';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [isLoading, setIsLoading] = useState(true);
  const [teamStats, setTeamStats] = useState({
    teamMembers: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch team data for team size
        const teamData = await teamApi.getMembers();
        
        setTeamStats({
          teamMembers: teamData.data.length
        });
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [toast]);

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
        <StatisticsChart type="revenue" period={period} />
        <StatisticsChart type="expenses" period={period} />
        <StatisticsChart type="invoices" period={period} />
        <StatisticsChart type="projects" period={period} />
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
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Active contributors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{isLoading ? 'Loading...' : teamStats.teamMembers}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>Active team members</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional summary cards can be added here */}
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
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;
