
export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_to?: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  rating?: number;
  timeTracked?: number;
  comments?: Comment[];
  subtasks?: Subtask[];
  pinned?: boolean;
  category?: {
    id: string;
    name: string;
  };
  dueDate?: string; // For compatibility with existing components
  assignee?: string; // For compatibility with existing components
  category_id?: string; // Added for compatibility with form submissions
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  in_progress: number;
  completed_change: number;
  pending_change: number;
  rating_change: number;
}
