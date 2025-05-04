
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { usePermissions } from '@/contexts/PermissionsContext';
import TaskCategoryManagement from './TaskCategoryManagement';

const TaskCategorySettings = () => {
  const { userRole } = usePermissions();
  const canManageCategories = userRole === 'admin' || userRole === 'manager';

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
