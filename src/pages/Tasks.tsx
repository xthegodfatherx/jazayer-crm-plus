import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Timer, Pin } from 'lucide-react';
import TaskList from '@/components/tasks/TaskList';
import TaskKanban from '@/components/tasks/TaskKanban';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskCard from '@/components/tasks/TaskCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateTaskForm from '@/components/tasks/CreateTaskForm';
import TaskTimer from '@/components/tasks/TaskTimer';
import TaskDetailDialog from '@/components/tasks/TaskDetailDialog';
import { useToast } from '@/hooks/use-toast';
import { tasksApi, Task as ApiTask, handleError } from '@/services/api';

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface StatusHistoryEntry {
  status: 'todo' | 'in-progress' | 'in-review' | 'done';
  changedAt: string;
  changedBy: string;
}

interface Category {
  id: string;
  name: string;
  pricing: {
    oneStar: number;
    twoStar: number;
    threeStar: number;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: 'todo' | 'in-progress' | 'in-review' | 'done';
  priority: 'low' | 'medium' | 'high';
  rating?: number;
  tags: string[];
  category?: Category;
  subtasks?: { id: string; title: string; completed: boolean }[];
  timeTracked?: number;
  comments?: Comment[];
  pinned?: boolean;
  project?: string;
  statusHistory?: StatusHistoryEntry[];
}

interface FilterOptions {
  status?: Task['status'] | 'all-statuses';
  priority?: Task['priority'] | 'all-priorities';
  assignee?: string;
  tags?: string[];
  searchQuery?: string;
  showPinned?: boolean;
  minRating?: number;
  project?: string;
  dueDate?: 'all' | 'today' | 'tomorrow' | 'overdue' | 'this-week';
  onlyMyTasks?: boolean;
}

const Tasks = () => {
  const { toast } = useToast();
  const [showFilters, setShowFilters] = useState(false);
  const [activeTimer, setActiveTimer] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // In a real app, this would come from authentication context
  const currentUser = "Ahmed Khalifi"; // Example current user
  
  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        
        // Convert filters to API-compatible format
        const apiFilters: any = {};
        if (filters.status && filters.status !== 'all-statuses') {
          apiFilters.status = filters.status;
        }
        if (filters.priority && filters.priority !== 'all-priorities') {
          apiFilters.priority = filters.priority;
        }
        if (filters.assignee && filters.assignee !== 'all-assignees') {
          apiFilters.assigned_to = filters.assignee;
        }
        if (filters.searchQuery) {
          apiFilters.search = filters.searchQuery;
        }
        
        const { data: apiTasks } = await tasksApi.getAll({ filters: apiFilters });
        
        // Transform API tasks to match our UI format
        const transformedTasks: Task[] = apiTasks.map(apiTask => ({
          id: apiTask.id,
          title: apiTask.title,
          description: apiTask.description || '',
          assignee: apiTask.assigned_to || 'Unassigned',
          dueDate: apiTask.due_date || new Date().toISOString(),
          status: apiTask.status as Task['status'],
          priority: apiTask.priority,
          rating: apiTask.rating,
          tags: apiTask.tags || [],
          timeTracked: 0, // This might come from a separate time entries API
          pinned: false, // This might be stored in user preferences
          subtasks: [], // This might come from a subtasks relationship
          comments: [], // This might come from a comments relationship
        }));
        
        setTasks(transformedTasks);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [filters]);

  // Keep track of recent active tasks for notifications
  useEffect(() => {
    // Check for tasks due today or tomorrow
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dueTodayTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime() && task.status !== 'done';
    });
    
