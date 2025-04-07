
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Filter, Calendar, PieChart, BarChart3, LineChart, Clock } from 'lucide-react';
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

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('This Month');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem>Export as Excel</DropdownMenuItem>
              <DropdownMenuItem>Print Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs defaultValue="time-tracking" className="w-full">
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
        </Tabs>
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

      <Tabs defaultValue="time-tracking">
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
              <p>Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
