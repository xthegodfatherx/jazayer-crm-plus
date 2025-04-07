import React, { useState } from 'react';
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
import { Clock, Calendar, BarChart3 } from 'lucide-react';

interface TeamTimeReportProps {
  dateRange: string;
}

interface TimeEntry {
  user: string;
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
  
  const timeData: TimeEntry[] = [
    {
      user: 'Ahmed Khalifi',
      totalHours: 156,
      billableHours: 142,
      projects: [
        { name: 'Sonatrach Web Application', hours: 68 },
        { name: 'Djezzy Mobile App', hours: 45 },
        { name: 'Cevital E-commerce Platform', hours: 43 },
      ],
      tasks: [
        { name: 'UI Design', hours: 72 },
        { name: 'Prototyping', hours: 48 },
        { name: 'User Testing', hours: 36 },
      ],
      averageHoursPerDay: 7.8,
      mostActiveDay: 'Wednesday',
      mostActiveProject: 'Sonatrach Web Application',
    },
    {
      user: 'Selma Bouaziz',
      totalHours: 165,
      billableHours: 158,
      projects: [
        { name: 'Sonatrach Web Application', hours: 72 },
        { name: 'Air Algérie Booking System', hours: 65 },
        { name: 'Cevital E-commerce Platform', hours: 28 },
      ],
      tasks: [
        { name: 'Frontend Development', hours: 95 },
        { name: 'Bug Fixes', hours: 40 },
        { name: 'Code Reviews', hours: 30 },
      ],
      averageHoursPerDay: 8.3,
      mostActiveDay: 'Tuesday',
      mostActiveProject: 'Sonatrach Web Application',
    },
    {
      user: 'Karim Mansouri',
      totalHours: 148,
      billableHours: 130,
      projects: [
        { name: 'Air Algérie Booking System', hours: 82 },
        { name: 'Sonatrach Web Application', hours: 42 },
        { name: 'Cevital E-commerce Platform', hours: 24 },
      ],
      tasks: [
        { name: 'Project Management', hours: 68 },
        { name: 'Client Meetings', hours: 45 },
        { name: 'Documentation', hours: 35 },
      ],
      averageHoursPerDay: 7.4,
      mostActiveDay: 'Monday',
      mostActiveProject: 'Air Algérie Booking System',
    },
    {
      user: 'Leila Benzema',
      totalHours: 172,
      billableHours: 163,
      projects: [
        { name: 'Djezzy Mobile App', hours: 85 },
        { name: 'Ooredoo Data Analytics Dashboard', hours: 68 },
        { name: 'Mobilis Internal CRM', hours: 19 },
      ],
      tasks: [
        { name: 'Backend Development', hours: 98 },
        { name: 'Database Design', hours: 42 },
        { name: 'API Development', hours: 32 },
      ],
      averageHoursPerDay: 8.6,
      mostActiveDay: 'Thursday',
      mostActiveProject: 'Djezzy Mobile App',
    },
    {
      user: 'Mohammed Ali',
      totalHours: 132,
      billableHours: 120,
      projects: [
        { name: 'Ooredoo Data Analytics Dashboard', hours: 55 },
        { name: 'Djezzy Mobile App', hours: 42 },
        { name: 'Mobilis Internal CRM', hours: 35 },
      ],
      tasks: [
        { name: 'Sales Management', hours: 58 },
        { name: 'Market Research', hours: 45 },
        { name: 'Client Support', hours: 29 },
      ],
      averageHoursPerDay: 6.6,
      mostActiveDay: 'Monday',
      mostActiveProject: 'Ooredoo Data Analytics Dashboard',
    },
  ];

  const totalTeamHours = timeData.reduce((sum, entry) => sum + entry.totalHours, 0);
  const totalBillableHours = timeData.reduce((sum, entry) => sum + entry.billableHours, 0);
  const billablePercentage = (totalBillableHours / totalTeamHours) * 100;

  // Prepare chart data for team members
  const userChartData = timeData.map(entry => ({
    name: entry.user.split(' ')[0], // First name only for cleaner chart
    totalHours: entry.totalHours,
    billableHours: entry.billableHours
  }));

  // Get all unique projects
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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">{totalTeamHours}</div>
            <div className="flex items-center mt-2">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Total Hours</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">{totalBillableHours}</div>
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
                  <TableCell>{entry.totalHours}h</TableCell>
                  <TableCell>{entry.billableHours}h</TableCell>
                  <TableCell>{((entry.billableHours / entry.totalHours) * 100).toFixed(0)}%</TableCell>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamTimeReport;
