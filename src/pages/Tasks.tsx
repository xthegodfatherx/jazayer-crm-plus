import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { 
  CheckSquare, 
  Clock, 
  ListFilter, 
  List, 
  Plus, 
  Star, 
  LayoutGrid,
  ChevronDown
} from 'lucide-react';
import TaskList from '@/components/tasks/TaskList';
import TaskFilters from '@/components/tasks/TaskFilters';
import CreateTaskForm from '@/components/tasks/CreateTaskForm';
import TaskKanban from '@/components/tasks/TaskKanban';
import TaskDetails from '@/components/tasks/TaskDetails';
import { tasksApi } from '@/services/api';
import { Task } from '@/types/task';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  
  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await tasksApi.getAll({ filters: activeFilters });
        setTasks(response.data);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to load tasks. Please try again.');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load tasks'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [activeFilters]);
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };
  
  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      setIsLoading(true);
      
      // Update the task status in the UI optimistically
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
      
      // Update the task status in the database
      await tasksApi.update(taskId, { status: newStatus });
      
      toast({
        title: 'Status Updated',
        description: 'Task status has been updated successfully.'
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      
      // Revert the optimistic update
      const response = await tasksApi.getAll({ filters: activeFilters });
      setTasks(response.data);
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update task status'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateTask = async (taskData: Omit<Task, "id" | "created_at" | "updated_at">) => {
    try {
      setIsLoading(true);
      const { data: newTask } = await tasksApi.create(taskData);
      setTasks([...tasks, newTask]);
      
      toast({
        title: 'Task Created',
        description: 'New task has been created successfully.'
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error creating task:', error);
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create task'
      });
      
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateTask = async (taskId: string, taskData: Partial<Task>) => {
    try {
      setIsLoading(true);
      
      // Update the task in the UI optimistically
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, ...taskData } : task
      ));
      
      // Update the task in the database
      const { data: updatedTask } = await tasksApi.update(taskId, taskData);
      
      // Close the task details dialog
      setIsDetailsOpen(false);
      setSelectedTask(null);
      
      toast({
        title: 'Task Updated',
        description: 'Task has been updated successfully.'
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating task:', error);
      
      // Revert the optimistic update
      const response = await tasksApi.getAll({ filters: activeFilters });
      setTasks(response.data);
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update task'
      });
      
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      
      // Remove the task from the UI optimistically
      setTasks(tasks.filter(task => task.id !== taskId));
      
      // Delete the task from the database
      await tasksApi.delete(taskId);
      
      // Close the task details dialog
      setIsDetailsOpen(false);
      setSelectedTask(null);
      
      toast({
        title: 'Task Deleted',
        description: 'Task has been deleted successfully.'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      
      // Revert the optimistic update
      const response = await tasksApi.getAll({ filters: activeFilters });
      setTasks(response.data);
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete task'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRateTask = async (taskId: string, rating: number) => {
    try {
      setIsLoading(true);
      
      // Update the task rating in the UI optimistically
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, rating } : task
      ));
      
      // Update the task rating in the database
      await tasksApi.rateTask(taskId, rating);
      
      toast({
        title: 'Task Rated',
        description: `You rated this task ${rating} stars.`
      });
    } catch (error) {
      console.error('Error rating task:', error);
      
      // Revert the optimistic update
      const response = await tasksApi.getAll({ filters: activeFilters });
      setTasks(response.data);
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to rate task'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFilterChange = (filters: Record<string, any>) => {
    setActiveFilters(filters);
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-32" />
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-28 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>
        
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
                <DialogDescription>
                  Add a new task to your project. Fill in the task details below.
                </DialogDescription>
              </DialogHeader>
              <CreateTaskForm onCreateTask={handleCreateTask} />
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
          >
            <ListFilter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center">
              <List className="mr-2 h-4 w-4" /> 
              List
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex items-center">
              <LayoutGrid className="mr-2 h-4 w-4" /> 
              Kanban
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center">
              <Star className="mr-2 h-4 w-4" /> 
              Performance
            </TabsTrigger>
            <TabsTrigger value="time" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" /> 
              Time Tracking
            </TabsTrigger>
          </TabsList>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Sort By <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Date (Newest)
              </DropdownMenuItem>
              <DropdownMenuItem>
                Date (Oldest)
              </DropdownMenuItem>
              <DropdownMenuItem>
                Priority (High-Low)
              </DropdownMenuItem>
              <DropdownMenuItem>
                Priority (Low-High)
              </DropdownMenuItem>
              <DropdownMenuItem>
                Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {showFilters && (
          <div className="mt-6">
            <TaskFilters onFilter={handleFilterChange} />
          </div>
        )}
        
        <TabsContent value="list" className="mt-6">
          {error ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-red-500">
                  <p>{error}</p>
                  <Button 
                    onClick={() => setActiveFilters({})} 
                    className="mt-4"
                  >
                    Reset Filters & Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : tasks.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <TaskList 
                  tasks={tasks} 
                  onTaskClick={handleTaskClick}
                  loading={isLoading}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No tasks found</h3>
                  <p className="mt-2 text-muted-foreground">
                    {Object.keys(activeFilters).length > 0 
                      ? "No tasks match your current filters. Try adjusting your filters or create a new task."
                      : "Get started by creating your first task"}
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Create Task</DialogTitle>
                      </DialogHeader>
                      <CreateTaskForm onCreateTask={handleCreateTask} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="kanban" className="mt-6">
          <TaskKanban 
            tasks={tasks} 
            onStatusChange={handleStatusChange} 
            onTaskClick={handleTaskClick}
            loading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Performance</CardTitle>
              <CardDescription>View statistics about task completion and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">
                Task performance metrics will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="time" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Time Tracking</CardTitle>
              <CardDescription>Track time spent on tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">
                Time tracking features will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedTask && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Task Details</DialogTitle>
            </DialogHeader>
            <Separator />
            <TaskDetails 
              task={selectedTask} 
              onUpdate={(taskData) => handleUpdateTask(selectedTask.id, taskData)}
              onDelete={() => handleDeleteTask(selectedTask.id)}
              onRate={(rating) => handleRateTask(selectedTask.id, rating)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Tasks;
