
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Bell, 
  Shield, 
  Languages,
  Clock,
  Palette,
  Save,
  Loader,
  LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserProfile from '@/components/settings/UserProfile';
import { useToast } from '@/hooks/use-toast';
import { userSettingsApi, UserSettings } from '@/services/user-settings-api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import NotificationSettings from '@/pages/NotificationSettings';
import { useAuth } from '@/contexts/AuthContext';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  
  // Fetch user settings using React Query
  const { 
    data: settings, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['userSettings'],
    queryFn: userSettingsApi.getUserSettings
  });

  // Update notification settings mutation
  const updateNotificationSettingsMutation = useMutation({
    mutationFn: userSettingsApi.updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
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

  // Update appearance settings mutation
  const updateAppearanceMutation = useMutation({
    mutationFn: userSettingsApi.updateAppearanceSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
      toast({
        title: "Settings updated",
        description: "Your appearance settings have been saved."
      });
    },
    onError: (error) => {
      console.error('Error updating appearance settings:', error);
      toast({
        title: "Update failed",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update language settings mutation
  const updateLanguageMutation = useMutation({
    mutationFn: userSettingsApi.updateLanguageSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
      toast({
        title: "Settings updated",
        description: "Your language settings have been saved."
      });
    },
    onError: (error) => {
      console.error('Error updating language settings:', error);
      toast({
        title: "Update failed",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Handle notification settings changes
  const handleNotificationsToggle = (enabled: boolean) => {
    updateNotificationSettingsMutation.mutate({ 
      notifications_enabled: enabled 
    });
  };

  // Handle appearance settings changes
  const handleDarkModeToggle = (enabled: boolean) => {
    updateAppearanceMutation.mutate({ 
      dark_mode: enabled 
    });
  };

  // Handle language settings changes
  const handleLanguageChange = (language: 'ar' | 'en' | 'fr') => {
    updateLanguageMutation.mutate({ 
      language 
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        
        {/* Admin Dashboard Quick Access */}
        {hasPermission('admin.access') && (
          <Button onClick={() => navigate('/admin')} className="bg-purple-600 hover:bg-purple-700">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Admin Dashboard
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full border-b mb-6">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center">
            <Languages className="h-4 w-4 mr-2" />
            Language
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="timeTracking" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Time Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <UserProfile />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">Enable dark mode for the application</p>
                </div>
                <Switch 
                  checked={settings?.dark_mode || false} 
                  onCheckedChange={handleDarkModeToggle} 
                  id="dark-mode"
                  disabled={updateAppearanceMutation.isPending}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>Language Settings</CardTitle>
              <CardDescription>Choose your preferred language</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="ar" name="language" value="ar" 
                    checked={settings?.language === 'ar'} 
                    onChange={() => handleLanguageChange('ar')} 
                    className="h-4 w-4"
                    disabled={updateLanguageMutation.isPending}
                  />
                  <Label htmlFor="ar">العربية (Arabic)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="fr" name="language" value="fr" 
                    checked={settings?.language === 'fr'} 
                    onChange={() => handleLanguageChange('fr')} 
                    className="h-4 w-4"
                    disabled={updateLanguageMutation.isPending}
                  />
                  <Label htmlFor="fr">Français (French)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="en" name="language" value="en" 
                    checked={settings?.language === 'en'} 
                    onChange={() => handleLanguageChange('en')} 
                    className="h-4 w-4"
                    disabled={updateLanguageMutation.isPending}
                  />
                  <Label htmlFor="en">English</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Change Password</h3>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline">Setup 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeTracking">
          <Card>
            <CardHeader>
              <CardTitle>Time Tracking Settings</CardTitle>
              <CardDescription>Configure how time is tracked for tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Automatic Timer Pausing</h3>
                  <p className="text-sm text-muted-foreground">Pause timer automatically after inactivity</p>
                </div>
                <Switch id="auto-pause" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="inactivity-timeout">Inactivity Timeout (minutes)</Label>
                <Input id="inactivity-timeout" type="number" defaultValue={15} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Show Timer in Header</h3>
                  <p className="text-sm text-muted-foreground">Display active timer in the application header</p>
                </div>
                <Switch id="show-timer" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Loading spinner for mutations */}
      {(updateNotificationSettingsMutation.isPending || 
        updateAppearanceMutation.isPending || 
        updateLanguageMutation.isPending) && (
        <div className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-md flex items-center">
          <Loader className="h-4 w-4 animate-spin mr-2" />
          <span>Saving changes...</span>
        </div>
      )}
    </div>
  );
};

export default Settings;
