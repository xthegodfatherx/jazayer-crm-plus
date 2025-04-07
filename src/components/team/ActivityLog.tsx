
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, CalendarDays, Filter } from 'lucide-react';

interface ActivityItem {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  actionType: 'task' | 'login' | 'client' | 'invoice' | 'comment' | 'rating';
  action: string;
  target: string;
  timestamp: string;
}

const ActivityLog: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: 1,
      user: { name: 'Ahmed Khalifi', avatar: '' },
      actionType: 'task',
      action: 'completed',
      target: 'Website Redesign Task',
      timestamp: '2025-04-06T14:23:00Z',
    },
    {
      id: 2,
      user: { name: 'Selma Bouaziz', avatar: '' },
      actionType: 'login',
      action: 'logged in',
      target: 'System',
      timestamp: '2025-04-06T14:00:00Z',
    },
    {
      id: 3,
      user: { name: 'Karim Mansouri', avatar: '' },
      actionType: 'client',
      action: 'added',
      target: 'Mobilis Algeria',
      timestamp: '2025-04-06T13:45:00Z',
    },
    {
      id: 4,
      user: { name: 'Leila Benzema', avatar: '' },
      actionType: 'invoice',
      action: 'created',
      target: 'INV-2025-042',
      timestamp: '2025-04-06T13:30:00Z',
    },
    {
      id: 5,
      user: { name: 'Mohammed Ali', avatar: '' },
      actionType: 'comment',
      action: 'commented on',
      target: 'API Integration Project',
      timestamp: '2025-04-06T12:15:00Z',
    },
    {
      id: 6,
      user: { name: 'Ahmed Khalifi', avatar: '' },
      actionType: 'rating',
      action: 'rated 5 stars',
      target: 'Mobile App Design Task',
      timestamp: '2025-04-06T11:30:00Z',
    },
    {
      id: 7,
      user: { name: 'Selma Bouaziz', avatar: '' },
      actionType: 'task',
      action: 'started',
      target: 'Frontend Bug Fix',
      timestamp: '2025-04-06T10:45:00Z',
    },
    {
      id: 8,
      user: { name: 'Karim Mansouri', avatar: '' },
      actionType: 'login',
      action: 'logged in',
      target: 'System',
      timestamp: '2025-04-06T09:15:00Z',
    },
  ];

  const getActionTypeBadge = (type: ActivityItem['actionType']) => {
    switch (type) {
      case 'task':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Task</Badge>;
      case 'login':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Login</Badge>;
      case 'client':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Client</Badge>;
      case 'invoice':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Invoice</Badge>;
      case 'comment':
        return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Comment</Badge>;
      case 'rating':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Rating</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('fr-DZ', { 
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search activities..." className="pl-8" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <CalendarDays className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Date & Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                      <AvatarFallback>{activity.user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span>{activity.user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{getActionTypeBadge(activity.actionType)}</TableCell>
                <TableCell>
                  <span className="font-medium">{activity.action}</span>
                  <span> {activity.target}</span>
                </TableCell>
                <TableCell>{formatTimestamp(activity.timestamp)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ActivityLog;
