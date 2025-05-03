
import React, { useEffect, useState } from 'react';
import { Loader2, CheckSquare, FileText, CreditCard, Users, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { activityApi, Activity } from '@/services/activity-api';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/services/api';

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const { data } = await activityApi.getRecent();
        setActivities(data);
      } catch (error) {
        handleError(error);
        toast({
          title: "Error loading activities",
          description: "Failed to load recent activities. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [toast]);

  // Function to get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="h-4 w-4 text-blue-500" />;
      case 'invoice':
        return <FileText className="h-4 w-4 text-orange-500" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-green-500" />;
      case 'team':
        return <Users className="h-4 w-4 text-violet-500" />;
      case 'notification':
        return <Bell className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <p>Loading activities...</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No recent activities found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 border-b pb-4 last:border-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user_avatar || ''} alt={activity.user_name} />
            <AvatarFallback>{activity.user_name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getActivityIcon(activity.type)}
              <p className="text-sm font-medium">{activity.user_name}</p>
              <p className="text-xs text-muted-foreground">{formatDate(activity.created_at)}</p>
            </div>
            <p className="text-sm">{activity.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
