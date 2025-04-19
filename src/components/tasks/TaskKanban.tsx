
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
import { Plus } from 'lucide-react';

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
  const [hoveredColumnId, setHoveredColumnId] = useState<string | null>(null);
  
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
    if (event.over) {
      const overId = String(event.over.id);
      
      // Check if hovering over a column
      if (columns.some(col => col.id === overId)) {
        setHoveredColumnId(overId);
      } 
      // Check if hovering over a column container
      else if (overId.startsWith('column-')) {
        setHoveredColumnId(overId.replace('column-', ''));
      }
      // If hovering over a task, find its column
      else {
        const taskInColumn = tasks.find(t => t.id === overId);
        if (taskInColumn) {
          setHoveredColumnId(taskInColumn.status);
        }
      }
    } else {
      setHoveredColumnId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active && over) {
      const taskId = String(active.id);
      const overId = String(over.id);
      
      // Direct column drop
      if (columns.some(col => col.id === overId)) {
        onUpdateTaskStatus(taskId, overId as Task['status']);
      } 
      // Column container drop
      else if (overId.startsWith('column-')) {
        const columnId = overId.replace('column-', '');
        onUpdateTaskStatus(taskId, columnId as Task['status']);
      }
      // Drop over another task (use that task's status)
      else {
        const dropTask = tasks.find(t => t.id === overId);
        if (dropTask) {
          onUpdateTaskStatus(taskId, dropTask.status);
        }
      }
    }
    
    setActiveTask(null);
    setActiveId(null);
    setHoveredColumnId(null);
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
  
  // Get column statistics for VIP display
  const getCompletedTasksByUser = () => {
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
    
    return userStats;
  };
  
  // Find the top performer based on weighted score
  const getTopPerformer = () => {
    const userStats = getCompletedTasksByUser();
    let topUser = '';
    let topScore = -1;
    
    Object.entries(userStats).forEach(([user, stats]) => {
      // Calculate weighted score: 50% completed tasks, 30% time tracked, 20% rating
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
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* VIP Section - Top Performer */}
      {topPerformer.user && (
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-100 border border-amber-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold flex items-center mb-2">
            <span className="text-amber-500 mr-2">⭐</span> 
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
          const isColumnHovered = hoveredColumnId === column.id;
          
          return (
            <div 
              key={column.id} 
              className="space-y-4 transition-colors duration-200 hover:bg-accent/5 rounded-lg p-2"
            >
              <div 
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
                  isColumnHovered ? "bg-accent/10 ring-2 ring-offset-2 ring-primary/20" : "",
                  activeTask && !isColumnHovered ? "opacity-80" : ""
                )}
              >
                <SortableContext 
                  items={columnTasks.map(task => task.id)} 
                  strategy={verticalListSortingStrategy}
                >
                  {columnTasks.length === 0 ? (
                    <div className={cn(
                      "flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg border-border/50 text-muted-foreground",
                      isColumnHovered ? "bg-accent/20 border-primary/30" : ""
                    )}>
                      <Plus className="w-6 h-6 mb-2" />
                      <p className="text-sm">Drop tasks here</p>
                    </div>
                  ) : (
                    columnTasks.map(task => (
                      <div 
                        key={task.id} 
                        data-task-id={task.id} 
                        className={cn(
                          "touch-none transition-transform duration-200",
                          activeTask?.id === task.id ? "opacity-50 scale-95" : ""
                        )}
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
                </SortableContext>
              </div>
            </div>
          );
        })}
      </div>

      {activeTask && createPortal(
        <DragOverlay>
          <div className="w-full max-w-[350px] opacity-90 rotate-2 scale-105">
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
