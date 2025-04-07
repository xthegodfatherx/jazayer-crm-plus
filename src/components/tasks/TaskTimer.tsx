import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  Clock, 
  StopCircle, 
  Save, 
  X 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TaskTimerProps {
  taskId: string;
  taskTitle: string;
  onSaveTime?: (taskId: string, seconds: number) => void;
  initialSeconds?: number;
}

const TaskTimer: React.FC<TaskTimerProps> = ({ 
  taskId, 
  taskTitle, 
  onSaveTime, 
  initialSeconds = 0 
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
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
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    const remainingSeconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const stopTimer = () => {
    setIsActive(false);
    // You can keep the timer at the current value or reset it
    // setSeconds(0);
  };

  const saveTime = () => {
    if (onSaveTime) {
      onSaveTime(taskId, seconds);
    }
    // Optionally reset the timer after saving
    // setSeconds(0);
    setIsActive(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-4 right-4 bg-primary text-white p-2 rounded-full shadow-lg cursor-pointer flex items-center z-50"
        onClick={toggleMinimize}
      >
        <Clock className="h-5 w-5" />
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg z-50">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Task Timer</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={toggleMinimize} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="truncate text-sm mb-3" title={taskTitle}>
          {taskTitle}
        </div>
        
        <div className="text-3xl font-mono text-center my-3">
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
