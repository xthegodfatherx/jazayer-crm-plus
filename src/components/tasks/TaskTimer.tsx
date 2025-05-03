
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Timer, Pause, Play, Check, X, Clock } from 'lucide-react';
import { timeEntriesApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TaskTimerProps {
  taskId: string;
  taskTitle: string;
  onSaveTime: (taskId: string, seconds: number) => void;
  assigned_to?: string; // Use the API field name
}

const TaskTimer: React.FC<TaskTimerProps> = ({ taskId, taskTitle, onSaveTime, assigned_to }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [description, setDescription] = useState('');
  const [isBillable, setIsBillable] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Start timer initially
  useEffect(() => {
    startTimer();
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive) {
      interval = window.setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const startTimer = () => {
    if (!isActive) {
      setIsActive(true);
      if (!startTime) {
        setStartTime(new Date());
      }
    }
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveTime = async () => {
    if (seconds < 10) {
      toast({
        title: "Time too short",
        description: "Please track at least 10 seconds before saving.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSaving(true);
      
      // Create a new time entry
      await timeEntriesApi.create({
        task_id: taskId,
        description: description,
        start_time: startTime?.toISOString() || new Date().toISOString(),
        end_time: new Date().toISOString(),
        duration: seconds,
        billable: isBillable,
      });
      
      toast({
        title: "Time Entry Saved",
        description: `Saved ${formatTime(seconds)} for task "${taskTitle}"`,
      });
      
      onSaveTime(taskId, seconds);
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving time entry:", error);
      toast({
        title: "Error",
        description: "Failed to save time entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (seconds > 60) {
      if (!window.confirm("Are you sure you want to cancel? All tracked time will be lost.")) {
        return;
      }
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Timer className="h-5 w-5 mr-2" />
            Time Tracking
          </DialogTitle>
          <DialogDescription>
            Task: {taskTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {assigned_to && (
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{assigned_to[0]?.toUpperCase() || '?'}</AvatarFallback>
              </Avatar>
              <span>{assigned_to}</span>
            </div>
          )}
          
          <div className="flex flex-col items-center py-4">
            <div className="text-4xl font-mono font-bold mb-4">{formatTime(seconds)}</div>
            <div className="flex space-x-2">
              {isActive ? (
                <Button onClick={pauseTimer} variant="outline" size="icon">
                  <Pause className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={startTimer} variant="outline" size="icon">
                  <Play className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="What are you working on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isBillable"
              checked={isBillable}
              onCheckedChange={(checked) => setIsBillable(!!checked)}
            />
            <Label htmlFor="isBillable">Billable time</Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveTime} disabled={saving}>
              {saving ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Time Entry
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskTimer;
