
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
  MessageSquare
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Task } from '@/pages/Tasks';
import StarRating from './StarRating';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface TaskCardProps {
  task: Task;
  onRateTask: (taskId: string, rating: number) => void;
  isDraggable?: boolean;
  onStartTimer?: (task: Task) => void;
  formatTime?: (seconds?: number) => string;
  onViewTask?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onRateTask, 
  isDraggable = false,
  onStartTimer,
  formatTime,
  onViewTask
}) => {
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

  const handleStartTimer = () => {
    if (onStartTimer) {
      onStartTimer(task);
    }
  };

  const handleViewTask = () => {
    if (onViewTask) {
      onViewTask(task);
    }
  };

  const commentCount = task.comments?.length || 0;

  return (
    <Card className={`group ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{task.title}</h3>
          <div className="flex items-center">
            {getPriorityIcon()}
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
        
        {task.subtasks && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Subtasks</span>
              <span>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>
            </div>
            <Progress value={subtaskProgress || 0} className="h-1" />
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
            <span className="text-xs">{formatDueDate(task.dueDate)}</span>
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
              <div className="flex items-center cursor-pointer">
                <span className="text-xs font-medium mr-1">Rating</span>
                <StarRating 
                  rating={task.rating || 0} 
                  readOnly={true}
                  size="sm"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="end">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Rate this task</h4>
                <StarRating 
                  rating={task.rating || 0} 
                  readOnly={false}
                  onRating={(rating) => onRateTask(task.id, rating)}
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
