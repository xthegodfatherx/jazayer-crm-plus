
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils';
import StarRating from './StarRating';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Clock, AlertCircle, MessageSquare, CheckSquare, Square, Timer } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Task, Comment, Subtask } from '@/types/task';

interface TaskDetailDialogProps {
  task: Task | null;
  onClose: () => void;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  onRateTask?: (taskId: string, rating: number) => void;
  onAddComment?: (taskId: string, comment: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string, completed: boolean) => void;
  onStartTimeTracking?: (taskId: string) => void;
}

const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({
  task,
  onClose,
  onStatusChange,
  onRateTask,
  onAddComment,
  onToggleSubtask,
  onStartTimeTracking
}) => {
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  if (!task) return null;

  const handleStatusChange = (status: Task['status']) => {
    if (onStatusChange) {
      onStatusChange(task.id, status);
    }
  };

  const handleRating = (rating: number) => {
    if (onRateTask) {
      onRateTask(task.id, rating);
    }
  };

  const handleAddComment = () => {
    if (comment.trim() && onAddComment) {
      onAddComment(task.id, comment);
      setComment('');
    }
  };

  const handleToggleSubtask = (subtaskId: string, completed: boolean) => {
    if (onToggleSubtask) {
      onToggleSubtask(task.id, subtaskId, completed);
    }
  };

  const getStatusIndicator = (status: string) => {
    switch(status) {
      case 'done':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'review':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIndicator(task.status)}
              {task.title}
            </div>
            {getPriorityBadge(task.priority)}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            {task.description && (
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
            )}

            <div className="flex justify-between">
              <div>
                <h4 className="text-sm font-medium mb-1">Assigned to</h4>
                <div className="flex items-center space-x-2">
                  {task.assigned_to ? (
                    <>
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{task.assigned_to[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assigned_to}</span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unassigned</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Due date</h4>
                <span className="text-sm">
                  {task.due_date ? formatDate(task.due_date) : 'None'}
                </span>
              </div>
            </div>

            {task.tags && task.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Progress</h4>
              <div className="flex items-center space-x-2">
                <Button
                  variant={task.status === 'todo' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange('todo')}
                >
                  To Do
                </Button>
                <Button
                  variant={task.status === 'in_progress' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange('in_progress')}
                >
                  In Progress
                </Button>
                <Button
                  variant={task.status === 'review' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange('review')}
                >
                  Review
                </Button>
                <Button
                  variant={task.status === 'done' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange('done')}
                >
                  Done
                </Button>
              </div>
            </div>

            {task.status === 'done' && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Rating</h4>
                <StarRating
                  rating={task.rating || 0}
                  onChange={handleRating}
                />
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => onStartTimeTracking && onStartTimeTracking(task.id)}>
                <Timer className="h-4 w-4 mr-2" />
                Track Time
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {task.comments && task.comments.length > 0 ? (
                task.comments.map((comment: Comment, index) => (
                  <div key={index} className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{comment.author[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{comment.author}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-muted-foreground">No comments yet</p>
              )}
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddComment} 
                  disabled={!comment.trim()}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Comment
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subtasks" className="space-y-4">
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {task.subtasks && task.subtasks.length > 0 ? (
                task.subtasks.map((subtask: Subtask) => (
                  <div key={subtask.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
                    {subtask.completed ? (
                      <CheckSquare
                        className="h-5 w-5 text-primary cursor-pointer"
                        onClick={() => handleToggleSubtask(subtask.id, false)}
                      />
                    ) : (
                      <Square
                        className="h-5 w-5 text-muted-foreground cursor-pointer"
                        onClick={() => handleToggleSubtask(subtask.id, true)}
                      />
                    )}
                    <span className={`text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {subtask.title}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-muted-foreground">No subtasks</p>
              )}
            </div>

            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailDialog;
