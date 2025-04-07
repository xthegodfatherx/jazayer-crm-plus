
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import StarRating from '../tasks/StarRating';

const teamPerformanceData = [
  { name: 'Ahmed', tasks: 24, rating: 4.8, onTime: 96 },
  { name: 'Selma', tasks: 18, rating: 4.5, onTime: 92 },
  { name: 'Karim', tasks: 12, rating: 4.2, onTime: 90 },
  { name: 'Leila', tasks: 15, rating: 3.9, onTime: 86 },
  { name: 'Mohammed', tasks: 8, rating: 4.0, onTime: 88 },
];

const averageRating = teamPerformanceData.reduce((sum, member) => sum + member.rating, 0) / teamPerformanceData.length;
const totalTasks = teamPerformanceData.reduce((sum, member) => sum + member.tasks, 0);
const averageOnTime = teamPerformanceData.reduce((sum, member) => sum + member.onTime, 0) / teamPerformanceData.length;

const TeamPerformanceDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex mt-2">
              <StarRating rating={averageRating} readOnly />
            </div>
            <p className="text-sm text-muted-foreground mt-3">Average Rating</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">{totalTasks}</div>
            <p className="text-sm text-muted-foreground mt-3">Tasks Completed This Month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">{averageOnTime.toFixed(0)}%</div>
            <div className="w-full mt-2">
              <Progress value={averageOnTime} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground mt-3">On-Time Completion Rate</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Rating Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>Task completion and quality ratings by team member</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={teamPerformanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="tasks" name="Tasks Completed" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="rating" name="Rating (out of 5)" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Team members with the highest ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamPerformanceData
              .sort((a, b) => b.rating - a.rating)
              .map((member, index) => (
                <div key={member.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full mr-4 text-white font-medium",
                      index === 0 ? "bg-yellow-500" : 
                      index === 1 ? "bg-gray-400" : 
                      index === 2 ? "bg-amber-700" : "bg-gray-200 text-gray-500"
                    )}>
                      {index + 1}
                    </div>
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src="" alt={member.name} />
                      <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.tasks} tasks completed</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <StarRating rating={member.rating} readOnly />
                    <span className="ml-2 font-medium">{member.rating}</span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamPerformanceDashboard;
