
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle, Star, Users, Receipt, ArrowUp, ArrowDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/dashboard/StatCard';
import TaskSummary from '@/components/dashboard/TaskSummary';
import TeamPerformance from '@/components/dashboard/TeamPerformance';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/services/api';

// Import necessary APIs
import { tasksApi } from '@/services/tasks-api';
import { teamApi } from '@/services/team-api';
import { invoiceApi } from '@/services/invoice-api';
import { activityApi } from '@/services/activity-api';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month'>('day');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completedTasks: 0,
    pendingTasks: 0,
    teamRating: 0,
    unpaidInvoices: 0,
    tasksCompletedChange: 0,
    pendingTasksChange: 0,
    teamRatingChange: 0,
    unpaidInvoicesChange: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all required data in parallel
        const [tasksData, teamData, invoiceData] = await Promise.all([
          tasksApi.getStats({ period: dateRange }),
          teamApi.getPerformance(dateRange === 'day' ? 'current-day' : 
                                dateRange === 'week' ? 'current-week' : 'current-month'),
          invoiceApi.getStats({ status: 'unpaid', period: dateRange })
        ]);
        
        // Calculate average team rating
        const avgRating = teamData.data.reduce((sum, member) => sum + (member.average_rating || 0), 0) / 
                        (teamData.data.length || 1);
        
        // Update stats
        setStats({
          completedTasks: tasksData.data.completed || 0,
          pendingTasks: tasksData.data.pending || 0,
          teamRating: parseFloat(avgRating.toFixed(1)),
          unpaidInvoices: invoiceData.data.count || 0,
          tasksCompletedChange: tasksData.data.completed_change || 0,
          pendingTasksChange: tasksData.data.pending_change || 0,
          teamRatingChange: parseFloat((tasksData.data.rating_change || 0).toFixed(1)),
          unpaidInvoicesChange: invoiceData.data.count_change || 0
        });
      } catch (error) {
        handleError(error);
        toast({
          title: "Error loading dashboard",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dateRange, toast]);

  const formatChange = (value: number): string => {
    if (value === 0) return "0%";
    return value > 0 ? `+${value}%` : `${value}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Tabs value={dateRange} onValueChange={(value: 'day' | 'week' | 'month') => setDateRange(value)}>
            <TabsList>
              <TabsTrigger value="day">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Tasks Completed" 
          value={stats.completedTasks.toString()}
          change={formatChange(stats.tasksCompletedChange)}
          trend={stats.tasksCompletedChange >= 0 ? "up" : "down"}
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          loading={loading}
        />
        <StatCard 
          title="Pending Tasks" 
          value={stats.pendingTasks.toString()}
          change={formatChange(stats.pendingTasksChange)}
          trend={stats.pendingTasksChange <= 0 ? "down" : "up"} // Negative change is good for pending tasks
          icon={<Clock className="h-5 w-5 text-amber-500" />}
          loading={loading}
        />
        <StatCard 
          title="Team Rating" 
          value={stats.teamRating.toString()}
          change={formatChange(stats.teamRatingChange)}
          trend={stats.teamRatingChange >= 0 ? "up" : "down"}
          icon={<Star className="h-5 w-5 text-yellow-500" />}
          loading={loading}
        />
        <StatCard 
          title="Unpaid Invoices" 
          value={stats.unpaidInvoices.toString()}
          change={formatChange(stats.unpaidInvoicesChange)}
          trend={stats.unpaidInvoicesChange <= 0 ? "down" : "up"} // Negative change is good for unpaid invoices
          icon={<Receipt className="h-5 w-5 text-red-500" />}
          loading={loading}
        />
      </div>

      {/* Task Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
            <CardDescription>Task distribution by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskSummary period={dateRange} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Average rating by team member</CardDescription>
          </CardHeader>
          <CardContent>
            <TeamPerformance />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across the system</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivity />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
