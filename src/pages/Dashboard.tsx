
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle, Star, Users, Receipt, ArrowUp, ArrowDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/dashboard/StatCard';
import TaskSummary from '@/components/dashboard/TaskSummary';
import TeamPerformance from '@/components/dashboard/TeamPerformance';
import RecentActivity from '@/components/dashboard/RecentActivity';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Tabs defaultValue="day">
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
          value="24" 
          change="+12%" 
          trend="up" 
          icon={<CheckCircle className="h-5 w-5 text-green-500" />} 
        />
        <StatCard 
          title="Pending Tasks" 
          value="18" 
          change="-3%" 
          trend="down" 
          icon={<Clock className="h-5 w-5 text-amber-500" />} 
        />
        <StatCard 
          title="Team Rating" 
          value="4.2" 
          change="+0.3" 
          trend="up" 
          icon={<Star className="h-5 w-5 text-yellow-500" />} 
        />
        <StatCard 
          title="Unpaid Invoices" 
          value="5" 
          change="+2" 
          trend="up" 
          icon={<Receipt className="h-5 w-5 text-red-500" />} 
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
            <TaskSummary />
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
