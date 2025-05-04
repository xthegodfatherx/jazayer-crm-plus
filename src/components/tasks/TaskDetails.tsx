import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, Save, Check, Star } from 'lucide-react';
import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskDetailsProps {
  task: Task;
  onUpdate: (taskData: Partial<Task>) => Promise<void>;
  onDelete: () => Promise<void>;
  onRate?: (rating: number) => Promise<void>;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  onUpdate,
  onDelete,
  onRate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task.due_date ? new Date(task.due_date) : undefined
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await onUpdate({
        title,
        description,
        status,
        priority,
        due_date: dueDate ? dueDate.toISOString() : undefined,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update task:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (err) {
      console.error('Failed to delete task:', err);
      setIsDeleting(false);
    }
  };

  const handleRating = async (rating: number) => {
    if (onRate) {
      try {
        await onRate(rating);
      } catch (err) {
        console.error('Failed to rate task:', err);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 dark:text-red-400';
      case 'medium': return 'text-yellow-500 dark:text-yellow-400';
      case 'low': return 'text-green-500 dark:text-green-400';
      default: return '';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'todo': return 'secondary';
      case 'in_progress': return 'default';
      case 'review': return 'outline';
      case 'done': return 'secondary'; // Changed from 'success' to 'secondary'
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      {isEditing ? (
        <>
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input 
              id="title"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Task title" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea 
              id="description"
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Task description"
              rows={4} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <Select 
                value={status} 
                onValueChange={(value) => setStatus(value as Task['status'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">Priority</label>
              <Select 
                value={priority} 
                onValueChange={(value) => setPriority(value as Task['priority'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="due-date" className="text-sm font-medium">Due Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
          </div>
          
          {task.description && (
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Description:</p>
              <p className="whitespace-pre-wrap">{task.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <p className="text-muted-foreground text-sm">Status:</p>
              <Badge variant={getStatusBadgeVariant(task.status)}>
                {task.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            
            <div>
              <p className="text-muted-foreground text-sm">Priority:</p>
              <p className={`font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </p>
            </div>
            
            {task.assigned_to && (
              <div>
                <p className="text-muted-foreground text-sm">Assigned To:</p>
                <p>{task.assigned_to}</p>
              </div>
            )}
            
            {task.due_date && (
              <div>
                <p className="text-muted-foreground text-sm">Due Date:</p>
                <p>{new Date(task.due_date).toLocaleDateString()}</p>
              </div>
            )}
            
            {task.category && (
              <div>
                <p className="text-muted-foreground text-sm">Category:</p>
                <p>{task.category.name}</p>
              </div>
            )}
          </div>
          
          {onRate && (
            <>
              <Separator />
              <div>
                <p className="mb-2 text-sm font-medium">Rate this task:</p>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRating(rating)}
                      className={`p-1 transition-opacity hover:opacity-100 ${
                        task.rating && rating <= task.rating
                          ? 'text-amber-400 dark:text-amber-300 opacity-100'
                          : 'text-gray-300 dark:text-gray-500 opacity-70 hover:text-amber-400 hover:dark:text-amber-300'
                      }`}
                    >
                      <Star className="h-5 w-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          
          <Separator />
          
          <div className="pt-2">
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete Task'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskDetails;
