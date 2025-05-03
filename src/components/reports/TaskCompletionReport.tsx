
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from '@/components/tasks/StarRating';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';
import { teamApi, TeamPerformance as TeamPerformanceType } from '@/services/team-api';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/services/api';

interface TaskCompletionReportProps {
  dateRange: string;
}

interface TaskStats {
  name: string;
  value: number;
}

interface TaskRating {
  rating: number;
  count: number;
}

const TaskCompletionReport: React.FC<TaskCompletionReportProps> = ({ dateRange }) => {
  const [filterUser, setFilterUser] = useState('all');
  const [teamMembers, setTeamMembers] = useState<{id: string; name: string}[]>([]);
  const [performanceData, setPerformanceData] = useState<TeamPerformanceType[]>([]);
  const [taskCompletionData, setTaskCompletionData] = useState<TaskStats[]>([]);
  const [taskRatingData, setTaskRatingData] = useState<TaskRating[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTaskCompletionData = async () => {
      try {
        setLoading(true);
        
        // Convert date range to API filter format
        let period = 'current-month';
        switch (dateRange) {
          case 'This Week':
            period = 'current-week';
            break;
          case 'This Month':
            period = 'current-month';
            break;
          case 'Last 3 Months':
            period = 'last-quarter';
            break;
          case 'This Year':
            period = 'current-year';
            break;
          default:
            period = 'current-month';
        }
        
        // Fetch team performance data
        const { data } = await teamApi.getPerformance(period);
        setPerformanceData(data);
        
        // Extract team members for filter dropdown
        const members = data.map(member => ({
          id: member.member_id,
          name: member.member_name
        }));
        setTeamMembers(members);
        
        // Calculate task completion data
        const completedTasks = data.reduce((sum, member) => sum + member.completed_tasks, 0);
        const inProgressTasks = data.reduce((sum, member) => sum + (member.total_tasks - member.completed_tasks), 0);
        
        setTaskCompletionData([
          { name: 'Completed', value: completedTasks },
          { name: 'In Progress', value: inProgressTasks },
        ]);
        
        // Calculate task rating distribution
        // This is simplified - in reality, you would get this from the API
        const ratingCounts = [0, 0, 0, 0, 0]; // Initialize counts for ratings 1-5
        
        data.forEach(member => {
          // This is a simplified calculation - in a real app, you'd get actual task ratings
          const rating = Math.round(member.average_rating);
          if (rating >= 1 && rating <= 5) {
            ratingCounts[rating - 1] += member.completed_tasks;
          }
        });
        
        const ratings: TaskRating[] = [];
        for (let i = 0; i < 5; i++) {
          ratings.push({
            rating: i + 1,
            count: ratingCounts[i]
          });
        }
        
        setTaskRatingData(ratings);
      } catch (error) {
        handleError(error);
        toast({
          title: "Error loading task completion data",
          description: "Failed to load task completion report. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTaskCompletionData();
  }, [dateRange, toast]);

  const filteredPerformanceData = filterUser === 'all' 
    ? performanceData 
    : performanceData.filter(user => user.member_name === filterUser);

  // Calculate averages
  const averageCompletionRate = performanceData.length > 0 
    ? performanceData.reduce((sum, user) => sum + (user.completed_tasks / Math.max(user.total_tasks, 1) * 100), 0) / performanceData.length 
    : 0;
    
  const averageRating = performanceData.length > 0 
    ? performanceData.reduce((sum, user) => sum + user.average_rating, 0) / performanceData.length 
    : 0;
    
  const averageOnTimeRate = 85; // This would come from another API endpoint
  
  const totalTasksCompleted = performanceData.reduce((sum, user) => sum + user.completed_tasks, 0);
  const totalTeamHours = performanceData.reduce((sum, user) => sum + (user.total_hours || 0), 0);
  const averageTaskTime = totalTasksCompleted > 0 ? totalTeamHours / totalTasksCompleted : 0;

  const COLORS = ['#4ade80', '#facc15', '#fb923c', '#f87171'];

  if (loading) {
    return (
      <div className="flex justify-center items-center p-16">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p>Loading task completion data...</p>
      </div>
    );
  }

  if (performanceData.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No task completion data available for the selected period.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">{totalTasksCompleted}</div>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">{averageCompletionRate.toFixed(0)}%</div>
            <div className="w-full mt-2">
              <Progress value={averageCompletionRate} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">Completion Rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex mt-2">
              <StarRating rating={averageRating} readOnly size="sm" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">{averageTaskTime.toFixed(1)}h</div>
            <div className="flex items-center mt-2">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Avg. Task Time</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Task Completion Analysis</h3>
        <Select value={filterUser} onValueChange={setFilterUser}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Team Members</SelectItem>
            {teamMembers.map(member => (
              <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Task Status Distribution</h3>
            <div className="h-[300px] flex items-center justify-center">
              {taskCompletionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskCompletionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {taskCompletionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} tasks`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No task status data available.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Task Ratings Distribution</h3>
            <div className="h-[300px]">
              {taskRatingData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={taskRatingData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="rating" label={{ value: 'Star Rating', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Number of Tasks', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value} tasks`, '']} />
                    <Bar dataKey="count" name="Tasks" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No task rating data available.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Member Performance Table */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Team Member Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Team Member</th>
                  <th className="text-left py-3 px-4">Completion Rate</th>
                  <th className="text-left py-3 px-4">Average Rating</th>
                  <th className="text-left py-3 px-4">On-Time Rate</th>
                  <th className="text-left py-3 px-4">Tasks Completed</th>
                  <th className="text-left py-3 px-4">Avg. Task Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredPerformanceData.map((user, index) => {
                  const completionRate = user.total_tasks > 0 
                    ? (user.completed_tasks / user.total_tasks) * 100 
                    : 0;
                  
                  const avgTaskTime = user.completed_tasks > 0 && user.total_hours 
                    ? user.total_hours / user.completed_tasks 
                    : 0;
                    
                  return (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src="" alt={user.member_name} />
                            <AvatarFallback>{user.member_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span>{user.member_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Progress value={completionRate} className="h-2 w-24" />
                          <span>{completionRate.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <StarRating rating={user.average_rating} readOnly size="sm" />
                          <span>{user.average_rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Progress value={averageOnTimeRate} className="h-2 w-24" />
                          <span>{averageOnTimeRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{user.completed_tasks}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{avgTaskTime.toFixed(1)}h</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCompletionReport;
