
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Badge } from '@/components/ui/badge';

interface ProjectPerformanceReportProps {
  dateRange: string;
}

const ProjectPerformanceReport: React.FC<ProjectPerformanceReportProps> = ({ dateRange }) => {
  // Mock data
  const projectStatusData = [
    { name: 'Active', value: 4 },
    { name: 'Completed', value: 1 },
    { name: 'On Hold', value: 1 },
    { name: 'Pending', value: 1 },
  ];

  const projectTimeData = [
    { project: 'Sonatrach Web App', estimated: 220, actual: 187, remainingEstimate: 33 },
    { project: 'Djezzy Mobile App', estimated: 280, actual: 145, remainingEstimate: 135 },
    { project: 'Air Algérie Booking', estimated: 180, actual: 210, remainingEstimate: 0 },
    { project: 'Ooredoo Dashboard', estimated: 120, actual: 68, remainingEstimate: 52 },
    { project: 'Cevital E-commerce', estimated: 320, actual: 24, remainingEstimate: 296 },
    { project: 'Mobilis CRM', estimated: 150, actual: 112, remainingEstimate: 38 },
  ];

  const projectProgressData = [
    { project: 'Sonatrach Web App', progress: 65, budget: 120000, budgetUsed: 78000 },
    { project: 'Djezzy Mobile App', progress: 40, budget: 180000, budgetUsed: 72000 },
    { project: 'Air Algérie Booking', progress: 100, budget: 90000, budgetUsed: 90000 },
    { project: 'Ooredoo Dashboard', progress: 25, budget: 75000, budgetUsed: 18750 },
    { project: 'Cevital E-commerce', progress: 5, budget: 150000, budgetUsed: 7500 },
    { project: 'Mobilis CRM', progress: 60, budget: 65000, budgetUsed: 39000 },
  ];

  const projectProgressOverTime = [
    { month: 'Jan', Sonatrach: 10, Djezzy: 5, AirAlgerie: 15, Ooredoo: 0, Cevital: 0, Mobilis: 20 },
    { month: 'Feb', Sonatrach: 25, Djezzy: 15, AirAlgerie: 40, Ooredoo: 0, Cevital: 0, Mobilis: 45 },
    { month: 'Mar', Sonatrach: 45, Djezzy: 30, AirAlgerie: 80, Ooredoo: 10, Cevital: 0, Mobilis: 60 },
    { month: 'Apr', Sonatrach: 65, Djezzy: 40, AirAlgerie: 100, Ooredoo: 25, Cevital: 5, Mobilis: 60 }
  ];

  // Calculate total values
  const totalBudget = projectProgressData.reduce((sum, project) => sum + project.budget, 0);
  const totalBudgetUsed = projectProgressData.reduce((sum, project) => sum + project.budgetUsed, 0);
  const budgetUsagePercentage = (totalBudgetUsed / totalBudget) * 100;

  const getStatusBadge = (progress: number) => {
    if (progress === 100) return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>;
    if (progress >= 60) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">On Track</Badge>;
    if (progress >= 25) return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">In Progress</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Just Started</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">{projectStatusData.reduce((sum, item) => sum + item.value, 0)}</div>
            <p className="text-sm text-muted-foreground mt-2">Total Projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">{totalBudget.toLocaleString('fr-DZ')} DZD</div>
            <p className="text-sm text-muted-foreground mt-2">Total Budget</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="text-3xl font-bold">{totalBudgetUsed.toLocaleString('fr-DZ')} DZD</div>
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
                data={projectStatusData}
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
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Project Progress Over Time</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={projectProgressOverTime}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" />
                <YAxis label={{ value: 'Progress %', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Legend />
                <Line type="monotone" dataKey="Sonatrach" stroke="#8884d8" name="Sonatrach Web App" />
                <Line type="monotone" dataKey="Djezzy" stroke="#82ca9d" name="Djezzy Mobile App" />
                <Line type="monotone" dataKey="AirAlgerie" stroke="#ffc658" name="Air Algérie Booking" />
                <Line type="monotone" dataKey="Ooredoo" stroke="#ff7300" name="Ooredoo Dashboard" />
                <Line type="monotone" dataKey="Cevital" stroke="#0088fe" name="Cevital E-commerce" />
                <Line type="monotone" dataKey="Mobilis" stroke="#ff8042" name="Mobilis CRM" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Project details table */}
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
                {projectProgressData.map((project, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{project.project}</td>
                    <td className="py-3 px-4">{getStatusBadge(project.progress)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Progress value={project.progress} className="h-2 w-24" />
                        <span>{project.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{projectTimeData[index].estimated}h</td>
                    <td className="py-3 px-4">{projectTimeData[index].actual}h</td>
                    <td className="py-3 px-4">{project.budget.toLocaleString('fr-DZ')} DZD</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Progress value={(project.budgetUsed / project.budget) * 100} className="h-2 w-24" />
                        <span>{project.budgetUsed.toLocaleString('fr-DZ')} DZD</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectPerformanceReport;
