
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckSquare, 
  ArrowUpCircle, 
  ArrowRightCircle, 
  ArrowDownCircle,
  Calendar
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Task } from '@/pages/Tasks';
import StarRating from './StarRating';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';

interface TaskCardProps {
  task: Task;
  onRateTask: (taskId: string, rating: number) => void;
  isDraggable?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onRateTask, isDraggable = false }) => {
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
        
        <div className="w-full mt-3 border-t pt-3">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex justify-between items-center cursor-pointer">
                <span className="text-xs font-medium">Task Rating</span>
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
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
