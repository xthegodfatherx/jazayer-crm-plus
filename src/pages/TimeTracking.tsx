
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timer, Clock, Plus, Calendar, Edit, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TaskTimer from '@/components/tasks/TaskTimer';
import TeamTimeReport from '@/components/reports/TeamTimeReport';
import { Task } from './Tasks';
import { useToast } from '@/hooks/use-toast';

interface TimeEntry {
  id: string;
  taskId: string;
  startTime: string;
  endTime?: string;
  duration: number; // in seconds
  status: 'ongoing' | 'paused' | 'completed';
  notes?: string;
}

const TimeTracking: React.FC = () => {
  const [activeTimer, setActiveTimer] = useState<Task | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const { toast } = useToast();

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
    const timeEntry: TimeEntry = {
      id: Date.now().toString(),
      taskId,
      startTime: new Date(Date.now() - seconds * 1000).toISOString(),
      endTime: new Date().toISOString(),
      duration: seconds,
      status: 'completed',
    };
    
    setTimeEntries(prev => [...prev, timeEntry]);
    setActiveTimer(null);
  };

  const startTimerForTask = (task: Task) => {
    setActiveTimer(task);
    
    // Create a new ongoing time entry
    const timeEntry: TimeEntry = {
      id: Date.now().toString(),
      taskId: task.id,
      startTime: new Date().toISOString(),
      duration: 0,
      status: 'ongoing',
    };
    
    setTimeEntries(prev => [...prev, timeEntry]);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };

  const calculateTotalTime = () => {
    const totalSeconds = timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
    return formatDuration(totalSeconds);
  };

  const getTaskById = (taskId: string) => {
    return tasks.find(task => task.id === taskId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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
                My Time Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timeEntries.length > 0 ? (
                <div className="space-y-4">
                  {timeEntries.map((timeEntry) => {
                    const task = getTaskById(timeEntry.taskId);
                    if (!task) return null;
                    
                    return (
                      <div key={timeEntry.id} className="flex justify-between items-center p-3 border rounded-md group">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <div className="flex flex-col space-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Started: {formatDate(timeEntry.startTime)}
                            </span>
                            {timeEntry.endTime && (
                              <span>Ended: {formatDate(timeEntry.endTime)}</span>
                            )}
                            <span className="text-xs">Status: {timeEntry.status}</span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <p className="font-mono font-medium">{formatDuration(timeEntry.duration)}</p>
                          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit className="h-3 w-3" />
                          </Button>
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
                <div className="text-3xl font-bold text-center">{calculateTotalTime()}</div>
                <p className="text-center text-sm text-muted-foreground mt-2">Total Tracked Time</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-center">
                  {formatDuration(timeEntries.filter(entry => entry.status === 'completed').reduce((sum, entry) => sum + entry.duration, 0))}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">Completed Time</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-center">
                  {timeEntries.length > 0 ? (timeEntries.reduce((sum, entry) => sum + entry.duration, 0) / timeEntries.length / 60 / 60).toFixed(1) + 'h' : '0h'}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">Average Entry</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Time Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col">
                  <Calendar className="h-8 w-8 mb-2" />
                  <span>Weekly Report</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col">
                  <Calendar className="h-8 w-8 mb-2" />
                  <span>Monthly Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
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