    if (dueTodayTasks.length > 0) {
      toast({
        title: `${dueTodayTasks.length} tasks due today`,
        description: dueTodayTasks.map(task => task.title).join(', '),
        variant: "default"
      });
    }
  }, [tasks]);

  // Apply filters to tasks
  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      // Filter logic remains the same as before
      // Only keeping the frontend-specific filters that aren't handled by the API

      // Filter by pinned status
      if (filters.showPinned === true && !task.pinned) {
        return false;
      }
      
      // Filter by minimum rating
      if (filters.minRating !== undefined && (task.rating || 0) < filters.minRating) {
        return false;
      }
      
      // Filter by due date
      if (filters.dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        
        if (filters.dueDate === 'today' && taskDate.getTime() !== today.getTime()) {
          return false;
        } else if (filters.dueDate === 'tomorrow' && taskDate.getTime() !== tomorrow.getTime()) {
          return false;
        } else if (filters.dueDate === 'overdue' && (taskDate >= today || task.status === 'done')) {
          return false;
        } else if (filters.dueDate === 'this-week') {
          const endOfWeek = new Date(today);
          endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
          if (taskDate < today || taskDate > endOfWeek) {
            return false;
          }
        }
      }
      
      return true;
    });
  }, [tasks, filters]);

  const getProjects = () => {
    return Array.from(new Set(tasks.map(task => task.project))).filter(Boolean) as string[];
  };

  const getAssignees = () => {
    return Array.from(new Set(tasks.map(task => task.assignee)));
  };

  const handleRateTask = async (taskId: string, rating: number) => {
    try {
      await tasksApi.rateTask(taskId, rating);
      
      // Update local state
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, rating } : task
      ));
      
      toast({
        title: "Task rated",
        description: `Task rated with ${rating} stars`,
        variant: "default"
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddTask = async (newTask: Task) => {
    try {
      // Transform UI task to API format
      const apiTask = {
        title: newTask.title,
        description: newTask.description,
        assigned_to: newTask.assignee,
        due_date: newTask.dueDate,
        status: newTask.status,
        priority: newTask.priority,
        tags: newTask.tags
      };
      
      // Create task via API
      const { data: createdTask } = await tasksApi.create(apiTask);
      
      // Transform the created task back to UI format and add to local state
      const uiTask: Task = {
        id: createdTask.id,
        title: createdTask.title,
        description: createdTask.description || '',
        assignee: createdTask.assigned_to || 'Unassigned',
        dueDate: createdTask.due_date || new Date().toISOString(),
        status: createdTask.status as Task['status'],
        priority: createdTask.priority,
        tags: createdTask.tags || [],
        timeTracked: 0,
        pinned: false,
        subtasks: [],
        comments: [],
      };
      
      setTasks([...tasks, uiTask]);
      
      toast({
        title: "Task created",
        description: `"${uiTask.title}" has been created`,
        variant: "default"
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      // Update via API
      await tasksApi.update(taskId, { status: newStatus });
      
      // Update local state
      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: newStatus, 
              // Optional: Track status change history
              statusHistory: [
                ...(task.statusHistory || []), 
                { 
                  status: newStatus, 
                  changedAt: new Date().toISOString(), 
                  changedBy: currentUser 
                }
              ] 
            } 
          : task
      );

      setTasks(updatedTasks);

      // Enhanced notification
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        toast({
          title: "Task Status Updated",
          description: `"${task.title}" is now ${newStatus.replace('-', ' ')}`,
          variant: "default"
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleStartTimer = (task: Task) => {
    // If there's already an active timer, notify user
    if (activeTimer && activeTimer.id !== task.id) {
      toast({
        title: "Timer already running",
        description: `You have an active timer for "${activeTimer.title}". Please stop it first.`,
        variant: "destructive"
      });
      return;
    }
    
    setActiveTimer(task);
  };

  const handleSaveTime = async (taskId: string, seconds: number) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      // Create a time entry via API
      const timeEntryData = {
        task_id: taskId,
        start_time: new Date(Date.now() - seconds * 1000).toISOString(),
        end_time: new Date().toISOString(),
        duration: seconds,
        description: `Time entry for task: ${task.title}`,
        billable: true,
        user_id: null, // This is nullable in the schema
        project_id: null // This is nullable in the schema
      };
      
      await timeEntriesApi.create(timeEntryData);
      
      // Update local state
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, timeTracked: (task.timeTracked || 0) + seconds } 
          : task
      ));
      
      setActiveTimer(null);
      
      toast({
        title: "Time saved",
        description: `${formatTime(seconds)} has been added to the task.`,
        variant: "default"
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddComment = async (taskId: string, content: string) => {
    try {
      // In a real implementation, this would call an API endpoint to add a comment
      // For now, we'll just update the local state
      const newComment: Comment = {
        id: `c${Date.now()}`,
        author: currentUser,
        content,
        createdAt: new Date().toISOString()
      };
      
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, comments: [...(task.comments || []), newComment] } 
          : task
      ));
      
      // Check for mentions in the comment
      const mentionRegex = /@(\w+)/g;
      const mentions = content.match(mentionRegex);
      
      if (mentions && mentions.length > 0) {
        toast({
          title: "Mentions detected",
          description: `You mentioned ${mentions.join(', ')} in your comment.`,
          variant: "default"
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleToggleSubtask = async (taskId: string, subtaskId: string) => {
    try {
      // In a real implementation, this would call an API endpoint to toggle the subtask
      // For now, we'll just update the local state
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === taskId && task.subtasks) {
          const updatedSubtasks = task.subtasks.map(subtask => 
            subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
          );
          return { ...task, subtasks: updatedSubtasks };
        }
        return task;
      }));
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddSubtask = async (taskId: string, title: string) => {
    try {
      // In a real implementation, this would call an API endpoint to add a subtask
      // For now, we'll just update the local state
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === taskId) {
          const newSubtask = {
            id: `sub-${Date.now()}`,
            title,
            completed: false
          };
          
          const updatedSubtasks = task.subtasks ? [...task.subtasks, newSubtask] : [newSubtask];
          return { ...task, subtasks: updatedSubtasks };
        }
        return task;
      }));
      
      toast({
        title: "Subtask added",
        description: `New subtask has been added.`,
        variant: "default"
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleTogglePin = async (taskId: string) => {
    try {
      // In a real implementation, this would call an API endpoint to toggle the pin status
      // For now, we'll just update the local state
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, pinned: !task.pinned } : task
      ));
      
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (taskToUpdate) {
        toast({
          title: taskToUpdate.pinned ? "Task unpinned" : "Task pinned",
          description: `"${taskToUpdate.title}" has been ${taskToUpdate.pinned ? 'unpinned' : 'pinned'}.`,
          variant: "default"
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return "0h 0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    
    toast({
      title: "Filters applied",
      description: "Task list has been updated based on your filters.",
      variant: "default"
    });
  };

  // Group pinned tasks for the pinned section
  const pinnedTasks = tasks.filter(task => task.pinned);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <CreateTaskForm onAddTask={handleAddTask} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading && (
        <Card>
          <CardContent className="p-6 flex justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p>Loading tasks...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && pinnedTasks.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Pin className="h-4 w-4 mr-2 text-primary" fill="currentColor" />
              Pinned Tasks
            </CardTitle>
            <CardDescription>Important tasks you've pinned to the top</CardDescription>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {pinnedTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onRateTask={handleRateTask}
                  onStartTimer={handleStartTimer}
                  formatTime={formatTime}
                  onViewTask={handleViewTask}
                  onTogglePin={handleTogglePin}
                  onToggleSubtask={handleToggleSubtask}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <TaskFilters 
              onApplyFilters={handleApplyFilters} 
              projects={getProjects()}
              assignees={getAssignees()}
              currentUser={currentUser}
            />
          </CardContent>
        </Card>
      )}

      {!loading && tasks.length === 0 && (
        <Card>
          <CardContent className="p-6 flex justify-center">
            <div className="text-center">
              <p>No tasks found. Create a new task to get started.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && tasks.length > 0 && (
        <Tabs defaultValue="kanban">
          <TabsList>
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <TabsContent value="kanban" className="mt-6">
            <TaskKanban 
              tasks={filteredTasks} 
              onRateTask={handleRateTask} 
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onStartTimer={handleStartTimer}
              formatTime={formatTime}
              onViewTask={handleViewTask}
              onTogglePin={handleTogglePin}
            />
          </TabsContent>
          <TabsContent value="list" className="mt-6">
            <TaskList 
              tasks={filteredTasks} 
              onRateTask={handleRateTask} 
              onStartTimer={handleStartTimer}
              formatTime={formatTime}
              onViewTask={handleViewTask}
            />
          </TabsContent>
        </Tabs>
      )}

      {activeTimer && (
        <TaskTimer 
          taskId={activeTimer.id} 
          taskTitle={activeTimer.title} 
          onSaveTime={handleSaveTime}
          assignee={activeTimer.assignee}
        />
      )}

      {selectedTask && (
        <TaskDetailDialog 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onAddComment={(content) => handleAddComment(selectedTask.id, content)}
          onToggleSubtask={handleToggleSubtask}
          onAddSubtask={handleAddSubtask}
          onTogglePin={handleTogglePin}
          onStartTimer={handleStartTimer}
        />
      )}
    </div>
  );
};

export default Tasks;
