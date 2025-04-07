
import React, { useState } from 'react';
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
import { CheckCircle, Clock } from 'lucide-react';

interface TaskCompletionReportProps {
  dateRange: string;
}

const TaskCompletionReport: React.FC<TaskCompletionReportProps> = ({ dateRange }) => {
  const [filterUser, setFilterUser] = useState('all');

  // Mock data
  const teamMembers = [
    { id: '1', name: 'Ahmed Khalifi' },
    { id: '2', name: 'Selma Bouaziz' },
    { id: '3', name: 'Karim Mansouri' },
    { id: '4', name: 'Leila Benzema' },
    { id: '5', name: 'Mohammed Ali' },
  ];

  const taskCompletionData = [
    { name: 'Completed', value: 68 },
    { name: 'In Progress', value: 17 },
    { name: 'Pending', value: 10 },
    { name: 'Overdue', value: 5 },
  ];

  const taskRatingData = [
    { rating: 5, count: 22 },
    { rating: 4, count: 32 },
    { rating: 3, count: 18 },
    { rating: 2, count: 5 },
    { rating: 1, count: 2 },
  ];

  const performanceData = [
    { 
      name: 'Ahmed Khalifi', 
      completionRate: 92, 
      avgRating: 4.7, 
      onTimeRate: 95,
      tasksCompleted: 24,
      totalHours: 156,
      avgTaskTime: 6.5,
    },
    { 
      name: 'Selma Bouaziz', 
      completionRate: 88, 
      avgRating: 4.5, 
      onTimeRate: 90,
      tasksCompleted: 18,
      totalHours: 165,
      avgTaskTime: 9.2,
    },
    { 
      name: 'Karim Mansouri', 
      completionRate: 85, 
      avgRating: 4.2, 
      onTimeRate: 87,
      tasksCompleted: 15,
      totalHours: 148,
      avgTaskTime: 9.9,
    },
    { 
      name: 'Leila Benzema', 
      completionRate: 78, 
      avgRating: 3.9, 
      onTimeRate: 82,
      tasksCompleted: 19,
      totalHours: 172,
      avgTaskTime: 9.1,
    },
    { 
      name: 'Mohammed Ali', 
      completionRate: 80, 
      avgRating: 4.1, 
      onTimeRate: 85,
      tasksCompleted: 12,
      totalHours: 132,
      avgTaskTime: 11.0,
    },
  ];

  const COLORS = ['#4ade80', '#facc15', '#fb923c', '#f87171'];

  const filteredPerformanceData = filterUser === 'all' 
    ? performanceData 
    : performanceData.filter(user => user.name === filterUser);

  // Calculate averages
  const averageCompletionRate = performanceData.reduce((sum, user) => sum + user.completionRate, 0) / performanceData.length;
  const averageRating = performanceData.reduce((sum, user) => sum + user.avgRating, 0) / performanceData.length;
  const averageOnTimeRate = performanceData.reduce((sum, user) => sum + user.onTimeRate, 0) / performanceData.length;
  
  const totalTasksCompleted = performanceData.reduce((sum, user) => sum + user.tasksCompleted, 0);
  const totalTeamHours = performanceData.reduce((sum, user) => sum + user.totalHours, 0);
  const averageTaskTime = totalTeamHours / totalTasksCompleted;

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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Task Ratings Distribution</h3>
            <div className="h-[300px]">
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
                {filteredPerformanceData.map((user, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="" alt={user.name} />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Progress value={user.completionRate} className="h-2 w-24" />
                        <span>{user.completionRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <StarRating rating={user.avgRating} readOnly size="sm" />
                        <span>{user.avgRating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Progress value={user.onTimeRate} className="h-2 w-24" />
                        <span>{user.onTimeRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{user.tasksCompleted}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{user.avgTaskTime.toFixed(1)}h</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCompletionReport;
