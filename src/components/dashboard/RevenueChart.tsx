
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import apiClient from '@/services/api-client';
import { useToast } from '@/hooks/use-toast';

interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

const RevenueChart: React.FC = () => {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`${API_URL}/reports/revenue`);
        setData(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch revenue data', err);
        setError('Failed to load revenue data');
        setLoading(false);
        toast({
          title: 'Error',
          description: 'Failed to load revenue data. Please try again later.',
          variant: 'destructive'
        });
      }
    };

    fetchRevenueData();
  }, [toast]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-[20px] w-[150px]" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Failed to load revenue data</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="expenses" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
        <Area type="monotone" dataKey="profit" stackId="3" stroke="#ffc658" fill="#ffc658" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
