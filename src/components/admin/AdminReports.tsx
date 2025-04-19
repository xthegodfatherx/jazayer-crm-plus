
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskCompletionReport from '@/components/reports/TaskCompletionReport';
import TeamTimeReport from '@/components/reports/TeamTimeReport';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminReports = () => {
  const [dateRange, setDateRange] = useState('this-month');

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Reports & Analytics</CardTitle>
            <CardDescription>Monitor team performance and productivity</CardDescription>
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-quarter">Last Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="task-completion" className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="task-completion">Task Completion</TabsTrigger>
            <TabsTrigger value="time-tracking">Time Tracking</TabsTrigger>
          </TabsList>
          
          <TabsContent value="task-completion" className="space-y-4">
            <TaskCompletionReport dateRange={dateRange} />
          </TabsContent>
          
          <TabsContent value="time-tracking" className="space-y-4">
            <TeamTimeReport dateRange={dateRange} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminReports;
