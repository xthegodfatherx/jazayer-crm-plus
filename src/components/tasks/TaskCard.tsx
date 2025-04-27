import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckSquare, 
  ArrowUpCircle, 
  ArrowRightCircle, 
  ArrowDownCircle,
  Calendar,
  Timer,
  MessageSquare,
  Pin,
  PinOff,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Task } from '@/pages/Tasks';
import StarRating from './StarRating';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onRateTask: (taskId: string, rating: number) => void;
  isDraggable?: boolean;
  onStartTimer?: (task: Task) => void;
  formatTime?: (seconds?: number) => string;
  onViewTask?: (task: Task) => void;
  onTogglePin?: (taskId: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onUpdateTaskStatus?: (taskId: string, newStatus: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onRateTask,
  isDraggable = false,
  onStartTimer,
  formatTime,
  onViewTask,
  onTogglePin,
  onToggleSubtask,
  onUpdateTaskStatus
}) => {
  // Setup draggable functionality
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    disabled: !isDraggable,
  });

  const getPriorityIcon = () => {
    switch (task.priority) {
      case 'high':
        return <ArrowUpCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <ArrowRightCircle className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <ArrowDownCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  // Calculate subtask progress if subtasks exist
  const subtaskProgress = task.subtasks 
    ? Math.round((task.subtasks.filter(subtask => subtask.completed).length / task.subtasks.length) * 100) 
    : null;

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-DZ', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const handleStartTimer = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag start when clicking buttons
    if (onStartTimer) {
      onStartTimer(task);
    }
  };

  const handleViewTask = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag start when clicking buttons
    if (onViewTask) {
      onViewTask(task);
    }
  };

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag start when clicking buttons
    if (onTogglePin) {
      onTogglePin(task.id);
    }
  };

  const handleToggleSubtask = (subtaskId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag start when clicking buttons
    if (onToggleSubtask) {
      onToggleSubtask(task.id, subtaskId);
    }
  };

  const handleRating = (rating: number) => {
    onRateTask(task.id, rating);
  };

  const commentCount = task.comments?.length || 0;

  const isPastDue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  const statusColors = {
    'todo': 'bg-blue-500/10 text-blue-500',
    'in-progress': 'bg-amber-500/10 text-amber-500',
    'in-review': 'bg-purple-500/10 text-purple-500',
    'done': 'bg-green-500/10 text-green-500',
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    if (onUpdateTaskStatus) {
      onUpdateTaskStatus(task.id, newStatus);
    }
  };

  return (
    <Card 
      ref={setNodeRef}
      {...(isDraggable ? attributes : {})}
      {...(isDraggable ? listeners : {})}
      className={cn(
        isDraggable ? 'cursor-grab active:cursor-grabbing' : '',
        task.pinned ? 'border-primary' : '',
        isPastDue ? 'border-red-300' : '',
        isDragging ? 'opacity-50' : 'opacity-100',
        'touch-none'
      )}
      style={{
        transform: isDragging ? 'scale(1.02)' : undefined,
        transition: 'transform 0.1s ease-in-out',
      }}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium flex items-center gap-2">
              {task.pinned && <Pin className="h-4 w-4 text-primary" fill="currentColor" />}
              {task.title}
            </h3>
            {task.category && (
              <Badge variant="outline" className="mt-1">
                {task.category.name}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {getPriorityIcon()}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={cn(
                    "h-7 px-2 text-xs flex items-center gap-1",
                    statusColors[task.status]
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  {task.status.replace('-', ' ')}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {['todo', 'in-progress', 'in-review', 'done'].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(status as Task['status']);
                    }}
                    className={cn(
                      "capitalize",
                      task.status === status && "bg-accent"
                    )}
                  >
                    {status.replace('-', ' ')}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {onTogglePin && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" 
                onClick={handleTogglePin}
              >
                {task.pinned ? (
                  <PinOff className="h-4 w-4" />
                ) : (
                  <Pin className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{task.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Subtasks</span>
              <span>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>
            </div>
            <Progress value={subtaskProgress || 0} className="h-1" />
            <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
              {task.subtasks.slice(0, 3).map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2 text-xs">
                  <Checkbox 
                    id={`subtask-${subtask.id}`}
                    checked={subtask.completed}
                    onCheckedChange={(checked) => onToggleSubtask && onToggleSubtask(task.id, subtask.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label 
                    htmlFor={`subtask-${subtask.id}`}
                    className={`${subtask.completed ? 'line-through text-muted-foreground' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {subtask.title}
                  </label>
                </div>
              ))}
              {task.subtasks.length > 3 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs p-0 h-auto" 
                  onClick={handleViewTask}
                >
                  Show {task.subtasks.length - 3} more...
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Time tracking information */}
        {formatTime && (
          <div className="mb-3 flex justify-between items-center">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>Time tracked: {formatTime(task.timeTracked)}</span>
            </div>
            {onStartTimer && (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-6 px-2 text-xs"
                onClick={handleStartTimer}
              >
                <Timer className="h-3 w-3 mr-1" />
                Track
              </Button>
            )}
          </div>
        )}

        {/* Comments count */}
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <MessageSquare className="h-3 w-3 mr-1" />
          <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 flex flex-col">
        <div className="flex items-center justify-between w-full text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
            <span className={`text-xs ${isPastDue ? 'text-red-500 font-semibold' : ''}`}>
              {formatDueDate(task.dueDate)}
              {isPastDue && ' (overdue)'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src="" alt={task.assignee} />
              <AvatarFallback>{task.assignee.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <div className="w-full mt-3 border-t pt-3 flex justify-between items-center">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                <span className="text-xs font-medium mr-1">Rating</span>
                <StarRating 
                  rating={task.rating || 0} 
                  readOnly={true}
                  size="sm"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="end" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Rate this task</h4>
                <StarRating 
                  rating={task.rating || 0} 
                  readOnly={false}
                  onRating={handleRating}
                  size="md"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Rating: {task.rating ? task.rating : 'Not rated yet'}
                </p>
              </div>
            </PopoverContent>
          </Popover>

          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs"
            onClick={handleViewTask}
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
