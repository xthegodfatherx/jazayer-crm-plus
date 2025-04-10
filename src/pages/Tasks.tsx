
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Timer } from 'lucide-react';
import TaskList from '@/components/tasks/TaskList';
import TaskKanban from '@/components/tasks/TaskKanban';
import TaskFilters from '@/components/tasks/TaskFilters';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateTaskForm from '@/components/tasks/CreateTaskForm';
import TaskTimer from '@/components/tasks/TaskTimer';
import TaskDetailDialog from '@/components/tasks/TaskDetailDialog';

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
}

const Tasks = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTimer, setActiveTimer] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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
    setActiveTimer(task);
  };

  const handleSaveTime = (taskId: string, seconds: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, timeTracked: (task.timeTracked || 0) + seconds } 
        : task
    ));
    setActiveTimer(null);
  };

  const handleAddComment = (taskId: string, content: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      author: 'Current User', // In a real app, get from auth context
      content,
      createdAt: new Date().toISOString()
    };
    
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, comments: [...(task.comments || []), newComment] } 
        : task
    ));
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

      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <TaskFilters />
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
            tasks={tasks} 
            onRateTask={handleRateTask} 
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onStartTimer={handleStartTimer}
            formatTime={formatTime}
            onViewTask={handleViewTask}
          />
        </TabsContent>
        <TabsContent value="list" className="mt-6">
          <TaskList 
            tasks={tasks} 
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
        />
      )}
    </div>
  );
};

export default Tasks;
