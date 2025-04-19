
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskCompletionReport from '@/components/reports/TaskCompletionReport';
import TeamTimeReport from '@/components/reports/TeamTimeReport';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BadgeCheck, Clock, Award, TrendingUp } from 'lucide-react';
import TeamPerformanceDashboard from '@/components/team/TeamPerformance';

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
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="task-completion" className="flex items-center gap-1">
              <BadgeCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="time-tracking" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Time</span>
            </TabsTrigger>
            <TabsTrigger value="vip-performance" className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">VIP</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="task-completion" className="space-y-4">
            <TaskCompletionReport dateRange={dateRange} />
          </TabsContent>
          
          <TabsContent value="time-tracking" className="space-y-4">
            <TeamTimeReport dateRange={dateRange} />
          </TabsContent>
          
          <TabsContent value="vip-performance" className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-amber-900 flex items-center mb-2">
                <Award className="h-5 w-5 mr-2 text-amber-500" />
                VIP Performance Metrics
              </h3>
              <p className="text-sm text-amber-800">
                The VIP performance metrics help identify top performers based on a weighted 
                scoring system that takes into account task completion, time tracking efficiency, 
                and quality of work.
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-amber-500" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <div className="font-medium">Ahmed Khalifi</div>
                      <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
                        Score: 32.5
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <div className="font-medium">Selma Bouaziz</div>
                      <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
                        Score: 29.8
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <div className="font-medium">Karim Mansouri</div>
                      <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
                        Score: 24.1
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Performance Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Ahmed Khalifi</span>
                        <span className="text-sm text-muted-foreground">32 tasks</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Selma Bouaziz</span>
                        <span className="text-sm text-muted-foreground">28 tasks</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Karim Mansouri</span>
                        <span className="text-sm text-muted-foreground">22 tasks</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminReports;
