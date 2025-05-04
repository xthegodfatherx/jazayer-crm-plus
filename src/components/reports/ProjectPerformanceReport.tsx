
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { projectsApi, ProjectPerformanceData, ProjectStatusDistribution, ProjectTimeData, ProjectProgressData, ProjectProgressOverTime } from '@/services/projects-api';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface ProjectPerformanceReportProps {
  dateRange: string;
}

const ProjectPerformanceReport: React.FC<ProjectPerformanceReportProps> = ({ dateRange }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [performanceData, setPerformanceData] = useState<ProjectPerformanceData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPerformanceData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await projectsApi.getPerformanceData(dateRange);
        setPerformanceData(data);
      } catch (error) {
        console.error('Error fetching project performance data:', error);
        setError('Failed to load project performance data. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load project performance data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [dateRange, toast]);

  // Transform project status data for chart
  const getProjectStatusChartData = (statusDistribution?: ProjectStatusDistribution) => {
    if (!statusDistribution) return [];
    
    return [
      { name: 'Active', value: statusDistribution.active },
      { name: 'Completed', value: statusDistribution.completed },
      { name: 'On Hold', value: statusDistribution.on_hold },
      { name: 'Pending', value: statusDistribution.pending },
    ];
  };

  const getStatusBadge = (progress: number) => {
    if (progress === 100) return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>;
    if (progress >= 60) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">On Track</Badge>;
    if (progress >= 25) return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">In Progress</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Just Started</Badge>;
  };

  // Render loading skeletons
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton for summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skeleton for charts */}
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}

        {/* Skeleton for table */}
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-6 w-36 mb-4" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate budget usage percentage
  const budgetUsagePercentage = performanceData 
    ? (performanceData.total_budget_used / performanceData.total_budget) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">
              {performanceData ? (
                performanceData.project_status.active + 
                performanceData.project_status.completed + 
                performanceData.project_status.on_hold + 
                performanceData.project_status.pending
              ) : 0}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Total Projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">
              {performanceData ? performanceData.total_budget.toLocaleString('fr-DZ') : 0} DZD
            </div>
            <p className="text-sm text-muted-foreground mt-2">Total Budget</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">
              {performanceData ? performanceData.total_budget_used.toLocaleString('fr-DZ') : 0} DZD
            </div>
            <p className="text-sm text-muted-foreground mt-2">Budget Used</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">{budgetUsagePercentage.toFixed(0)}%</div>
            <div className="w-full mt-2">
              <Progress value={budgetUsagePercentage} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">Budget Utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart for project status distribution */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Project Status Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getProjectStatusChartData(performanceData?.project_status)}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} projects`, '']} />
                <Bar dataKey="value" fill="#8884d8" name="Projects" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Chart for project progress over time */}
      {performanceData?.project_progress_over_time && performanceData.project_progress_over_time.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Project Progress Over Time</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData.project_progress_over_time}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'Progress %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                  <Legend />
                  {/* Dynamically generate lines for each project */}
                  {Object.keys(performanceData.project_progress_over_time[0])
                    .filter(key => key !== 'month')
                    .map((projectId, index) => {
                      const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#ff8042'];
                      return (
                        <Line 
                          key={projectId}
                          type="monotone" 
                          dataKey={projectId} 
                          stroke={colors[index % colors.length]} 
                          name={projectId} 
                        />
                      );
                    })
                  }
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project details table */}
      {performanceData?.project_progress && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Project Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Project</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Progress</th>
                    <th className="text-left py-3 px-4">Estimated Hours</th>
                    <th className="text-left py-3 px-4">Actual Hours</th>
                    <th className="text-left py-3 px-4">Budget</th>
                    <th className="text-left py-3 px-4">Budget Used</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.project_progress.map((project, index) => {
                    const timeData = performanceData.project_time.find(
                      (item) => item.project_id === project.project_id
                    );
                    
                    return (
                      <tr key={project.project_id} className="border-b">
                        <td className="py-3 px-4 font-medium">{project.project_name}</td>
                        <td className="py-3 px-4">{getStatusBadge(project.progress)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Progress value={project.progress} className="h-2 w-24" />
                            <span>{project.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{timeData?.estimated_hours || 0}h</td>
                        <td className="py-3 px-4">{timeData?.actual_hours || 0}h</td>
                        <td className="py-3 px-4">{project.budget.toLocaleString('fr-DZ')} DZD</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Progress value={(project.budget_used / project.budget) * 100} className="h-2 w-24" />
                            <span>{project.budget_used.toLocaleString('fr-DZ')} DZD</span>
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
      )}
    </div>
  );
};

export default ProjectPerformanceReport;
