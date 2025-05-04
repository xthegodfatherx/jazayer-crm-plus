
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { settingsApi, NotificationSettings as NotificationSettingsType } from '@/services/settings-api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const NotificationSettings: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<NotificationSettingsType>({
    email_notifications: false,
    task_reminders: false,
    invoice_notifications: false,
    system_notifications: false
  });

  // Fetch notification settings using React Query
  const { 
    data, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['notificationSettings'],
    queryFn: settingsApi.getNotificationSettings,
    onSuccess: (data) => {
      if (data) {
        setSettings(data);
      }
    }
  });

  // Update notification settings mutation
  const updateNotificationSettingsMutation = useMutation({
    mutationFn: settingsApi.updateNotificationSettings,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] });
      setSettings(data);
      toast({
        title: "Settings updated",
        description: "Your notification settings have been saved."
      });
    },
    onError: (error) => {
      console.error('Error updating notification settings:', error);
      toast({
        title: "Update failed",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Handle notification settings changes
  const handleNotificationsToggle = (key: keyof NotificationSettingsType, enabled: boolean) => {
    updateNotificationSettingsMutation.mutate({ 
      [key]: enabled 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Configure how you want to receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-lg font-semibold text-red-800">Error loading settings</h2>
            <p className="text-red-600">There was a problem loading your notification settings. Please try again later.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={settings?.email_notifications || false} 
                  onCheckedChange={(checked) => handleNotificationsToggle('email_notifications', checked)} 
                  id="email-notifications"
                  disabled={updateNotificationSettingsMutation.isPending}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="task-reminders" className="text-base">Task Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminders for upcoming tasks</p>
                </div>
                <Switch 
                  checked={settings?.task_reminders || false} 
                  onCheckedChange={(checked) => handleNotificationsToggle('task_reminders', checked)}
                  id="task-reminders"
                  disabled={updateNotificationSettingsMutation.isPending}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="invoice-reminders" className="text-base">Invoice Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminders for unpaid invoices</p>
                </div>
                <Switch 
                  checked={settings?.invoice_notifications || false} 
                  onCheckedChange={(checked) => handleNotificationsToggle('invoice_notifications', checked)}
                  id="invoice-reminders"
                  disabled={updateNotificationSettingsMutation.isPending}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="system-notifications" className="text-base">System Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive important system alerts</p>
                </div>
                <Switch 
                  checked={settings?.system_notifications || false} 
                  onCheckedChange={(checked) => handleNotificationsToggle('system_notifications', checked)}
                  id="system-notifications"
                  disabled={updateNotificationSettingsMutation.isPending}
                />
              </div>
            </div>

            {/* Loading state for updates */}
            {updateNotificationSettingsMutation.isPending && (
              <div className="mt-4 p-2 bg-blue-50 text-blue-700 rounded flex items-center justify-center">
                <Loader className="h-4 w-4 animate-spin mr-2" />
                <span>Saving changes...</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
