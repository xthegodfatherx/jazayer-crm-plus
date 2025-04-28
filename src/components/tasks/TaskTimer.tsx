import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  Clock, 
  StopCircle, 
  Save, 
  X,
  User
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { timeEntriesApi } from '@/services/api';

interface TaskTimerProps {
  taskId: string;
  taskTitle: string;
  onSaveTime?: (taskId: string, seconds: number) => void;
  initialSeconds?: number;
  assignee?: string;
}

const TaskTimer: React.FC<TaskTimerProps> = ({ 
  taskId, 
  taskTitle, 
  onSaveTime, 
  initialSeconds = 0,
  assignee
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isActive && !startTimestamp) {
      setStartTimestamp(new Date());
    }

    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, startTimestamp]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    const remainingSeconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (!isActive && !startTimestamp) {
      setStartTimestamp(new Date());
    }
    setIsActive(!isActive);
    toast({
      title: isActive ? "Timer paused" : "Timer started",
      description: `Task: ${taskTitle}`,
      variant: isActive ? "destructive" : "default"
    });
  };

  const stopTimer = () => {
    setIsActive(false);
    toast({
      title: "Timer stopped",
      description: `Total time: ${formatTime(seconds)}`,
      variant: "default"
    });
  };

  const saveTime = async () => {
    try {
      if (!startTimestamp) {
        toast({
          title: "Error",
          description: "Invalid start time",
          variant: "destructive"
        });
        return;
      }

      const endTime = new Date();
      
      // Save to database with required fields
      const timeEntryData = {
        task_id: taskId,
        start_time: startTimestamp.toISOString(),
        end_time: endTime.toISOString(),
        duration: seconds,
        description: `Time entry for task: ${taskTitle}`,
        billable: true,
        user_id: null, // This is nullable in the schema, so we can set it to null
        project_id: null // This is nullable in the schema, so we can set it to null
      };
      
      await timeEntriesApi.create(timeEntryData);

      if (onSaveTime) {
        onSaveTime(taskId, seconds);
      }
      
      toast({
        title: "Time saved",
        description: `${formatTime(seconds)} recorded for task "${taskTitle}"`,
        variant: "default"
      });
      
      setIsActive(false);
      setSeconds(0);
      setStartTimestamp(null);
    } catch (error) {
      console.error("Failed to save time entry:", error);
      toast({
        title: "Error",
        description: "Failed to save time entry",
        variant: "destructive"
      });
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg cursor-pointer flex items-center z-50 hover:bg-primary/90 transition-colors"
        onClick={toggleMinimize}
      >
        <Clock className="h-5 w-5" />
        {isActive && <span className="animate-pulse absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>}
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg z-50 border-2 border-primary/20 animate-in fade-in slide-in-from-bottom-10 duration-300">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            Task Timer
          </h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={toggleMinimize} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="truncate text-sm mb-3 font-medium" title={taskTitle}>
          {taskTitle}
        </div>
        
        {assignee && (
          <div className="text-xs text-muted-foreground mb-3 flex items-center">
            <User className="h-3 w-3 mr-1" />
            {assignee}
          </div>
        )}
        
        <div className="text-3xl font-mono text-center my-3 tabular-nums">
          {formatTime(seconds)}
        </div>
        
        <div className="flex justify-between gap-2 mt-4">
          <Button 
            variant={isActive ? "destructive" : "default"} 
            size="sm" 
            onClick={toggleTimer} 
            className="flex-1"
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={stopTimer} 
            className="flex-1"
          >
            <StopCircle className="h-4 w-4 mr-2" />
            Stop
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={saveTime} 
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskTimer;
