
import React, { useState } from 'react';
import { Task } from '@/types/task';
import TaskCard from './TaskCard';
import { cn } from '@/lib/utils';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay,
  DragStartEvent, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverEvent,
  closestCorners,
} from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import { useToast } from '@/hooks/use-toast';

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
    { id: 'in_progress', title: 'In Progress', color: 'border-amber-500' },
    { id: 'review', title: 'In Review', color: 'border-purple-500' },
    { id: 'done', title: 'Done', color: 'border-green-500' },
  ];

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Configure sensors with better activation constraints
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        tolerance: 5,
        delay: 150,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id as string;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setActiveTask(task);
      console.log('Drag started:', task.title);
      
      // Find which column the task is in
      setActiveColumn(task.status);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) return;

    // Extract the overId more safely
    const overId = String(over.id);
    
    // Identify column more reliably
    const targetColumn = getTargetColumn(overId);
    
    if (targetColumn && activeColumn !== targetColumn) {
      // Highlight the column being dragged over
      setActiveColumn(targetColumn);
    }
  };

  // Helper function to reliably identify the target column
  const getTargetColumn = (id: string): string | null => {
    // Direct column match
    if (columns.some(col => col.id === id)) {
      return id;
    }
    
    // Column prefix match (for "column-todo" etc.)
    if (id.startsWith('column-')) {
      const columnId = id.replace('column-', '');
      if (columns.some(col => col.id === columnId)) {
        return columnId;
      }
    }
    
    return null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !active) {
      setActiveTask(null);
      setActiveColumn(null);
      return;
    }
    
    const taskId = active.id as string;
    const overId = String(over.id);
    
    // Find the target column more reliably
    const targetColumn = getTargetColumn(overId);
    
    if (targetColumn) {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.status !== targetColumn) {
        // Update the task status
        onUpdateTaskStatus(taskId, targetColumn as Task['status']);
        
        // Show toast notification
        toast({
          title: "Task Updated",
          description: `"${task.title}" moved from ${task.status} to ${targetColumn}`,
          variant: "default"
        });
        
        console.log(`Task ${taskId} moved from ${task.status} to ${targetColumn}`);
      }
    }
    
    setActiveTask(null);
    setActiveColumn(null);
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
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-1">
        {columns.map((column) => {
          const columnTasks = getColumnTasks(column.id);
          const isActiveColumn = activeColumn === column.id;
          
          return (
            <div 
              key={column.id} 
              className={cn(
                "space-y-4 transition-colors duration-200",
                isActiveColumn ? "bg-accent/20 rounded-lg" : "hover:bg-accent/5 rounded-lg"
              )}
            >
              <div 
                id={column.id}
                className={cn(
                  "py-3 border-t-4 rounded-t bg-background flex justify-between items-center px-4 shadow-sm",
                  column.color
                )}
              >
                <div>
                  <h3 className="font-semibold text-foreground/90">{column.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {columnTasks.length} {columnTasks.length === 1 ? 'task' : 'tasks'}
                  </p>
                </div>
                <span className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                  column.id === 'todo' ? "bg-blue-100 text-blue-600" :
                  column.id === 'in_progress' ? "bg-amber-100 text-amber-600" :
                  column.id === 'review' ? "bg-purple-100 text-purple-600" :
                  "bg-green-100 text-green-600"
                )}>
                  {columnTasks.length}
                </span>
              </div>

              <div 
                id={`column-${column.id}`}
                data-column-id={column.id}
                className={cn(
                  "bg-muted/40 rounded-lg min-h-[70vh] p-3 space-y-3 transition-colors duration-200",
                  "hover:bg-muted/50 border border-border/50",
                  isActiveColumn && "ring-2 ring-primary/20 bg-muted/60"
                )}
              >
                {columnTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg border-border/50 text-muted-foreground">
                    <p className="text-sm">Drop tasks here</p>
                  </div>
                ) : (
                  columnTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="transition-opacity"
                    >
                      <TaskCard 
                        task={task} 
                        onRateTask={onRateTask} 
                        isDraggable={true}
                        onStartTimer={onStartTimer}
                        formatTime={formatTime}
                        onViewTask={onViewTask}
                        onTogglePin={onTogglePin}
                        onToggleSubtask={undefined}
                        onUpdateTaskStatus={onUpdateTaskStatus}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {activeTask && createPortal(
        <DragOverlay adjustScale={false}>
          <div className="w-full max-w-[350px] opacity-80">
            <TaskCard 
              task={activeTask} 
              onRateTask={onRateTask} 
              isDraggable={false}
              onStartTimer={onStartTimer}
              formatTime={formatTime}
              onViewTask={onViewTask}
              onTogglePin={onTogglePin}
              onToggleSubtask={undefined}
              onUpdateTaskStatus={onUpdateTaskStatus}
            />
          </div>
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default TaskKanban;
