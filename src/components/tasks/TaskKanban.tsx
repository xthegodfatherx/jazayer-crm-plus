
import React, { useState } from 'react';
import { Task } from '@/pages/Tasks';
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
  rectIntersection
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

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
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduced distance for easier dragging activation
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id as string;
    setActiveId(taskId);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Optional - can be used for visual feedback when dragging over columns
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active && over) {
      const taskId = String(active.id);
      const overId = String(over.id);
      
      // First check if the over element is a column
      if (columns.some(col => col.id === overId)) {
        console.log(`Moving task ${taskId} to column ${overId} (direct column drop)`);
        onUpdateTaskStatus(taskId, overId as Task['status']);
      } 
      // If not a column, check if it's a task or a column container
      else {
        // Try to find the task
        const dropTask = tasks.find(t => t.id === overId);
        if (dropTask) {
          // If we found a task, update to its status
          console.log(`Moving task ${taskId} to column ${dropTask.status} (via task)`);
          onUpdateTaskStatus(taskId, dropTask.status);
        } else {
          // Check if it's a column container by checking the id prefix
          if (overId.startsWith('column-')) {
            const columnId = overId.replace('column-', '');
            console.log(`Moving task ${taskId} to column ${columnId} (via container)`);
            onUpdateTaskStatus(taskId, columnId as Task['status']);
          }
        }
      }
    }
    
    setActiveTask(null);
    setActiveId(null);
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
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnTasks = getColumnTasks(column.id);
          return (
            <div 
              key={column.id} 
              className="space-y-4"
            >
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
                id={`column-${column.id}`}
                data-column-id={column.id}
                className="bg-muted/40 rounded-md min-h-[70vh] p-3 space-y-3"
              >
                <SortableContext 
                  items={columnTasks.map(task => task.id)} 
                  strategy={verticalListSortingStrategy}
                >
                  {columnTasks.map(task => (
                    <div key={task.id} data-task-id={task.id} className="touch-none">
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

      {activeTask && createPortal(
        <DragOverlay>
          <div className="w-full max-w-[350px] opacity-80">
            <TaskCard 
              task={activeTask} 
              onRateTask={onRateTask} 
              isDraggable={false}
              onStartTimer={onStartTimer}
              formatTime={formatTime}
              onViewTask={onViewTask}
              onTogglePin={onTogglePin}
            />
          </div>
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default TaskKanban;
