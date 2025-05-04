
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { usePermissions } from '@/contexts/PermissionsContext';
import { taskCategoriesApi } from '@/services/task-categories-api';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/services/api';
import TaskCategoryManagement from './TaskCategoryManagement';

const TaskCategorySettings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userRole } = usePermissions() || { userRole: null };
  const { toast } = useToast();
  const canManageCategories = userRole === 'admin' || userRole === 'manager';

  useEffect(() => {
    const fetchCategories = async () => {
      if (!canManageCategories) return;
      
      try {
        setLoading(true);
        await taskCategoriesApi.getAll();
        setError(null);
      } catch (err) {
        setError('Failed to load task categories. Please try again later.');
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [canManageCategories]);

  if (!canManageCategories) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to manage task categories.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Categories</CardTitle>
          <CardDescription>
            Manage task categories and their pricing tiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading categories...</span>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Categories</CardTitle>
          <CardDescription>
            Manage task categories and their pricing tiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <p className="text-destructive">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Categories</CardTitle>
        <CardDescription>
          Manage task categories and their pricing tiers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TaskCategoryManagement />
      </CardContent>
    </Card>
  );
};

export default TaskCategorySettings;
