
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Task } from '@/pages/Tasks';
import StarRating from './StarRating';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowUpCircle, 
  ArrowRightCircle, 
  ArrowDownCircle,
  MoreHorizontal,
  Edit,
  Trash,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface TaskListProps {
  tasks: Task[];
  onRateTask: (taskId: string, rating: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onRateTask }) => {
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

  const getStatusBadge = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return <Badge variant="outline">To Do</Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">In Progress</Badge>;
      case 'in-review':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-100">In Review</Badge>;
      case 'done':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Done</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-DZ', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="px-4 py-2">
                <Checkbox id={`task-${task.id}`} />
              </TableCell>
              <TableCell className="font-medium">
                <div>
                  <div>{task.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                    {task.description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="" alt={task.assignee} />
                    <AvatarFallback>{task.assignee.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{task.assignee}</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(task.status)}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {getPriorityIcon(task.priority)}
                  <span className="ml-2 capitalize">{task.priority}</span>
                </div>
              </TableCell>
              <TableCell>{formatDueDate(task.dueDate)}</TableCell>
              <TableCell>
                <StarRating 
                  rating={task.rating || 0} 
                  readOnly={false}
                  onRating={(rating) => onRateTask(task.id, rating)}
                  size="sm"
                />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Task
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskList;
