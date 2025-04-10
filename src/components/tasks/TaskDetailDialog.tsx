
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
  CheckSquare
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

interface TaskDetailDialogProps {
  task: Task;
  onClose: () => void;
  onAddComment: (content: string) => void;
}

const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({ 
  task, 
  onClose,
  onAddComment
}) => {
  const [commentText, setCommentText] = useState('');

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

  return (
    <Dialog open={!!task} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-1">
            {getStatusBadge()}
            <div className="flex items-center ml-2">
              {getPriorityIcon()}
              <span className="ml-1 text-xs capitalize">{task.priority} priority</span>
            </div>
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
              <span className="text-sm">{formatDate(task.dueDate)}</span>
            </div>
          </div>
          {task.timeTracked !== undefined && (
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Time Tracked</span>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm">
                  {Math.floor(task.timeTracked / 3600)}h {Math.floor((task.timeTracked % 3600) / 60)}m
                </span>
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

        {/* Subtasks if they exist */}
        {task.subtasks && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Subtasks</h3>
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>
              </div>
              <Progress value={subtaskProgress || 0} className="h-2" />
            </div>
            <div className="space-y-2">
              {task.subtasks.map(subtask => (
                <div key={subtask.id} className="flex items-center">
                  <CheckSquare className={`h-4 w-4 mr-2 ${subtask.completed ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

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
            placeholder="Add a comment..."
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
      <p className="text-sm">{comment.content}</p>
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
