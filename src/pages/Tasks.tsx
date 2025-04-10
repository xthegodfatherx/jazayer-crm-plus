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

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
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
  subtasks?: { id: string; title: string; completed: boolean }[];
  timeTracked?: number; // Total time tracked in seconds
  comments?: Comment[];
  pinned?: boolean; // New property for pinned tasks
  project?: string; // New property for project
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
}

const Tasks = () => {
  const { toast } = useToast();
  const [showFilters, setShowFilters] = useState(false);
  const [activeTimer, setActiveTimer] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [tasks, setTasks] = useState<Task[]>([
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
      timeTracked: 7200, // 2 hours
      pinned: true,
      project: 'Client Website Redesign',
      subtasks: [
        { id: '1-1', title: 'Create wireframes', completed: true },
        { id: '1-2', title: 'Design mockups', completed: false },
        { id: '1-3', title: 'Get client approval', completed: false },
      ],
      comments: [
        {
          id: 'c1',
          author: 'Leila Benzema',
          content: 'The header needs more contrast. Consider using a darker background.',
          createdAt: '2025-04-08T14:30:00Z'
        },
        {
          id: 'c2',
          author: 'Ahmed Khalifi',
          content: 'I agree. I\'ll update the mockups with better contrast.',
          createdAt: '2025-04-09T09:15:00Z'
        }
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
      project: 'API Development',
      timeTracked: 3600, // 1 hour
      comments: [
        {
          id: 'c3',
          author: 'Karim Mansouri',
          content: 'Make sure to use refresh tokens with a reasonable expiration time.',
          createdAt: '2025-04-07T16:20:00Z'
        }
      ]
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
      project: 'Client Website Redesign',
      timeTracked: 10800, // 3 hours
      comments: []
    },
    {
      id: '4',
      title: 'Write user documentation',
      description: 'Create user guide for the new features',
      assignee: 'Karim Mansouri',
      dueDate: '2025-04-25',
      status: 'todo',
      priority: 'low',
      tags: ['Documentation'],
      project: 'API Development',
      comments: []
    },
    {
      id: '5',
      title: 'Set up payment gateway',
      description: 'Integrate SATIM payment gateway for Algerian users',
      assignee: 'Amina Kader',
      dueDate: '2025-04-18',
      status: 'done',
      priority: 'high',
      rating: 5,
      tags: ['Payment', 'Integration'],
      project: 'E-commerce Platform',
      timeTracked: 18000, // 5 hours
      comments: [
        {
          id: 'c4',
          author: 'Selma Bouaziz',
          content: 'The integration with SATIM is complete. Testing is successful.',
          createdAt: '2025-04-05T11:45:00Z'
        },
        {
          id: 'c5',
          author: 'Karim Mansouri',
          content: 'Great job! This completes the payment requirements for the project.',
          createdAt: '2025-04-06T13:20:00Z'
        }
      ]
    },
  ]);

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
  }, []);

  // Apply filters to tasks
  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      // Filter by status (ignore "all-statuses" value)
      if (filters.status && filters.status !== 'all-statuses') {
        if (task.status !== filters.status) {
          return false;
        }
      }
      
      // Filter by priority (ignore "all-priorities" value)
      if (filters.priority && filters.priority !== 'all-priorities') {
        if (task.priority !== filters.priority) {
          return false;
        }
      }
      
      // Filter by assignee (ignore "all-assignees" value)
      if (filters.assignee && filters.assignee !== 'all-assignees') {
        if (task.assignee !== filters.assignee) {
          return false;
        }
      }
      
      // Filter by project (ignore "all-projects" value)
      if (filters.project && filters.project !== 'all-projects') {
        if (task.project !== filters.project) {
          return false;
        }
      }
      
      // Filter by tags (any of the specified tags)
      if (filters.tags && filters.tags.length > 0) {
        if (!task.tags.some(tag => filters.tags?.includes(tag))) {
          return false;
        }
      }
      
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
      
      // Search query (search in title, description, and tags)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.tags.some(tag => tag.toLowerCase().includes(query))
        );
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

  const handleRateTask = (taskId: string, rating: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, rating } : task
    ));
  };

  const handleAddTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
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

  const handleSaveTime = (taskId: string, seconds: number) => {
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
  };

  const handleAddComment = (taskId: string, content: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      author: 'Current User', // In a real app, get from auth context
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
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId && task.subtasks) {
        const updatedSubtasks = task.subtasks.map(subtask => 
          subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        );
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    }));
  };

  const handleAddSubtask = (taskId: string, title: string) => {
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
  };

  const handleTogglePin = (taskId: string) => {
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

      {pinnedTasks.length > 0 && (
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
            />
          </CardContent>
        </Card>
      )}

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
