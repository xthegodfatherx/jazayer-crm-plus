
import React from 'react';
import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface TaskListProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  loading?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskClick, loading = false }) => {
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const getStatusIndicator = (status: string) => {
    switch(status) {
      case 'done':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'review':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex justify-between mb-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-full mb-4" />
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <div 
          key={task.id}
          onClick={() => onTaskClick && onTaskClick(task)}
          className="p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer"
        >
          <div className="flex justify-between mb-2">
            <h3 className="font-medium">{task.title}</h3>
            {getPriorityBadge(task.priority)}
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{task.description}</p>
          )}
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-2 items-center">
              {task.assigned_to ? (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{task.assigned_to[0]}</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
              )}
              <span className="text-sm text-muted-foreground">{task.assigned_to || 'Unassigned'}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              {getStatusIndicator(task.status)}
              {task.due_date && <span>{formatDate(task.due_date)}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
