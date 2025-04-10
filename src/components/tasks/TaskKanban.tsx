
import React from 'react';
import { Task } from '@/pages/Tasks';
import TaskCard from './TaskCard';
import { cn } from '@/lib/utils';

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
}

const TaskKanban: React.FC<TaskKanbanProps> = ({ 
  tasks, 
  onRateTask, 
  onUpdateTaskStatus,
  onStartTimer,
  formatTime,
  onViewTask
}) => {
  const columns: KanbanColumn[] = [
    { id: 'todo', title: 'To Do', color: 'border-blue-500' },
    { id: 'in-progress', title: 'In Progress', color: 'border-amber-500' },
    { id: 'in-review', title: 'In Review', color: 'border-purple-500' },
    { id: 'done', title: 'Done', color: 'border-green-500' },
  ];

  // Basic drag and drop functionality
  const [draggedTask, setDraggedTask] = React.useState<string | null>(null);

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnId: Task['status']) => {
    e.preventDefault();
    if (draggedTask) {
      onUpdateTaskStatus(draggedTask, columnId);
      setDraggedTask(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => (
        <div key={column.id} className="space-y-4">
          <div 
            className={cn(
              "py-2 border-t-4 rounded-t bg-background flex justify-between items-center px-4",
              column.color
            )}
          >
            <h3 className="font-medium">{column.title}</h3>
            <span className="text-sm text-muted-foreground">
              {tasks.filter(task => task.status === column.id).length}
            </span>
          </div>

          <div 
            className="bg-muted/40 rounded-md min-h-[70vh] p-3 space-y-3"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {tasks
              .filter(task => task.status === column.id)
              .map(task => (
                <div 
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                >
                  <TaskCard 
                    task={task} 
                    onRateTask={onRateTask} 
                    isDraggable={true}
                    onStartTimer={onStartTimer}
                    formatTime={formatTime}
                    onViewTask={onViewTask}
                  />
                </div>
              ))
            }
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskKanban;
