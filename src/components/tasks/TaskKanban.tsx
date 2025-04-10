
import React from 'react';
import { Task } from '@/pages/Tasks';
import TaskCard from './TaskCard';
import { cn } from '@/lib/utils';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanColumn {
  id: Task['status'];
  title: string;
  color: string;
}

interface TaskKanbanProps {
  tasks: Task[];
  onRateTask: (taskId: string, rating: number) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: Task['status']) => void;
  onStartTimer?: (task: Task) => void;
  formatTime?: (seconds?: number) => string;
  onViewTask?: (task: Task) => void;
  onTogglePin?: (taskId: string) => void;
}

const TaskKanban: React.FC<TaskKanbanProps> = ({ 
  tasks, 
  onRateTask, 
  onUpdateTaskStatus,
  onStartTimer,
  formatTime,
  onViewTask,
  onTogglePin
}) => {
  const columns: KanbanColumn[] = [
    { id: 'todo', title: 'To Do', color: 'border-blue-500' },
    { id: 'in-progress', title: 'In Progress', color: 'border-amber-500' },
    { id: 'in-review', title: 'In Review', color: 'border-purple-500' },
    { id: 'done', title: 'Done', color: 'border-green-500' },
  ];

  // Improved drag and drop functionality with DndKit
  const [draggedTask, setDraggedTask] = React.useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setDraggedTask(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const columnId = over.id as Task['status'];
      onUpdateTaskStatus(active.id as string, columnId);
    }
    
    setDraggedTask(null);
  };

  // Group tasks by column and sort pinned tasks to the top
  const getColumnTasks = (columnId: Task['status']) => {
    return tasks
      .filter(task => task.status === columnId)
      .sort((a, b) => {
        // Sort by pinned status first (pinned tasks on top)
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return 0;
      });
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnTasks = getColumnTasks(column.id);
          return (
            <div key={column.id} className="space-y-4">
              <div 
                className={cn(
                  "py-2 border-t-4 rounded-t bg-background flex justify-between items-center px-4",
                  column.color
                )}
              >
                <h3 className="font-medium">{column.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {columnTasks.length}
                </span>
              </div>

              <div 
                className="bg-muted/40 rounded-md min-h-[70vh] p-3 space-y-3"
                id={column.id} // Use column ID for drop target
              >
                <SortableContext 
                  items={columnTasks.map(task => task.id)} 
                  strategy={verticalListSortingStrategy}
                >
                  {columnTasks.map(task => (
                    <div key={task.id}>
                      <TaskCard 
                        task={task} 
                        onRateTask={onRateTask} 
                        isDraggable={true}
                        onStartTimer={onStartTimer}
                        formatTime={formatTime}
                        onViewTask={onViewTask}
                        onTogglePin={onTogglePin}
                      />
                    </div>
                  ))}
                </SortableContext>
              </div>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
};

export default TaskKanban;
