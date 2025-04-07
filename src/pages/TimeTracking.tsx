
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timer, Clock, Plus, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TaskTimer from '@/components/tasks/TaskTimer';
import TeamTimeReport from '@/components/reports/TeamTimeReport';
import { Task } from './Tasks';

const TimeTracking: React.FC = () => {
  const [activeTimer, setActiveTimer] = useState<Task | null>(null);
  const [savedTimes, setSavedTimes] = useState<{taskId: string, seconds: number}[]>([]);

  // Sample tasks (in a real app, these would come from a context or API)
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Design new homepage',
      description: 'Create a modern homepage design for the client website',
      assignee: 'Ahmed Khalifi',
      dueDate: '2025-04-15',
      status: 'in-progress',
      priority: 'high',
      rating: 4,
      tags: ['Design', 'Website'],
      subtasks: [
        { id: '1-1', title: 'Create wireframes', completed: true },
        { id: '1-2', title: 'Design mockups', completed: false },
        { id: '1-3', title: 'Get client approval', completed: false },
      ]
    },
    {
      id: '2',
      title: 'Implement API authentication',
      description: 'Add JWT authentication to the REST API',
      assignee: 'Leila Benzema',
      dueDate: '2025-04-20',
      status: 'todo',
      priority: 'medium',
      tags: ['Backend', 'Security'],
    },
    {
      id: '3',
      title: 'Fix mobile responsive issues',
      description: 'Address the layout problems on small screens',
      assignee: 'Selma Bouaziz',
      dueDate: '2025-04-10',
      status: 'in-review',
      priority: 'high',
      rating: 3,
      tags: ['Frontend', 'Mobile'],
    },
  ];
  
  const handleSaveTime = (taskId: string, seconds: number) => {
    setSavedTimes(prev => [...prev, { taskId, seconds }]);
    setActiveTimer(null);
  };

  const startTimerForTask = (task: Task) => {
    setActiveTimer(task);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Time Tracking</h1>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Start Timer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Select Task to Track</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {tasks.map(task => (
                  <Card key={task.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => {
                    startTimerForTask(task);
                  }}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">Assigned to: {task.assignee}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Timer className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="my-time">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="my-time">My Time</TabsTrigger>
          <TabsTrigger value="team-time">Team Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-time" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                My Recent Time Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {savedTimes.length > 0 ? (
                <div className="space-y-4">
                  {savedTimes.map((timeEntry, index) => {
                    const task = tasks.find(t => t.id === timeEntry.taskId);
                    if (!task) return null;
                    
                    const hours = Math.floor(timeEntry.seconds / 3600);
                    const minutes = Math.floor((timeEntry.seconds % 3600) / 60);
                    
                    return (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">Project: {task.tags[0]}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-medium">{hours}h {minutes}m</p>
                          <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No time entries yet. Start a timer to track your work.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-center">12h 30m</div>
                <p className="text-center text-sm text-muted-foreground mt-2">This week</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-center">42h 15m</div>
                <p className="text-center text-sm text-muted-foreground mt-2">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-center">3.5h</div>
                <p className="text-center text-sm text-muted-foreground mt-2">Daily average</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="team-time" className="mt-6">
          <TeamTimeReport dateRange="last-month" />
        </TabsContent>
      </Tabs>

      {activeTimer && (
        <TaskTimer 
          taskId={activeTimer.id} 
          taskTitle={activeTimer.title} 
          onSaveTime={handleSaveTime}
          assignee={activeTimer.assignee}
        />
      )}
    </div>
  );
};

export default TimeTracking;
