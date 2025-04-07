
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
}

const Tasks = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTimer, setActiveTimer] = useState<Task | null>(null);
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
          />
        </TabsContent>
        <TabsContent value="list" className="mt-6">
          <TaskList 
            tasks={tasks} 
            onRateTask={handleRateTask} 
            onStartTimer={handleStartTimer}
            formatTime={formatTime}
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
    </div>
  );
};

export default Tasks;
