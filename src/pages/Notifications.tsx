
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  AlertCircle,
  Trash2,
  Check,
  Loader
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { notificationsApi, Notification } from '@/services/notifications-api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [page, setPage] = useState(1);
  const limit = 10; // notifications per page
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch notifications
  const { 
    data: notificationsData, 
    isLoading,
    error
  } = useQuery({
    queryKey: ['notifications', activeTab, page, limit],
    queryFn: () => notificationsApi.getNotifications({
      page,
      limit,
      is_read: activeTab === 'unread' ? false : undefined
    }),
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Action failed",
        description: "Could not mark notification as read. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      toast({
        title: "Success",
        description: "All notifications have been marked as read.",
      });
    },
    onError: (error) => {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Action failed",
        description: "Could not mark all notifications as read. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: notificationsApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Success",
        description: "Notification has been deleted.",
      });
    },
    onError: (error) => {
      console.error('Error deleting notification:', error);
      toast({
        title: "Action failed",
        description: "Could not delete notification. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.is_read) {
      markAsReadMutation.mutate(notification.id);
    }

    // Navigate based on the related entity if available
    if (notification.related_entity) {
      switch (notification.related_entity.type) {
        case 'task':
          navigate(`/tasks?id=${notification.related_entity.id}`);
          break;
        case 'project':
          navigate(`/projects/${notification.related_entity.id}`);
          break;
        case 'invoice':
          navigate(`/invoices?id=${notification.related_entity.id}`);
          break;
        case 'user':
          navigate(`/team?user=${notification.related_entity.id}`);
          break;
        default:
          // For system notifications or if no specific action
          break;
      }
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" />;
      case 'error':
        return <AlertCircle className="text-red-500" />;
      case 'info':
      default:
        return <Info className="text-blue-500" />;
    }
  };

  // Error state handling
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-800">Error loading notifications</h2>
        <p className="text-red-600">There was a problem loading your notifications. Please refresh or try again later.</p>
      </div>
    );
  }

  // Pagination handlers
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (notificationsData && page < Math.ceil(notificationsData.meta.total / limit)) {
      setPage(page + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button onClick={() => markAllAsReadMutation.mutate()} disabled={markAllAsReadMutation.isPending}>
          {markAllAsReadMutation.isPending ? (
            <Loader className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Check className="h-4 w-4 mr-2" />
          )}
          Mark All as Read
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => {
        setActiveTab(value as 'all' | 'unread');
        setPage(1); // Reset page when changing tabs
      }}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Notifications</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : notificationsData?.data?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto opacity-30 mb-3" />
                  <p>You have no notifications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notificationsData?.data.map((notification) => (
                    <div key={notification.id} className="relative">
                      <div 
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          notification.is_read ? 'bg-card hover:bg-muted/50' : 'bg-blue-50 hover:bg-blue-100'
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-medium">{notification.title}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant={notification.is_read ? "outline" : "secondary"}>
                                  {notification.is_read ? 'Read' : 'New'}
                                </Badge>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotificationMutation.mutate(notification.id);
                                  }}
                                  disabled={deleteNotificationMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                  
                  {/* Pagination */}
                  <div className="flex justify-between items-center pt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, notificationsData?.meta?.total || 0)} of {notificationsData?.meta?.total || 0}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handlePrevPage} 
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={!notificationsData?.meta?.total || page >= Math.ceil(notificationsData.meta.total / limit)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unread Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : notificationsData?.data?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto opacity-30 mb-3" />
                  <p>You have no unread notifications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notificationsData?.data.map((notification) => (
                    <div key={notification.id} className="relative">
                      <div 
                        className="p-4 bg-blue-50 rounded-lg cursor-pointer transition-colors hover:bg-blue-100"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-medium">{notification.title}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">New</Badge>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotificationMutation.mutate(notification.id);
                                  }}
                                  disabled={deleteNotificationMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                  
                  {/* Pagination */}
                  <div className="flex justify-between items-center pt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, notificationsData?.meta?.total || 0)} of {notificationsData?.meta?.total || 0}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handlePrevPage} 
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={!notificationsData?.meta?.total || page >= Math.ceil(notificationsData.meta.total / limit)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;
