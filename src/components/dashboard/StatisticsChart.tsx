
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { projectsApi } from '@/services/projects-api';
import { invoicesApi } from '@/services/invoices-api'; 
import { expensesApi } from '@/services/expenses-api';
import { useToast } from '@/hooks/use-toast';

export type MetricType = 'revenue' | 'expenses' | 'invoices' | 'projects';

interface StatisticsChartProps {
  type: MetricType;
  period: 'day' | 'week' | 'month' | 'year';
}

interface ChartData {
  name: string;
  value: number;
  previousValue?: number;
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({ type, period }) => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [previousValue, setPreviousValue] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let fetchedData: ChartData[] = [];
        let currentTotal = 0;
        let previousTotal = 0;
        
        const currentDate = new Date();
        let startDate: Date;
        let periodLabel: string;
        
        // Set date ranges based on period
        switch (period) {
          case 'day':
            startDate = new Date(currentDate);
            startDate.setHours(0, 0, 0, 0);
            periodLabel = 'Today';
            break;
          case 'week':
            startDate = new Date(currentDate);
            startDate.setDate(currentDate.getDate() - 7);
            periodLabel = 'This Week';
            break;
          case 'month':
            startDate = new Date(currentDate);
            startDate.setMonth(currentDate.getMonth() - 1);
            periodLabel = 'This Month';
            break;
          case 'year':
            startDate = new Date(currentDate);
            startDate.setFullYear(currentDate.getFullYear() - 1);
            periodLabel = 'This Year';
            break;
        }
        
        // Fetch data based on type
        switch (type) {
          case 'revenue':
            const invoiceData = await invoicesApi.getAll({
              filters: {
                from_date: startDate.toISOString(),
                to_date: currentDate.toISOString(),
                status: 'paid'
              }
            });
            
            currentTotal = invoiceData.data.reduce((sum, invoice) => sum + invoice.amount, 0);
            
            // Group by date (simplified for this example)
            const revenueByDate = invoiceData.data.reduce((acc: Record<string, number>, invoice) => {
              const date = new Date(invoice.issued_date || invoice.created_at).toLocaleDateString();
              acc[date] = (acc[date] || 0) + invoice.amount;
              return acc;
            }, {});
            
            fetchedData = Object.keys(revenueByDate).map(date => ({
              name: date,
              value: revenueByDate[date]
            }));
            
            // Get previous period data for comparison
            const previousStartDate = new Date(startDate);
            previousStartDate.setDate(previousStartDate.getDate() - 7); // For week comparison
            
            const previousInvoiceData = await invoicesApi.getAll({
              filters: {
                from_date: previousStartDate.toISOString(),
                to_date: startDate.toISOString(),
                status: 'paid'
              }
            });
            
            previousTotal = previousInvoiceData.data.reduce((sum, invoice) => sum + invoice.amount, 0);
            break;
            
          case 'expenses':
            const expenseData = await expensesApi.getAll({
              filters: {
                date_from: startDate.toISOString(),
                date_to: currentDate.toISOString()
              }
            });
            
            currentTotal = expenseData.data.reduce((sum, expense) => sum + expense.amount, 0);
            
            // Group by category
            const expensesByCategory = expenseData.data.reduce((acc: Record<string, number>, expense) => {
              acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
              return acc;
            }, {});
            
            fetchedData = Object.keys(expensesByCategory).map(category => ({
              name: category,
              value: expensesByCategory[category]
            }));
            
            // Get previous period data for comparison
            const previousExpenseStartDate = new Date(startDate);
            previousExpenseStartDate.setDate(previousExpenseStartDate.getDate() - 7); // For week comparison
            
            const previousExpenseData = await expensesApi.getAll({
              filters: {
                date_from: previousExpenseStartDate.toISOString(),
                date_to: startDate.toISOString()
              }
            });
            
            previousTotal = previousExpenseData.data.reduce((sum, expense) => sum + expense.amount, 0);
            break;
            
          case 'invoices':
            const allInvoiceData = await invoicesApi.getAll({
              filters: {
                from_date: startDate.toISOString(),
                to_date: currentDate.toISOString(),
                status: 'unpaid'
              }
            });
            
            currentTotal = allInvoiceData.data.length;
            
            // Group by status
            const invoicesByStatus = allInvoiceData.data.reduce((acc: Record<string, number>, invoice) => {
              acc[invoice.status] = (acc[invoice.status] || 0) + 1;
              return acc;
            }, {});
            
            fetchedData = Object.keys(invoicesByStatus).map(status => ({
              name: status,
              value: invoicesByStatus[status]
            }));
            
            // Get previous period data for comparison
            const previousInvoiceStartDate = new Date(startDate);
            previousInvoiceStartDate.setDate(previousInvoiceStartDate.getDate() - 7); // For week comparison
            
            const previousAllInvoiceData = await invoicesApi.getAll({
              filters: {
                from_date: previousInvoiceStartDate.toISOString(),
                to_date: startDate.toISOString()
              }
            });
            
            previousTotal = previousAllInvoiceData.data.filter(invoice => invoice.status === 'unpaid').length;
            break;
            
          case 'projects':
            const projectData = await projectsApi.getAll({
              filters: {
                status: 'active'
              }
            });
            
            currentTotal = projectData.data.filter(project => project.status === 'active').length;
            
            // Group by progress
            const projectsByProgress = projectData.data
              .filter(project => project.status === 'active')
              .reduce((acc: Record<string, number>, project) => {
                const progressBucket = Math.floor((project.progress || 0) / 20) * 20; // Group by 20% increments
                const bucketName = `${progressBucket}-${progressBucket + 19}%`;
                acc[bucketName] = (acc[bucketName] || 0) + 1;
                return acc;
              }, {});
            
            fetchedData = Object.keys(projectsByProgress).map(bucket => ({
              name: bucket,
              value: projectsByProgress[bucket]
            }));
            
            // For previous comparison, we'll use a simple approach
            // In a real application, you might want to compare to projects from a previous time period
            const previousProjectData = await projectsApi.getAll();
            previousTotal = previousProjectData.data.filter(project => 
              project.status === 'active' && 
              new Date(project.created_at) < startDate
            ).length;
            break;
        }
        
