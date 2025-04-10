
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
import { Comment, Task } from '@/pages/Tasks';
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
  onAddComment: (content: string) => void;
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

  const getPriorityIcon = () => {
    switch (task.priority) {
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
      onAddComment(commentText);
      setCommentText('');
    }
  };

  const handleSubmitSubtask = () => {
    if (newSubtaskTitle.trim() && onAddSubtask) {
      onAddSubtask(task.id, newSubtaskTitle);
      setNewSubtaskTitle('');
    }
  };

  const handleTogglePin = () => {
    if (onTogglePin) {
      onTogglePin(task.id);
    }
  };

  const handleStartTimer = () => {
    if (onStartTimer) {
      onStartTimer(task);
    }
  };

  // Calculate subtask progress if subtasks exist
  const subtaskProgress = task.subtasks 
    ? Math.round((task.subtasks.filter(subtask => subtask.completed).length / task.subtasks.length) * 100) 
    : null;

  const getStatusBadge = () => {
    switch (task.status) {
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

  const isPastDue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <Dialog open={!!task} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {task.pinned && <Pin className="h-5 w-5 text-primary" fill="currentColor" />}
            {task.title}
            {onTogglePin && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 ml-2" 
                onClick={handleTogglePin}
              >
                {task.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
              </Button>
            )}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-1">
            {getStatusBadge()}
            <div className="flex items-center ml-2">
              {getPriorityIcon()}
              <span className="ml-1 text-xs capitalize">{task.priority} priority</span>
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
                <AvatarFallback>{task.assignee.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{task.assignee}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Due Date</span>
            <div className="flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className={`text-sm ${isPastDue ? 'text-red-500 font-semibold' : ''}`}>
                {formatDate(task.dueDate)}
              </span>
            </div>
          </div>
          {task.timeTracked !== undefined && (
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Time Tracked</span>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm">
                    {Math.floor(task.timeTracked / 3600)}h {Math.floor((task.timeTracked % 3600) / 60)}m
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
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </div>

        {/* Subtasks section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Subtasks</h3>
            {onAddSubtask && task.subtasks && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} completed
                </span>
              </div>
            )}
          </div>
          
          {task.subtasks && task.subtasks.length > 0 ? (
            <>
              <Progress value={subtaskProgress || 0} className="h-2 mb-3" />
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {task.subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center">
                    <Checkbox 
                      id={`detail-subtask-${subtask.id}`}
                      checked={subtask.completed}
                      onCheckedChange={() => onToggleSubtask && onToggleSubtask(task.id, subtask.id)}
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
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-2" />

        {/* Comments Section */}
        <div className="flex-1 overflow-hidden">
          <h3 className="text-sm font-medium mb-2">Comments ({task.comments?.length || 0})</h3>
          
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-4">
              {task.comments && task.comments.length > 0 ? (
                task.comments.map(comment => (
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
