
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Filter, Calendar, PieChart, BarChart3, LineChart, Clock, Loader2 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TeamTimeReport from '@/components/reports/TeamTimeReport';
import TaskCompletionReport from '@/components/reports/TaskCompletionReport';
import ProjectPerformanceReport from '@/components/reports/ProjectPerformanceReport';
import TeamPerformance from '@/components/team/TeamPerformance';
import { reportsApi } from '@/services/reports-api';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/services/api';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('This Month');
  const [activeTab, setActiveTab] = useState('time-tracking');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);
        // This would typically load any initial report metadata or configuration
        // from the API, but for now we're just setting loading state
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      } catch (error) {
        handleError(error);
        toast({
          title: "Error loading reports",
          description: "Failed to load report data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, [toast]);

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      setLoading(true);
      toast({
        title: "Preparing export",
        description: `Your ${format.toUpperCase()} report is being generated.`,
      });
      
      // Generate the report first
      const reportData = { 
        type: activeTab, 
        params: { 
          date_range: dateRange,
          format
        } 
      };
      const { data: report } = await reportsApi.generate(reportData);
      
      // Then export it
      const blob = await reportsApi.export(report.id, format);
      
      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${activeTab}-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: "Export complete",
        description: `Your ${format.toUpperCase()} report has been downloaded.`,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={loading}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('pdf')}>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>Export as Excel</DropdownMenuItem>
              <DropdownMenuItem>Print Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full border-b mb-6">
              <TabsTrigger value="time-tracking" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Time Tracking
              </TabsTrigger>
              <TabsTrigger value="task-completion" className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Task Completion
              </TabsTrigger>
              <TabsTrigger value="project-performance" className="flex items-center">
                <PieChart className="h-4 w-4 mr-2" />
                Project Performance
              </TabsTrigger>
              <TabsTrigger value="team-analysis" className="flex items-center">
                <LineChart className="h-4 w-4 mr-2" />
                Team Analysis
              </TabsTrigger>
            </TabsList>

            {loading ? (
              <div className="flex justify-center items-center p-16">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                <p>Loading report data...</p>
              </div>
            ) : (
              <>
                <TabsContent value="time-tracking">
                  <Card>
                    <CardHeader>
                      <CardTitle>Time Tracking Report</CardTitle>
                      <CardDescription>
                        Analyze how team members are spending their time across projects and tasks
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TeamTimeReport dateRange={dateRange} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="task-completion">
                  <Card>
                    <CardHeader>
                      <CardTitle>Task Completion Report</CardTitle>
                      <CardDescription>
                        Analyze task completion rates, quality ratings, and performance metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TaskCompletionReport dateRange={dateRange} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="project-performance">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Performance Report</CardTitle>
                      <CardDescription>
                        Track progress, budget utilization, and time management for projects
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProjectPerformanceReport dateRange={dateRange} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="team-analysis">
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Analysis Report</CardTitle>
                      <CardDescription>
                        Comprehensive performance analysis of the team and individual members
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TeamPerformance />
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                {dateRange}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Date Range</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDateRange('This Week')}>
                This Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange('This Month')}>
                This Month
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange('Last 3 Months')}>
                Last 3 Months
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange('This Year')}>
                This Year
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange('Custom Range')}>
                Custom Range
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