        // Sort data by date or name if applicable
        fetchedData.sort((a, b) => {
          if (Date.parse(a.name) && Date.parse(b.name)) {
            return Date.parse(a.name) - Date.parse(b.name);
          }
          return a.name.localeCompare(b.name);
        });
        
        // Calculate percentage change
        const change = previousTotal === 0 
          ? 100 // If previous was 0, we have a 100% increase
          : ((currentTotal - previousTotal) / previousTotal) * 100;
        
        setData(fetchedData);
        setCurrentValue(currentTotal);
        setPreviousValue(previousTotal);
        setPercentageChange(change);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching ${type} data:`, err);
        setError(`Failed to load ${type} data.`);
        setLoading(false);
        toast({
          title: 'Error',
          description: `Failed to load ${type} data. Please try again later.`,
          variant: 'destructive'
        });
      }
    };

    fetchData();
  }, [type, period, toast]);

  // Format the title based on the type
  const getTitle = () => {
    switch (type) {
      case 'revenue': return 'Total Revenue';
      case 'expenses': return 'Total Expenses';
      case 'invoices': return 'Pending Invoices';
      case 'projects': return 'Active Projects';
      default: return 'Statistics';
    }
  };

  // Format the value based on type
  const formatValue = (value: number) => {
    switch (type) {
      case 'revenue':
      case 'expenses':
        return `${value.toLocaleString()} DZD`;
      case 'invoices':
      case 'projects':
        return value.toString();
      default:
        return value.toString();
    }
  };

  // Get chart color based on type and trend
  const getChartColor = () => {
    switch (type) {
      case 'revenue': return percentageChange >= 0 ? '#10b981' : '#ef4444';
      case 'expenses': return percentageChange <= 0 ? '#10b981' : '#ef4444';
      case 'invoices': return '#f59e0b';
      case 'projects': return '#6366f1';
      default: return '#6366f1';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-[150px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[80px] w-full mb-2" />
          <Skeleton className="h-6 w-[120px]" />
          <Skeleton className="h-4 w-[180px] mt-2" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">{formatValue(currentValue)}</div>
        <div className="flex items-center text-xs text-muted-foreground mb-4">
          {percentageChange > 0 ? (
            <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
          ) : percentageChange < 0 ? (
            <ArrowDown className="h-4 w-4 mr-1 text-red-500" />
          ) : null}
          <span className={percentageChange > 0 ? 'text-green-500' : percentageChange < 0 ? 'text-red-500' : ''}>
            {percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(1)}%
          </span>
          <span className="ml-1">from last period</span>
        </div>
        
        <div className="h-[80px]">
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              {type === 'revenue' || type === 'expenses' ? (
                <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`color-${type}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getChartColor()} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={getChartColor()} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={getChartColor()} 
                    fillOpacity={1}
                    fill={`url(#color-${type})`}
                    isAnimationActive={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </AreaChart>
              ) : (
                <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Bar 
                    dataKey="value" 
                    fill={getChartColor()} 
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsChart;
