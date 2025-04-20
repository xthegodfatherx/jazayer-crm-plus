
import React, { useState, useEffect } from 'react';
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
  closestCorners,
  DragMoveEvent,
} from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import { Award, Trophy } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

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

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  
  // Configure sensors with looser constraints for easier dragging
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Lower threshold for easier drag activation
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

    const overId = String(over.id);
    
    // Determine if we're over a column
    const isColumn = columns.some(col => 
      col.id === overId || `column-${col.id}` === overId
    );
    
    if (isColumn && activeColumn !== overId.replace('column-', '')) {
      // Highlight the column being dragged over
      setActiveColumn(overId.replace('column-', ''));
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    // Optional: Add visual feedback during drag
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      setActiveColumn(null);
      return;
    }
    
    const taskId = active.id as string;
    const overId = String(over.id);
    
    console.log('Drag end - Task:', taskId, 'Over:', overId);
    
    // Find the target column status
    let targetStatus: Task['status'] | null = null;
    
    // Check if dropped directly on a column
    const matchingColumn = columns.find(col => col.id === overId);
    if (matchingColumn) {
      targetStatus = matchingColumn.id;
    } 
    // Check if dropped on a column container
    else if (overId.startsWith('column-')) {
      targetStatus = overId.replace('column-', '') as Task['status'];
    }
    
    if (targetStatus) {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.status !== targetStatus) {
        console.log(`Moving task from ${task.status} to ${targetStatus}`);
        onUpdateTaskStatus(taskId, targetStatus);
        
        // Show a success notification
        toast({
          title: "Task updated",
          description: `"${task.title}" moved to ${columns.find(c => c.id === targetStatus)?.title}`,
        });
      }
    } else {
      console.log('No valid target column found');
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
  
  // Calculate VIP performance metrics
  const getTopPerformer = () => {
    const userStats: Record<string, { completed: number, totalTime: number, avgRating: number, taskCount: number }> = {};
    
    tasks.forEach(task => {
      const user = task.assignee;
      
      if (!userStats[user]) {
        userStats[user] = { completed: 0, totalTime: 0, avgRating: 0, taskCount: 0 };
      }
      
      if (task.status === 'done') {
        userStats[user].completed += 1;
      }
      
      if (task.timeTracked) {
        userStats[user].totalTime += task.timeTracked;
      }
      
      if (task.rating) {
        const currentTotal = userStats[user].avgRating * userStats[user].taskCount;
        userStats[user].taskCount += 1;
        userStats[user].avgRating = (currentTotal + task.rating) / userStats[user].taskCount;
      }
    });
    
    let topUser = '';
    let topScore = -1;
    
    Object.entries(userStats).forEach(([user, stats]) => {
      const score = (
        (stats.completed * 0.5) + 
        ((stats.totalTime / 3600) * 0.3) + 
        (stats.avgRating * 0.2)
      );
      
      if (score > topScore) {
        topScore = score;
        topUser = user;
      }
    });
    
    return { user: topUser, score: topScore };
  };

  const topPerformer = getTopPerformer();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      {/* VIP Section - Top Performer */}
      {topPerformer.user && (
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-100 border border-amber-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold flex items-center mb-2">
            <Trophy className="h-5 w-5 mr-2 text-amber-500" />
            VIP - Top Performer of the Month
          </h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-amber-900">{topPerformer.user}</p>
              <p className="text-sm text-amber-700">
                Excelling in task completion, time management, and quality
              </p>
            </div>
            <div className="bg-white p-2 rounded-md border border-amber-200">
              <span className="text-lg font-semibold text-amber-600">
                {topPerformer.score.toFixed(1)} points
              </span>
            </div>
          </div>
        </div>
      )}

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
                  column.id === 'in-progress' ? "bg-amber-100 text-amber-600" :
                  column.id === 'in-review' ? "bg-purple-100 text-purple-600" :
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
