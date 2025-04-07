
import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  Star, 
  User, 
  FileText, 
  MessageSquare,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: number;
  user: string;
  action: string;
  subject: string;
  time: string;
  type: 'task' | 'client' | 'invoice' | 'comment' | 'rating' | 'payment';
}

const RecentActivity: React.FC = () => {
  const activities: Activity[] = [
    { 
      id: 1, 
      user: 'Ahmed Khalifi', 
      action: 'completed', 
      subject: 'Website Redesign Homepage', 
      time: '10 minutes ago', 
      type: 'task' 
    },
    { 
      id: 2, 
      user: 'Selma Bouaziz', 
      action: 'added a new', 
      subject: 'client: Mobilis Algeria', 
      time: '2 hours ago', 
      type: 'client' 
    },
    { 
      id: 3, 
      user: 'Karim Mansouri', 
      action: 'rated with 5 stars', 
      subject: 'API Integration Task', 
      time: '4 hours ago', 
      type: 'rating' 
    },
    { 
      id: 4, 
      user: 'Leila Benzema', 
      action: 'commented on', 
      subject: 'Mobile App Design Project', 
      time: 'yesterday', 
      type: 'comment' 
    },
    { 
      id: 5, 
      user: 'Mohammed Ali', 
      action: 'created an invoice for', 
      subject: 'Djezzy Ecommerce Platform', 
      time: 'yesterday', 
      type: 'invoice' 
    },
    { 
      id: 6, 
      user: 'Amina Kader', 
      action: 'processed a payment from', 
      subject: 'Air Algérie', 
      time: '3 days ago', 
      type: 'payment' 
    },
  ];

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'task':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'client':
        return <User className="h-5 w-5 text-blue-500" />;
      case 'invoice':
        return <FileText className="h-5 w-5 text-purple-500" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-amber-500" />;
      case 'rating':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-emerald-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="divide-y">
      {activities.map((activity) => (
        <div key={activity.id} className="py-4 flex items-start">
          <div className="mr-4 mt-0.5">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user}</span>{' '}
              <span className="text-muted-foreground">{activity.action}</span>{' '}
              <span className="font-medium">{activity.subject}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
