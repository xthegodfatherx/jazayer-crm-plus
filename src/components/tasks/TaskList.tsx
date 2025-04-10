
import React from 'react';
import { Task } from '@/pages/Tasks';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowUpCircle, 
  ArrowRightCircle, 
  ArrowDownCircle, 
  Check, 
  Clock,
  Calendar,
  Timer,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from './StarRating';

interface TaskListProps {
  tasks: Task[];
  onRateTask: (taskId: string, rating: number) => void;
  onStartTimer?: (task: Task) => void;
  formatTime?: (seconds?: number) => string;
  onViewTask?: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onRateTask,
  onStartTimer,
  formatTime,
  onViewTask
}) => {
  const getStatusBadge = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">To Do</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">In Progress</Badge>;
      case 'in-review':
        return <Badge variant="outline" className="border-purple-500 text-purple-500">In Review</Badge>;
      case 'done':
        return <Badge variant="outline" className="border-green-500 text-green-500">Done</Badge>;
      default:
        return null;
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-DZ', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const handleStartTimer = (task: Task) => {
    if (onStartTimer) {
      onStartTimer(task);
    }
  };

  const handleViewTask = (task: Task) => {
    if (onViewTask) {
      onViewTask(task);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
            {formatTime && <TableHead>Time</TableHead>}
            <TableHead>Comments</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">
                <div>
                  {task.title}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {task.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src="" alt={task.assignee} />
                    <AvatarFallback>{task.assignee.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.assignee}</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(task.status)}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{formatDate(task.dueDate)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {getPriorityIcon(task.priority)}
                  <span className="ml-2 capitalize text-sm">{task.priority}</span>
                </div>
              </TableCell>
              {formatTime && (
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{formatTime(task.timeTracked)}</span>
                  </div>
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{task.comments?.length || 0}</span>
                </div>
              </TableCell>
              <TableCell>
                <StarRating 
                  rating={task.rating || 0} 
                  readOnly={false}
                  onRating={(rating) => onRateTask(task.id, rating)}
                  size="sm"
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  {task.subtasks && (
                    <Button variant="outline" size="sm">
                      <Check className="h-4 w-4 mr-1" />
                      <span className="text-xs">{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>
                    </Button>
                  )}
                  {onStartTimer && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStartTimer(task)}
                    >
                      <Timer className="h-4 w-4" />
                    </Button>
                  )}
                  {onViewTask && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewTask(task)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskList;
