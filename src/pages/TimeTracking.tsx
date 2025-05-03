
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timer, Clock, Plus, Calendar, Edit, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TaskTimer from '@/components/tasks/TaskTimer';
import TeamTimeReport from '@/components/reports/TeamTimeReport';
import { Task } from './Tasks';
import { useToast } from '@/hooks/use-toast';
import { tasksApi, timeEntriesApi } from '@/services/api';
import { TimeEntry } from '@/services/time-entries-api';
import { Database } from '@/integrations/supabase/types';

type TaskType = Database['public']['Tables']['tasks']['Row'];

const TimeTracking: React.FC = () => {
  const [activeTimer, setActiveTimer] = useState<Task | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTimeEntries();
    loadTasks();
  }, []);

  const loadTimeEntries = async () => {
    try {
      setLoading(true);
      const { data } = await timeEntriesApi.getAll();
      if (data) {
        setTimeEntries(data);
      }
    } catch (error) {
      console.error("Error loading time entries:", error);
      toast({
        title: "Error",
        description: "Failed to load time entries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const { data } = await tasksApi.getAll();
      if (data) {
        setTasks(data);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };
  
  const handleSaveTime = async (taskId: string, seconds: number) => {
    // Time entry has already been saved in the TaskTimer component
    // We just need to refresh the list
    loadTimeEntries();
    setActiveTimer(null);
  };

  const startTimerForTask = (task: TaskType) => {
    const taskForTimer: Task = {
      id: task.id,
      title: task.title,
      description: task.description || '',
      assignee: task.assigned_to || '',
      dueDate: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
      status: task.status as Task['status'],
      priority: task.priority as Task['priority'],
      tags: [],
    };
    
    setActiveTimer(taskForTimer);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };

  const calculateTotalTime = () => {
    const totalSeconds = timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
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
                          <p className="text-sm text-muted-foreground">Assigned to: {task.assigned_to || 'Unassigned'}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Timer className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {tasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No tasks available. Create a task first.</p>
                  </div>
                )}
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
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Loading time entries...</p>
                </div>
              ) : timeEntries.length > 0 ? (
                <div className="space-y-4">
                  {timeEntries.map((timeEntry) => {
                    const task = getTaskById(timeEntry.task_id || '');
                    
                    return (
                      <div key={timeEntry.id} className="flex justify-between items-center p-3 border rounded-md group">
                        <div>
                          <h3 className="font-medium">{task?.title || 'Unknown Task'}</h3>
                          <div className="flex flex-col space-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Started: {formatDate(timeEntry.start_time)}
                            </span>
                            {timeEntry.end_time && (
                              <span>Ended: {formatDate(timeEntry.end_time)}</span>
                            )}
                            <span className="text-xs">
                              Status: {timeEntry.end_time ? 'Completed' : 'Ongoing'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <p className="font-mono font-medium">
                            {formatDuration(timeEntry.duration || 0)}
                          </p>
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
                  {formatDuration(timeEntries.filter(entry => entry.end_time).reduce((sum, entry) => sum + (entry.duration || 0), 0))}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">Completed Time</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-center">
                  {timeEntries.length > 0 ? 
                    (timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / timeEntries.length / 60 / 60).toFixed(1) + 'h' 
                    : '0h'}
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
