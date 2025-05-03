
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { tasksApi, TaskStats } from '@/services/tasks-api';
import { Skeleton } from '@/components/ui/skeleton';

interface TaskSummaryProps {
  period: 'day' | 'week' | 'month';
}

const TaskSummary: React.FC<TaskSummaryProps> = ({ period }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TaskStats | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await tasksApi.getStats({ period });
        setStats(data);
      } catch (error) {
        console.error('Error fetching task stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [period]);
  
  if (loading) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (!stats) {
    return <div>No data available</div>;
  }

  const data = [
    { name: 'To Do', value: stats.pending, color: '#3498db' },
    { name: 'In Progress', value: stats.in_progress, color: '#f1c40f' },
    { name: 'Done', value: stats.completed, color: '#2ecc71' }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TaskSummary;
