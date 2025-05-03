
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskCompletionReport from '@/components/reports/TaskCompletionReport';
import TeamTimeReport from '@/components/reports/TeamTimeReport';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BadgeCheck, Clock, Award, TrendingUp, Loader2 } from 'lucide-react';
import TeamPerformance from '@/components/team/TeamPerformance';
import { reportsApi } from '@/services/reports-api';
import { teamApi, TeamPerformance as TeamPerformanceType } from '@/services/team-api';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/services/api';

const AdminReports = () => {
  const [dateRange, setDateRange] = useState('this-month');
  const [topPerformers, setTopPerformers] = useState<TeamPerformanceType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTopPerformers = async () => {
      try {
        setLoading(true);
        const { data } = await teamApi.getPerformance(dateRange);
        // Sort by average rating descending to get top performers
        setTopPerformers(data.sort((a, b) => b.average_rating - a.average_rating).slice(0, 3));
      } catch (error) {
        handleError(error);
        toast({
          title: "Error loading performance data",
          description: "Failed to load team performance data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTopPerformers();
  }, [dateRange, toast]);

  const formatPerformanceScore = (score: number) => {
    return score.toFixed(1);
  };

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
            
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                <p>Loading performance data...</p>
              </div>
            ) : (
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
                      {topPerformers.length > 0 ? (
                        topPerformers.map((performer, index) => (
                          <div key={performer.id} className="flex justify-between items-center pb-2 border-b">
                            <div className="font-medium">{performer.member_name}</div>
                            <div className={`px-2 py-1 rounded-full text-sm font-medium ${
                              index === 0 ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              Score: {formatPerformanceScore(performer.average_rating)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No performance data available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Performance Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {topPerformers.length > 0 ? (
                      <div className="space-y-3">
                        {topPerformers.map((performer) => (
                          <div key={performer.id}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{performer.member_name}</span>
                              <span className="text-sm text-muted-foreground">{performer.completed_tasks} tasks</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-amber-500 rounded-full" 
                                style={{ width: `${(performer.completed_tasks / Math.max(performer.total_tasks, 1)) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No performance data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminReports;
