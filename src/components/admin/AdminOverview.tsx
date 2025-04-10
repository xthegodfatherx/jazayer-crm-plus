
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Task } from '@/pages/Tasks';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StarIcon } from 'lucide-react';

const AdminOverview = () => {
  // Sample data - in a real app, this would come from an API
  const stats = {
    totalProjects: 12,
    totalTasks: 147,
    totalUsers: 24,
    activeTasks: 76,
    completedTasks: 71,
    hoursTracked: 243
  };

  const taskStatusData = [
    { name: 'To Do', value: 34, color: '#3b82f6' },
    { name: 'In Progress', value: 28, color: '#f59e0b' },
    { name: 'In Review', value: 14, color: '#8b5cf6' },
    { name: 'Completed', value: 71, color: '#10b981' }
  ];

  const timeData = [
    { name: 'Mon', hours: 24 },
    { name: 'Tue', hours: 32 },
    { name: 'Wed', hours: 38 },
    { name: 'Thu', hours: 28 },
    { name: 'Fri', hours: 42 },
    { name: 'Sat', hours: 8 },
    { name: 'Sun', hours: 6 }
  ];

  const topPerformers = [
    { id: 1, name: 'Ahmed Khalifi', tasks: 23, hours: 47, rating: 4.8 },
    { id: 2, name: 'Leila Benzema', tasks: 19, hours: 42, rating: 4.7 },
    { id: 3, name: 'Karim Mansouri', tasks: 21, hours: 39, rating: 4.5 },
    { id: 4, name: 'Selma Bouaziz', tasks: 18, hours: 37, rating: 4.4 },
    { id: 5, name: 'Amina Kader', tasks: 17, hours: 34, rating: 4.3 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <Badge variant="outline" className="mr-1 border-green-500 text-green-500">
                {stats.completedTasks} completed
              </Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-500">
                {stats.activeTasks} active
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hours Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hoursTracked}h</div>
            <div className="text-xs text-muted-foreground mt-1">This month</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Time Tracked This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hours" name="Hours" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {topPerformers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Avatar className="h-16 w-16 mb-2">
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium text-sm">{user.name}</h3>
                  <div className="mt-1 flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 text-sm">{user.rating}</span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <div>{user.tasks} tasks completed</div>
                    <div>{user.hours} hours tracked</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
