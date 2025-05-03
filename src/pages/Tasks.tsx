
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { tasksApi } from '@/services/tasks-api';
import { Task } from '@/types/task';
import { formatDateTime } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Edit, Trash2, ArrowDown, ArrowUp, CheckCheck, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'low' as Task['priority'],
    dueDate: '',
    assigned_to: '',
    tags: [] as string[],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const { data } = await tasksApi.getAll();
      if (data) {
        setTasks(data);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async () => {
    try {
      // Convert status from UI format to API format if needed
      const apiStatus = formData.status === 'in-progress' ? 'in_progress' :
                         formData.status === 'in-review' ? 'review' : 
                         formData.status;

      const newTask = {
        title: formData.title,
        description: formData.description,
        assigned_to: formData.assigned_to,
        due_date: formData.dueDate,
        status: apiStatus,
        priority: formData.priority,
        tags: formData.tags,
      };
      
      await tasksApi.create(newTask);
      
      toast({
        title: "Task Created",
        description: "Task created successfully.",
      })
      loadTasks();
      setIsDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'low',
        dueDate: '',
        assigned_to: '',
        tags: [],
      });
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to create task.",
        variant: "destructive"
      })
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.due_date || '',
      assigned_to: task.assigned_to || '',
      tags: task.tags || [],
    });
    setIsDialogOpen(true);
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;

    try {
      // Convert status from UI format to API format if needed
      const apiStatus = formData.status === 'in-progress' ? 'in_progress' :
                         formData.status === 'in-review' ? 'review' : 
                         formData.status;

      const updatedTask = {
        title: formData.title,
        description: formData.description,
        status: apiStatus,
        priority: formData.priority,
        due_date: formData.dueDate,
        assigned_to: formData.assigned_to,
        tags: formData.tags,
      };
      await tasksApi.update(selectedTask.id, updatedTask);
      toast({
        title: "Task Updated",
        description: "Task updated successfully.",
      })
      loadTasks();
      setIsDialogOpen(false);
      setSelectedTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'low',
        dueDate: '',
        assigned_to: '',
        tags: [],
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task.",
        variant: "destructive"
      })
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksApi.delete(taskId);
      toast({
        title: "Task Deleted",
        description: "Task deleted successfully.",
      })
      loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive"
      })
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    const apiStatus = 
      newStatus === 'in-progress' ? 'in_progress' :
      newStatus === 'in-review' ? 'review' : newStatus;
    
    try {
      await tasksApi.update(taskId, { status: apiStatus });
      toast({
        title: "Status Updated",
        description: "Task status updated successfully.",
      })
      loadTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive"
      })
    }
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    return format(date, 'yyyy-MM-dd');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Task</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
              <DialogDescription>
                {selectedTask ? 'Edit the task details.' : 'Enter the details for the new task.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right mt-2">
                  Description
                </Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(value: Task['status']) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select value={formData.priority} onValueChange={(value: Task['priority']) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !formData.dueDate && "text-muted-foreground"
                      )}
                    >
                      {formData.dueDate ? (
                        format(new Date(formData.dueDate), "yyyy-MM-dd")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center" side="bottom">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
                      onSelect={(date) => setFormData({ ...formData, dueDate: formatDate(date) })}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignee" className="text-right">
                  Assignee
                </Label>
                <Input type="text" id="assignee" name="assigned_to" value={formData.assigned_to} onChange={handleInputChange} className="col-span-3" />
              </div>
            </div>
            <Button onClick={selectedTask ? handleUpdateTask : handleCreateTask}>
              {selectedTask ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No tasks found.</TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{task.status}</Badge>
                  </TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.due_date ? formatDateTime(task.due_date, 'date') : 'No Due Date'}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${task.assigned_to}`} alt={task.assigned_to || 'Assignee'} />
                        <AvatarFallback>{task.assigned_to ? task.assigned_to[0].toUpperCase() : '?'}</AvatarFallback>
                      </Avatar>
                      <span>{task.assigned_to || 'Unassigned'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditTask(task)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteTask(task.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'todo')}>
                          <AlertTriangle className="mr-2 h-4 w-4" /> Mark as Todo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'in_progress')}>
                          <ArrowUp className="mr-2 h-4 w-4" /> Mark as In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'review')}>
                          <ArrowDown className="mr-2 h-4 w-4" /> Mark as In Review
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'done')}>
                          <CheckCheck className="mr-2 h-4 w-4" /> Mark as Done
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Tasks;
