
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from '@/services/invoice-api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface InvoiceSummaryProps {
  invoices: Invoice[];
  loading?: boolean;
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ invoices, loading = false }) => {
  const stats = useMemo(() => {
    const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    
    const byStatus = invoices.reduce((acc: Record<string, number>, invoice) => {
      if (!acc[invoice.status]) acc[invoice.status] = 0;
      acc[invoice.status] += 1;
      return acc;
    }, {});
    
    const byStatusAmount = invoices.reduce((acc: Record<string, number>, invoice) => {
      if (!acc[invoice.status]) acc[invoice.status] = 0;
      acc[invoice.status] += invoice.amount;
      return acc;
    }, {});
    
    return {
      totalInvoices: invoices.length,
      totalAmount,
      byStatus,
      byStatusAmount,
      paid: byStatusAmount.paid || 0,
      unpaid: byStatusAmount.unpaid || 0,
      overdue: byStatusAmount.overdue || 0,
      draft: byStatusAmount.draft || 0,
      cancelled: byStatusAmount.cancelled || 0,
    };
  }, [invoices]);

  const statusColors = {
    paid: '#10b981',
    unpaid: '#f59e0b',
    overdue: '#ef4444',
    draft: '#6366f1',
    cancelled: '#6b7280'
  };
  
  const chartData = useMemo(() => {
    return Object.entries(stats.byStatus).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: statusColors[status as keyof typeof statusColors]
    }));
  }, [stats.byStatus]);

  const amountData = useMemo(() => {
    return Object.entries(stats.byStatusAmount).map(([status, amount]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: amount,
      color: statusColors[status as keyof typeof statusColors]
    }));
  }, [stats.byStatusAmount]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[150px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[150px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full rounded-md" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Summary</CardTitle>
          <CardDescription>Overview of all invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Invoices</p>
              <p className="text-2xl font-bold">{stats.totalInvoices}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Amount</p>
              <p className="text-2xl font-bold">{stats.totalAmount.toLocaleString()} DZD</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Paid</p>
              <p className="text-xl font-bold text-green-600">{stats.paid.toLocaleString()} DZD</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Unpaid</p>
              <p className="text-xl font-bold text-amber-500">{stats.unpaid.toLocaleString()} DZD</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Overdue</p>
              <p className="text-xl font-bold text-red-500">{stats.overdue.toLocaleString()} DZD</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Draft</p>
              <p className="text-xl font-bold text-indigo-500">{stats.draft.toLocaleString()} DZD</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Status</CardTitle>
          <CardDescription>Distribution by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceSummary;
