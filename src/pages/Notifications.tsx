
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Clock, Users, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

// Sample notification data
const sampleNotifications = [
  {
    id: '1',
    type: 'task',
    title: 'Task deadline approaching',
    message: 'The task "Create landing page" is due in 2 days',
    time: '2 hours ago',
    read: false
  },
  {
    id: '2',
    type: 'team',
    title: 'New team member added',
    message: 'Ahmed has been added to your team',
    time: '1 day ago',
    read: true
  },
  {
    id: '3',
    type: 'invoice',
    title: 'Invoice paid',
    message: 'Invoice #INV-2023-001 has been paid',
    time: '2 days ago',
    read: true
  },
  {
    id: '4',
    type: 'task',
    title: 'New task assigned',
    message: 'You have been assigned to "Update documentation"',
    time: '3 days ago',
    read: false
  },
  {
    id: '5',
    type: 'team',
    title: 'Team meeting reminder',
    message: 'Team meeting scheduled for tomorrow at 10:00 AM',
    time: '4 days ago',
    read: true
  }
];

const NotificationItem = ({ notification, onMarkAsRead }: { 
  notification: typeof sampleNotifications[0],
  onMarkAsRead: (id: string) => void
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'task':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'team':
        return <Users className="h-5 w-5 text-green-500" />;
      case 'invoice':
        return <Receipt className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div 
      className={`p-4 hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-muted/30' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-background">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h4 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>{notification.title}</h4>
            <span className="text-xs text-muted-foreground">{notification.time}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
        </div>
      </div>
      {!notification.read && (
        <div className="mt-2 flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onMarkAsRead(notification.id)}
          >
            Mark as read
          </Button>
        </div>
      )}
    </div>
  );
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState(sampleNotifications);
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getUnreadCount = (type?: string) => {
    return notifications.filter(n => 
      !n.read && (type ? n.type === type : true)
    ).length;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            You have {getUnreadCount()} unread notifications
          </p>
        </div>
        <Button variant="outline" onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="all" className="flex-1">
            All
            {getUnreadCount() > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {getUnreadCount()}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex-1">
            Tasks
            {getUnreadCount('task') > 0 && (
              <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                {getUnreadCount('task')}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="team" className="flex-1">
            Team
            {getUnreadCount('team') > 0 && (
              <span className="ml-2 bg-green-500 text-white rounded-full px-2 py-0.5 text-xs">
                {getUnreadCount('team')}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex-1">
            Invoices
            {getUnreadCount('invoice') > 0 && (
              <span className="ml-2 bg-purple-500 text-white rounded-full px-2 py-0.5 text-xs">
                {getUnreadCount('invoice')}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[60vh]">
              <TabsContent value="all" className="m-0 divide-y">
                {notifications.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    onMarkAsRead={markAsRead} 
                  />
                ))}
                {notifications.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No notifications to display
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="tasks" className="m-0 divide-y">
                {notifications.filter(n => n.type === 'task').map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    onMarkAsRead={markAsRead} 
                  />
                ))}
                {notifications.filter(n => n.type === 'task').length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No task notifications to display
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="team" className="m-0 divide-y">
                {notifications.filter(n => n.type === 'team').map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    onMarkAsRead={markAsRead} 
                  />
                ))}
                {notifications.filter(n => n.type === 'team').length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No team notifications to display
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="invoices" className="m-0 divide-y">
                {notifications.filter(n => n.type === 'invoice').map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    onMarkAsRead={markAsRead} 
                  />
                ))}
                {notifications.filter(n => n.type === 'invoice').length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No invoice notifications to display
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default Notifications;
