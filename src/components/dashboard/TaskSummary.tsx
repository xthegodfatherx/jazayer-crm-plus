
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface TaskStatusItem {
  status: string;
  count: number;
  color: string;
}

const TaskSummary: React.FC = () => {
  const taskStatuses: TaskStatusItem[] = [
    { status: 'Todo', count: 15, color: 'bg-blue-500' },
    { status: 'In Progress', count: 8, color: 'bg-amber-500' },
    { status: 'In Review', count: 5, color: 'bg-purple-500' },
    { status: 'Completed', count: 24, color: 'bg-green-500' },
  ];

  const totalTasks = taskStatuses.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex space-x-6">
          {taskStatuses.map((item) => (
            <div key={item.status} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
              <span className="text-sm font-medium">{item.status}</span>
            </div>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          Total: <span className="font-medium text-foreground">{totalTasks}</span>
        </div>
      </div>

      <div className="space-y-4">
        {taskStatuses.map((item) => (
          <div key={item.status} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{item.status}</span>
              <span className="font-medium">{Math.round(item.count / totalTasks * 100)}%</span>
            </div>
            <Progress value={item.count / totalTasks * 100} className={item.color} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskSummary;
