
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Task, Comment } from '@/types/task';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowUpCircle, 
  ArrowRightCircle, 
  ArrowDownCircle,
  Calendar,
  Clock,
  CheckSquare,
  Timer,
  PlusCircle,
  Pin,
  PinOff
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface TaskDetailDialogProps {
  task: Task;
  onClose: () => void;
  onAddComment: (taskId: string, content: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onAddSubtask?: (taskId: string, title: string) => void;
  onTogglePin?: (taskId: string) => void;
  onStartTimer?: (task: Task) => void;
}

const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({ 
  task, 
  onClose,
  onAddComment,
  onToggleSubtask,
  onAddSubtask,
  onTogglePin,
  onStartTimer
}) => {
  const [commentText, setCommentText] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [localTask, setLocalTask] = useState<Task>(task);

  // Update local task when the task prop changes
  React.useEffect(() => {
    setLocalTask(task);
  }, [task]);

  const getPriorityIcon = () => {
    switch (localTask.priority) {
      case 'high':
        return <ArrowUpCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <ArrowRightCircle className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <ArrowDownCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-DZ', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-DZ', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onAddComment(localTask.id, commentText);
      
      // Optimistic update
      const newComment: Comment = {
        id: `c${Date.now()}`,
        author: 'Current User', // In a real app, get from auth context
        content: commentText,
        createdAt: new Date().toISOString()
      };
      
      setLocalTask(prevTask => ({
        ...prevTask,
        comments: [...(prevTask.comments || []), newComment]
      }));
      
      setCommentText('');
    }
  };

  const handleSubmitSubtask = () => {
    if (newSubtaskTitle.trim() && onAddSubtask) {
      onAddSubtask(localTask.id, newSubtaskTitle);
      
      // Optimistic update
      const newSubtask = {
        id: `sub-${Date.now()}`,
        title: newSubtaskTitle,
        completed: false
      };
      
      setLocalTask(prevTask => ({
        ...prevTask,
        subtasks: [...(prevTask.subtasks || []), newSubtask]
      }));
      
      setNewSubtaskTitle('');
    }
  };

  const handleToggleSubtaskLocal = (subtaskId: string) => {
    if (onToggleSubtask) {
      onToggleSubtask(localTask.id, subtaskId);
      
      // Optimistic update
      setLocalTask(prevTask => {
        if (prevTask.subtasks) {
          const updatedSubtasks = prevTask.subtasks.map(subtask => 
            subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
          );
          return { ...prevTask, subtasks: updatedSubtasks };
        }
        return prevTask;
      });
    }
  };

  const handleTogglePin = () => {
    if (onTogglePin) {
      onTogglePin(localTask.id);
      // Optimistic update
      setLocalTask(prevTask => ({
        ...prevTask,
        pinned: !prevTask.pinned
      }));
    }
  };

  const handleStartTimer = () => {
    if (onStartTimer) {
      onStartTimer(localTask);
    }
  };

  // Calculate subtask progress if subtasks exist
  const subtaskProgress = localTask.subtasks 
    ? Math.round((localTask.subtasks.filter(subtask => subtask.completed).length / localTask.subtasks.length) * 100) 
    : null;

  const getStatusBadge = () => {
    switch (localTask.status) {
      case 'todo':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">To Do</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">In Progress</Badge>;
      case 'in-review':
        return <Badge variant="outline" className="border-purple-500 text-purple-500">In Review</Badge>;
      case 'done':
        return <Badge variant="outline" className="border-green-500 text-green-500">Done</Badge>;
      default:
        return null;
    }
  };

  const isPastDue = new Date(localTask.dueDate) < new Date() && localTask.status !== 'done';

  return (
    <Dialog open={!!localTask} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {localTask.pinned && <Pin className="h-5 w-5 text-primary" fill="currentColor" />}
            {localTask.title}
            {onTogglePin && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 ml-2" 
                onClick={handleTogglePin}
              >
                {localTask.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
              </Button>
            )}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-1">
            {getStatusBadge()}
            <div className="flex items-center ml-2">
              {getPriorityIcon()}
              <span className="ml-1 text-xs capitalize">{localTask.priority} priority</span>
            </div>
            {isPastDue && (
              <Badge variant="destructive" className="ml-2">Overdue</Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 my-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Assignee</span>
            <div className="flex items-center mt-1">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback>{localTask.assignee.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{localTask.assignee}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Due Date</span>
            <div className="flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className={`text-sm ${isPastDue ? 'text-red-500 font-semibold' : ''}`}>
                {formatDate(localTask.dueDate)}
              </span>
            </div>
          </div>
          {localTask.timeTracked !== undefined && (
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Time Tracked</span>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm">
                    {Math.floor(localTask.timeTracked / 3600)}h {Math.floor((localTask.timeTracked % 3600) / 60)}m
                  </span>
                </div>
                {onStartTimer && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-6 px-2 text-xs"
                    onClick={handleStartTimer}
                  >
                    <Timer className="h-3 w-3 mr-1" />
                    Track
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <Separator className="my-2" />

        {/* Task Description */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <p className="text-sm text-muted-foreground">{localTask.description}</p>
        </div>

        {/* Subtasks section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Subtasks</h3>
            {onAddSubtask && localTask.subtasks && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  {localTask.subtasks.filter(st => st.completed).length}/{localTask.subtasks.length} completed
                </span>
              </div>
            )}
          </div>
          
          {localTask.subtasks && localTask.subtasks.length > 0 ? (
            <>
              <Progress value={subtaskProgress || 0} className="h-2 mb-3" />
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {localTask.subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center">
                    <Checkbox 
                      id={`detail-subtask-${subtask.id}`}
                      checked={subtask.completed}
                      onCheckedChange={() => handleToggleSubtaskLocal(subtask.id)}
                      className="mr-2"
                    />
                    <label 
                      htmlFor={`detail-subtask-${subtask.id}`}
                      className={`text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {subtask.title}
                    </label>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No subtasks yet.</p>
          )}
          
          {/* Add new subtask */}
          {onAddSubtask && (
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Add a subtask..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newSubtaskTitle.trim()) {
                    e.preventDefault();
                    handleSubmitSubtask();
                  }
                }}
              />
              <Button size="sm" onClick={handleSubmitSubtask} disabled={!newSubtaskTitle.trim()}>
                <PlusCircle className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Tags</h3>
          <div className="flex flex-wrap gap-1">
            {localTask.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-2" />

        {/* Comments Section */}
        <div className="flex-1 overflow-hidden">
          <h3 className="text-sm font-medium mb-2">Comments ({localTask.comments?.length || 0})</h3>
          
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-4">
              {localTask.comments && localTask.comments.length > 0 ? (
                localTask.comments.map(comment => (
                  <CommentItem key={comment.id} comment={comment} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Add Comment */}
        <div className="mt-4">
          <Textarea
            placeholder="Add a comment... (use @username to mention someone)"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === 'Enter' && commentText.trim()) {
                handleSubmitComment();
              }
            }}
          />
          <div className="flex justify-end mt-2">
            <Button onClick={handleSubmitComment} disabled={!commentText.trim()}>
              Add Comment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Comment Item Component
const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  // Function to highlight mentions in comment text
  const renderCommentText = (text: string) => {
    // Simple regex to find @mentions
    const mentionRegex = /(@\w+)/g;
    
    // Split text by mentions and map each part
    return text.split(mentionRegex).map((part, index) => {
      if (part.match(mentionRegex)) {
        // If it's a mention, highlight it
        return (
          <span key={index} className="font-medium text-primary">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-muted/40 rounded-md p-3">
      <div className="flex items-center mb-2">
        <Avatar className="h-6 w-6 mr-2">
          <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <span className="text-sm font-medium">{comment.author}</span>
          <span className="text-xs text-muted-foreground ml-2">
            {formatCommentDate(comment.createdAt)}
          </span>
        </div>
      </div>
      <p className="text-sm">{renderCommentText(comment.content)}</p>
    </div>
  );
};

const formatCommentDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-DZ', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export default TaskDetailDialog;
