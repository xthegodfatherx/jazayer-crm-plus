
import React from 'react';
import { Invoice } from '@/types/invoice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  Pie, 
  PieChart, 
  Cell, 
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip
} from 'recharts';
import { cn } from '@/lib/utils';

interface InvoiceSummaryProps {
  invoices: Invoice[];
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ invoices }) => {
  // Calculate summary data
  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidAmount = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.total, 0);
  const overdueAmount = invoices
    .filter(invoice => invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.total, 0);
  const pendingAmount = invoices
    .filter(invoice => invoice.status === 'sent')
    .reduce((sum, invoice) => sum + invoice.total, 0);
  
  // Count invoices by status
  const statusCounts = {
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    cancelled: invoices.filter(i => i.status === 'cancelled').length,
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', { 
      style: 'currency', 
      currency: 'DZD',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // Pie chart data
  const statusData = [
    { name: 'Paid', value: paidAmount, color: '#22c55e' },
    { name: 'Pending', value: pendingAmount, color: '#3b82f6' },
    { name: 'Overdue', value: overdueAmount, color: '#ef4444' },
    { name: 'Draft', value: invoices
      .filter(invoice => invoice.status === 'draft')
      .reduce((sum, invoice) => sum + invoice.total, 0), 
      color: '#94a3b8' 
    },
  ].filter(item => item.value > 0);

  // Get trend indicators
  const getPaidTrend = () => {
    // This would normally be calculated based on historical data
    const trend = 12.5; // Percentage increase from previous period
    return (
      <div className={cn(
        "flex items-center text-xs",
        trend >= 0 ? "text-green-600" : "text-red-600"
      )}>
        {trend >= 0 ? (
          <ArrowUpRight className="h-3 w-3 mr-1" />
        ) : (
          <ArrowDownRight className="h-3 w-3 mr-1" />
        )}
        <span>{Math.abs(trend)}% from last month</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Invoice Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Outstanding</div>
              <div className="text-2xl font-bold">{formatCurrency(totalAmount - paidAmount)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Paid</div>
              <div className="text-2xl font-bold">{formatCurrency(paidAmount)}</div>
              {getPaidTrend()}
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center p-2 rounded-md bg-blue-50">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <div className="text-sm font-medium">Pending</div>
                <div className="text-lg font-bold">{formatCurrency(pendingAmount)}</div>
              </div>
            </div>
            <div className="flex items-center p-2 rounded-md bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <div className="text-sm font-medium">Overdue</div>
                <div className="text-lg font-bold">{formatCurrency(overdueAmount)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Invoice Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <RechartsTooltip 
                  formatter={(value: number) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Invoice Counts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center p-3 rounded-md bg-green-50">
              <CheckCircle className="h-5 w-5 text-green-600 mb-1" />
              <div className="text-xs text-muted-foreground">Paid</div>
              <div className="text-xl font-bold">{statusCounts.paid}</div>
            </div>
            <div className="flex flex-col items-center p-3 rounded-md bg-blue-50">
              <Clock className="h-5 w-5 text-blue-600 mb-1" />
              <div className="text-xs text-muted-foreground">Sent</div>
              <div className="text-xl font-bold">{statusCounts.sent}</div>
            </div>
            <div className="flex flex-col items-center p-3 rounded-md bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600 mb-1" />
              <div className="text-xs text-muted-foreground">Overdue</div>
              <div className="text-xl font-bold">{statusCounts.overdue}</div>
            </div>
            <div className="flex flex-col items-center p-3 rounded-md bg-gray-50">
              <FileText className="h-5 w-5 text-gray-600 mb-1" />
              <div className="text-xs text-muted-foreground">Draft</div>
              <div className="text-xl font-bold">{statusCounts.draft}</div>
            </div>
            <div className="flex flex-col items-center p-3 rounded-md bg-indigo-50">
              <DollarSign className="h-5 w-5 text-indigo-600 mb-1" />
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="text-xl font-bold">{invoices.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceSummary;
