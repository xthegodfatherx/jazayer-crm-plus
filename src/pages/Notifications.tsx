
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, Trash2, Info, AlertCircle, CheckCircle, XCircle, Settings, LayoutDashboard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, Notification } from '@/services/notifications-api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistance } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for development environment
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Task Assigned',
    message: 'You have been assigned a new task: "Update user interface"',
    is_read: false,
    type: 'info',
    related_entity: { type: 'task', id: '123', name: 'Update user interface' },
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'You have received a payment of $1,500 for project "Website Redesign"',
    is_read: false,
    type: 'success',
    related_entity: { type: 'payment', id: '456', name: 'Website Redesign Payment' },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  },
  {
    id: '3',
    title: 'Project Deadline Approaching',
    message: 'Project "Mobile App Development" is due in 2 days',
    is_read: true,
    type: 'warning',
    related_entity: { type: 'project', id: '789', name: 'Mobile App Development' },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
  },
  {
    id: '4',
    title: 'System Maintenance',
    message: 'The system will be under maintenance on Sunday, May 10, from 02:00 to 04:00 UTC',
    is_read: true,
    type: 'info',
    related_entity: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // 3 days ago
  }
];

const mockNotificationResponse = {
  data: mockNotifications,
  meta: {
    total: mockNotifications.length,
    page: 1,
    limit: 10,
    total_pages: 1
  }
};

const mockUnreadCount = { count: mockNotifications.filter(n => !n.is_read).length };

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete
}: {
  notification: Notification;
  onMarkAsRead: () => void;
  onDelete: () => void;
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = () => {
    switch (notification.type) {
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`p-4 border rounded-lg mb-3 ${notification.is_read ? 'bg-gray-50' : 'bg-white border-l-4 border-l-blue-500'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-1">{getIcon()}</div>
          <div>
            <h4 className="font-medium text-sm">{notification.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={getTypeColor()}>
                {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
              </Badge>
              {notification.related_entity && (
                <Badge variant="outline" className="bg-gray-100">
                  {notification.related_entity.type.charAt(0).toUpperCase() + notification.related_entity.type.slice(1)}
                  {notification.related_entity.name ? `: ${notification.related_entity.name}` : ''}
                </Badge>
              )}
              <span className="text-xs text-gray-500">
                {formatDistance(new Date(notification.created_at), new Date(), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!notification.is_read && (
            <Button variant="ghost" size="sm" onClick={onMarkAsRead}>
              <CheckCheck className="h-4 w-4" />
              <span className="sr-only">Mark as read</span>
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [isDevEnvironment] = useState(import.meta.env.DEV);

  // Fetch notifications with mock data fallback
  const { data, isLoading, error } = useQuery({
    queryKey: ['notifications', filter, page],
    queryFn: async () => {
      if (isDevEnvironment) {
        console.log('Using mock notification data in development environment');
        // Filter mock data if "unread" filter is selected
        if (filter === 'unread') {
          return {
            data: mockNotifications.filter(n => !n.is_read),
            meta: {
              total: mockNotifications.filter(n => !n.is_read).length,
              page: 1,
              limit: 10,
              total_pages: 1
            }
          };
        }
        return mockNotificationResponse;
      }
      return await notificationsApi.getNotifications({
        page,
        limit,
        is_read: filter === 'unread' ? false : undefined
      });
    },
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: notificationsApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Success",
        description: "Notification deleted",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    },
  });

  // Get unread count with mock data fallback
  const { data: unreadData } = useQuery({
    queryKey: ['unread-count'],
    queryFn: async () => {
      if (isDevEnvironment) {
        console.log('Using mock unread count in development environment');
        return mockUnreadCount;
      }
      return await notificationsApi.getUnreadCount();
    },
  });

  // Handle mark as read actions in development mode
  const handleMarkAsRead = (id: string) => {
    if (isDevEnvironment) {
      // Update the mock data in development mode
      const index = mockNotifications.findIndex(n => n.id === id);
      if (index !== -1) {
        mockNotifications[index].is_read = true;
        // Force a refetch to update the UI
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['unread-count'] });
        toast({
          title: "Development Mode",
          description: "Notification marked as read (mock data)",
        });
      }
      return;
    }
    // Use the actual API in production
    markAsReadMutation.mutate(id);
  };

  // Handle mark all as read in development mode
  const handleMarkAllAsRead = () => {
    if (isDevEnvironment) {
      // Update all mock notifications
      mockNotifications.forEach(n => n.is_read = true);
      // Force a refetch to update the UI
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
      toast({
        title: "Development Mode",
        description: "All notifications marked as read (mock data)",
      });
      return;
    }
    // Use the actual API in production
    markAllAsReadMutation.mutate();
  };

  // Handle delete notification in development mode
  const handleDeleteNotification = (id: string) => {
    if (isDevEnvironment) {
      // Remove from mock data in development mode
      const index = mockNotifications.findIndex(n => n.id === id);
      if (index !== -1) {
        mockNotifications.splice(index, 1);
        // Force a refetch to update the UI
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        toast({
          title: "Development Mode",
          description: "Notification deleted (mock data)",
        });
      }
      return;
    }
    // Use the actual API in production
    deleteNotificationMutation.mutate(id);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-600">Stay updated with what's happening</p>
        </div>
        
        {/* Admin Dashboard Quick Access during development */}
        {hasPermission('admin.access') && (
          <Button onClick={() => navigate('/admin')} className="bg-purple-600 hover:bg-purple-700">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Admin Dashboard
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                <span>Your Notifications</span>
                {unreadData?.count > 0 && (
                  <Badge className="ml-2 bg-blue-500">{unreadData.count} new</Badge>
                )}
              </CardTitle>
              <CardDescription>Stay updated with task updates, messages, and system alerts</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending || (unreadData?.count === 0)}
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Notification Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
            <Separator className="my-4" />
            
            {error ? (
              <Alert variant="destructive" className="my-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Failed to load notifications. Please try again.</AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="space-y-4 mt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex gap-3">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <div className="flex gap-2 mt-2">
                          <Skeleton className="h-5 w-16 rounded-full" />
                          <Skeleton className="h-5 w-24 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.data.length === 0 ? (
              <div className="text-center py-10">
                <Bell className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium">No notifications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any {filter === 'unread' ? 'unread ' : ''}notifications at the moment.
                </p>
              </div>
            ) : (
              <div className="mt-4">
                {data?.data.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={() => handleMarkAsRead(notification.id)}
                    onDelete={() => handleDeleteNotification(notification.id)}
                  />
                ))}
              </div>
            )}
          </Tabs>
        </CardContent>
        {data?.meta && data.meta.total > limit && (
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-500">
              Showing {(page - 1) * limit + 1}-{Math.min(page * limit, data.meta.total)} of {data.meta.total}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= data.meta.total}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Notifications;
