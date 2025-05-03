
import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import TaskCard from './TaskCard';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';
import { Skeleton } from '@/components/ui/skeleton';

interface TaskKanbanProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onTaskClick?: (task: Task) => void;
  loading?: boolean;
}

const TaskKanban: React.FC<TaskKanbanProps> = ({ tasks, onStatusChange, onTaskClick, loading = false }) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    const task = tasks.find(task => task.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeStatus = over.id.toString().split('-')[0];
      
      // Map the column ID to task status
      let newStatus: Task['status'] = 'todo';
      
      switch (activeStatus) {
        case 'todo':
          newStatus = 'todo';
          break;
        case 'inProgress':
          newStatus = 'in_progress';
          break;
        case 'review':
          newStatus = 'review';
          break;
        case 'done':
          newStatus = 'done';
          break;
      }
      
      onStatusChange(active.id.toString(), newStatus);
    }
    
    setActiveTask(null);
  };

  const getColumnTasks = (status: string) => {
    return tasks.filter(task => {
      if (status === 'inProgress') {
        return task.status === 'in_progress';
      }
      return task.status === status;
    });
  };

  const getColumnTitle = (status: string) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'inProgress': return 'In Progress';
      case 'review': return 'Review';
      case 'done': return 'Done';
      default: return '';
    }
  };

  const getColumnCount = (status: string) => {
    return getColumnTasks(status).length;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['todo', 'inProgress', 'review', 'done'].map(status => (
          <div key={status} className="bg-muted/50 p-4 rounded-lg h-[500px]">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-8 rounded-full" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-32 w-full rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['todo', 'inProgress', 'review', 'done'].map(status => (
          <div
            key={status}
            id={`${status}`}
            className="bg-muted/50 p-4 rounded-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">{getColumnTitle(status)}</h3>
              <Badge variant="outline">{getColumnCount(status)}</Badge>
            </div>
            
            <div className="space-y-2 min-h-[400px]">
              <SortableContext items={getColumnTasks(status).map(t => t.id)} strategy={verticalListSortingStrategy}>
                {getColumnTasks(status).map(task => (
                  <TaskCard 
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick && onTaskClick(task)}
                  />
                ))}
              </SortableContext>
              
              {getColumnTasks(status).length === 0 && (
                <div className="h-20 border border-dashed border-gray-300 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">No tasks</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </DndContext>
  );
};

export default TaskKanban;
