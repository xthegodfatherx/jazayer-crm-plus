
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskCategoryManagement from './TaskCategoryManagement';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const AdminTaskManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Management</CardTitle>
        <CardDescription>Configure task categories and manage task settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="settings">Task Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="space-y-4">
            <TaskCategoryManagement />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Task Settings</h3>
              <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="default-priority" className="text-sm mb-1 block">Default Priority</Label>
                      <select id="default-priority" className="w-full p-2 rounded-md border border-border bg-background">
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="task-reminders" className="text-sm mb-1 block">Task Reminders</Label>
                      <select id="task-reminders" className="w-full p-2 rounded-md border border-border bg-background">
                        <option value="none">None</option>
                        <option value="daily">Daily</option>
                        <option value="weekly" selected>Weekly</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-assign" />
                    <Label htmlFor="auto-assign">Auto-assign tasks based on workload</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-close" />
                    <Label htmlFor="auto-close">Automatically close completed tasks after 7 days</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="time-tracking-required" defaultChecked />
                    <Label htmlFor="time-tracking-required">Require time tracking for all tasks</Label>
                  </div>
                  
                  <div className="mt-4">
                    <Button className="mr-2">Save Settings</Button>
                    <Button variant="outline">Reset to Defaults</Button>
                  </div>
                </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminTaskManagement;
