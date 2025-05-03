
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Calendar, BarChart3, Loader2 } from 'lucide-react';
import { teamApi } from '@/services/team-api';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/services/api';

interface TeamTimeReportProps {
  dateRange: string;
}

interface TimeEntry {
  user: string;
  userId: string;
  totalHours: number;
  billableHours: number;
  projects: { name: string; hours: number }[];
  tasks: { name: string; hours: number }[];
  averageHoursPerDay: number;
  mostActiveDay: string;
  mostActiveProject: string;
}

const TeamTimeReport: React.FC<TeamTimeReportProps> = ({ dateRange }) => {
  const [viewType, setViewType] = useState<'all' | 'byUser' | 'byProject'>('all');
  const [timeData, setTimeData] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTimeData = async () => {
      try {
        setLoading(true);
        
        // Convert date range to API filter format
        let period = 'current-month';
        switch (dateRange) {
          case 'This Week':
            period = 'current-week';
            break;
          case 'This Month':
            period = 'current-month';
            break;
          case 'Last 3 Months':
            period = 'last-quarter';
            break;
          case 'This Year':
            period = 'current-year';
            break;
          default:
            period = 'current-month';
        }
        
        // Fetch team performance data which includes time tracking
        const { data: performanceData } = await teamApi.getPerformance(period);
        
        // Transform performance data to time entries format
        // We need to fetch additional data for hourly rates
        const { data: teamMembers } = await teamApi.getMembers();
        
        const timeEntries: TimeEntry[] = performanceData.map(member => {
          // Find member details to get the hourly rate
          const memberDetails = teamMembers.find(m => m.id === member.member_id) || { hourly_rate: 0 };
          
          return {
            user: member.member_name,
            userId: member.member_id,
            totalHours: member.total_hours || 0,
            billableHours: memberDetails.hourly_rate ? (member.calculated_salary / memberDetails.hourly_rate) : 0,
            projects: [], // This would come from another API endpoint
            tasks: [], // This would come from another API endpoint
            averageHoursPerDay: (member.total_hours || 0) / 20, // assuming ~20 working days per month
            mostActiveDay: 'Monday', // This would come from another API endpoint
            mostActiveProject: 'Main Project', // This would come from another API endpoint
          };
        });
        
        setTimeData(timeEntries);
      } catch (error) {
        handleError(error);
        toast({
          title: "Error loading time report",
          description: "Failed to load time report data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTimeData();
  }, [dateRange, toast]);

  const totalTeamHours = timeData.reduce((sum, entry) => sum + entry.totalHours, 0);
  const totalBillableHours = timeData.reduce((sum, entry) => sum + entry.billableHours, 0);
  const billablePercentage = totalTeamHours > 0 ? (totalBillableHours / totalTeamHours) * 100 : 0;

  // Prepare chart data for team members
  const userChartData = timeData.map(entry => ({
    name: entry.user.split(' ')[0], // First name only for cleaner chart
    totalHours: entry.totalHours,
    billableHours: entry.billableHours
  }));

  // Get all unique projects from time entries
  const allProjects = new Set<string>();
  timeData.forEach(entry => {
    entry.projects.forEach(project => {
      allProjects.add(project.name);
    });
  });

  // Prepare project chart data
  const projectChartData: { name: string; hours: number }[] = [];
  allProjects.forEach(projectName => {
    let totalHours = 0;
    timeData.forEach(entry => {
      const project = entry.projects.find(p => p.name === projectName);
      if (project) {
        totalHours += project.hours;
      }
    });
    projectChartData.push({ name: projectName, hours: totalHours });
  });
  
  // Sort project chart data by hours (descending)
  projectChartData.sort((a, b) => b.hours - a.hours);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-16">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p>Loading time tracking data...</p>
      </div>
    );
  }

  if (timeData.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No time tracking data available for the selected period.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">{totalTeamHours.toFixed(1)}</div>
            <div className="flex items-center mt-2">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Total Hours</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">{totalBillableHours.toFixed(1)}</div>
            <div className="flex items-center mt-2">
              <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Billable Hours</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">{billablePercentage.toFixed(0)}%</div>
            <div className="w-full mt-2">
              <Progress value={billablePercentage} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground mt-3">Billable Percentage</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Time Tracking Details</h3>
        <Select value={viewType} onValueChange={(value: any) => setViewType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="View options" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time Entries</SelectItem>
            <SelectItem value="byUser">By User</SelectItem>
            <SelectItem value="byProject">By Project</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {viewType === 'all' && (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Member</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Billable Hours</TableHead>
                <TableHead>Billable %</TableHead>
                <TableHead>Avg. Hours/Day</TableHead>
                <TableHead>Most Active Project</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeData.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="" alt={entry.user} />
                        <AvatarFallback>{entry.user.split(' ').map(name => name[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span>{entry.user}</span>
                    </div>
                  </TableCell>
                  <TableCell>{entry.totalHours.toFixed(1)}h</TableCell>
                  <TableCell>{entry.billableHours.toFixed(1)}h</TableCell>
                  <TableCell>
                    {entry.totalHours > 0 
                      ? ((entry.billableHours / entry.totalHours) * 100).toFixed(0) 
                      : 0}%
                  </TableCell>
                  <TableCell>{entry.averageHoursPerDay.toFixed(1)}h</TableCell>
                  <TableCell>{entry.mostActiveProject}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {(viewType === 'byUser' || viewType === 'all') && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Hours by Team Member</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={userChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} hours`, '']} />
                  <Legend />
                  <Bar dataKey="totalHours" name="Total Hours" fill="#8884d8" />
                  <Bar dataKey="billableHours" name="Billable Hours" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {(viewType === 'byProject' || viewType === 'all') && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Hours by Project</CardTitle>
          </CardHeader>
          <CardContent>
            {projectChartData.length > 0 ? (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={projectChartData.slice(0, 5)} // Show top 5 projects by hours
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} hours`, '']} />
                    <Legend />
                    <Bar dataKey="hours" name="Total Hours" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No project data available for the selected period.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamTimeReport;
