
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Download, Calendar, ChartBar } from 'lucide-react';
import TeamMembers from '@/components/team/TeamMembers';
import TeamPerformance from '@/components/team/TeamPerformance';
import ActivityLog from '@/components/team/ActivityLog';
import SalaryCalculator from '@/components/team/SalaryCalculator';

const Team = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="salary">Salary</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <TeamMembers />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Task completion rate and quality ratings</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  This Month
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TeamPerformance />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Salary Management</CardTitle>
              <CardDescription>Calculate and view team member salaries</CardDescription>
            </CardHeader>
            <CardContent>
              <SalaryCalculator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Track team activities across the system</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityLog />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Team;
