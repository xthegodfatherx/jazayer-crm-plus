
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'review':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 mb-2 cursor-pointer hover:bg-muted/50 transition-colors ${isDragging ? 'border-primary' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
        {getPriorityBadge(task.priority)}
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-1">
          {getStatusIcon(task.status)}
          <span className="text-xs text-muted-foreground">
            {task.subtasks && task.subtasks.length > 0 && 
              `${task.subtasks.filter(s => s.completed).length}/${task.subtasks.length}`
            }
          </span>
        </div>
        
        {task.assigned_to && (
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {task.assigned_to[0]}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </Card>
  );
};

export default TaskCard;
