
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, List, Grid3X3, Filter } from 'lucide-react';
import TaskList from '@/components/tasks/TaskList';
import TaskKanban from '@/components/tasks/TaskKanban';
import TaskFilters from '@/components/tasks/TaskFilters';
import CreateTaskForm from '@/components/tasks/CreateTaskForm';
import TaskDetailDialog from '@/components/tasks/TaskDetailDialog';
import TaskTimer from '@/components/tasks/TaskTimer';
import { tasksApi } from '@/services/tasks-api';
import { Task } from '@/types/task';
import { useToast } from '@/hooks/use-toast';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [viewType, setViewType] = useState<'list' | 'kanban'>('list');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [timerTask, setTimerTask] = useState<{
    id: string;
    title: string;
    assigned_to?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksApi.getAll();
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load tasks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters: any) => {
    let filtered = [...tasks];

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(task => {
        if (filters.status === 'in-progress') return task.status === 'in_progress';
        if (filters.status === 'in-review') return task.status === 'review';
        return task.status === filters.status;
      });
    }

    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.assignee && filters.assignee !== 'all') {
      filtered = filtered.filter(task => task.assigned_to === filters.assignee);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) || 
        (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await tasksApi.create({
        ...taskData,
        status: taskData.status as Task['status']
      });
      setTasks([...tasks, response.data]);
      setIsCreateDialogOpen(false);
      toast({
        title: 'Task Created',
        description: 'The task has been created successfully.',
      });
    } catch (err) {
      console.error('Error creating task:', err);
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTaskStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) return;

      await tasksApi.update(taskId, { 
        ...taskToUpdate,
        status 
      });

      setTasks(
        tasks.map(task => 
          task.id === taskId ? { ...task, status } : task
        )
      );

      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask({ ...selectedTask, status });
      }

      toast({
        title: 'Task Updated',
        description: `Task status changed to ${status.replace('_', ' ')}.`,
      });
    } catch (err) {
      console.error('Error updating task status:', err);
      toast({
        title: 'Error',
        description: 'Failed to update task status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRateTask = async (taskId: string, rating: number) => {
    try {
      await tasksApi.rateTask(taskId, rating);
      
      setTasks(
        tasks.map(task => 
          task.id === taskId ? { ...task, rating } : task
        )
      );

      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask({ ...selectedTask, rating });
      }

      toast({
        title: 'Task Rated',
        description: `You rated this task ${rating} stars.`,
      });
    } catch (err) {
      console.error('Error rating task:', err);
      toast({
        title: 'Error',
        description: 'Failed to rate the task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAddComment = async (taskId: string, commentContent: string) => {
    try {
      // This would typically be handled by an API call
      // For now, we'll update the state directly
      const newComment = {
        id: `comment-${Date.now()}`,
        author: 'Current User', // In production, get from auth context
        content: commentContent,
        createdAt: new Date().toISOString()
      };

      setTasks(
        tasks.map(task => 
          task.id === taskId 
            ? { 
                ...task, 
                comments: [...(task.comments || []), newComment] 
              } 
            : task
        )
      );

      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask({ 
          ...selectedTask, 
          comments: [...(selectedTask.comments || []), newComment] 
        });
      }

      toast({
        title: 'Comment Added',
        description: 'Your comment has been added successfully.',
      });
    } catch (err) {
      console.error('Error adding comment:', err);
      toast({
        title: 'Error',
        description: 'Failed to add comment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleSubtask = async (taskId: string, subtaskId: string, completed: boolean) => {
    try {
      setTasks(
        tasks.map(task => 
          task.id === taskId
            ? {
                ...task,
                subtasks: (task.subtasks || []).map(subtask =>
                  subtask.id === subtaskId
                    ? { ...subtask, completed }
                    : subtask
                )
              }
            : task
        )
      );

      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask({
          ...selectedTask,
          subtasks: (selectedTask.subtasks || []).map(subtask =>
            subtask.id === subtaskId
              ? { ...subtask, completed }
              : subtask
          )
        });
      }

      toast({
        title: completed ? 'Subtask Completed' : 'Subtask Reopened',
        description: completed 
          ? 'The subtask has been marked as completed.' 
          : 'The subtask has been reopened.',
      });
    } catch (err) {
      console.error('Error toggling subtask:', err);
      toast({
        title: 'Error',
        description: 'Failed to update subtask. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleStartTimeTracking = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTimerTask({
        id: task.id,
        title: task.title,
        assigned_to: task.assigned_to
      });
      setSelectedTask(null);
    }
  };

  const handleSaveTime = async (taskId: string, seconds: number) => {
    try {
      // This would be handled by the time entries API
      // For now, we'll just show a success message
      toast({
        title: 'Time Saved',
        description: `Time tracking saved for this task.`,
      });
    } catch (err) {
      console.error('Error saving time:', err);
      toast({
        title: 'Error',
        description: 'Failed to save time tracking. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Tasks</h1>
        
        <div className="flex items-center space-x-2">
          <Tabs value={viewType} onValueChange={(v: 'list' | 'kanban') => setViewType(v)}>
            <TabsList>
              <TabsTrigger value="list">
                <List className="h-4 w-4 mr-2" />
                List
              </TabsTrigger>
              <TabsTrigger value="kanban">
                <Grid3X3 className="h-4 w-4 mr-2" />
                Kanban
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <TaskFilters onFilter={handleFilter} />
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchTasks} 
            className="ml-4"
          >
            Retry
          </Button>
        </div>
      )}

      {viewType === 'list' ? (
        <TaskList 
          tasks={filteredTasks} 
          onTaskClick={handleTaskClick} 
          loading={loading}
        />
      ) : (
        <TaskKanban 
          tasks={filteredTasks}
          onStatusChange={handleTaskStatusChange}
          onTaskClick={handleTaskClick}
          loading={loading}
        />
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <CreateTaskForm onCreateTask={handleCreateTask} />
        </DialogContent>
      </Dialog>

      <TaskDetailDialog
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onStatusChange={handleTaskStatusChange}
        onRateTask={handleRateTask}
        onAddComment={handleAddComment}
        onToggleSubtask={handleToggleSubtask}
        onStartTimeTracking={handleStartTimeTracking}
      />

      {timerTask && (
        <TaskTimer
          taskId={timerTask.id}
          taskTitle={timerTask.title}
          assigned_to={timerTask.assigned_to}
          onSaveTime={handleSaveTime}
        />
      )}
    </div>
  );
};

export default Tasks;
