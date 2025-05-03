
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon, loading = false }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {icon}
        </div>
        
        {loading ? (
          <>
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </>
        ) : (
          <>
            <div className="text-3xl font-bold">{value}</div>
            <div className="flex items-center text-sm">
              {trend === 'up' && (
                <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
              )}
              {trend === 'down' && (
                <ArrowDown className="h-4 w-4 mr-1 text-red-500" />
              )}
              <span className={`${
                trend === 'up' ? 'text-green-500' : 
                trend === 'down' ? 'text-red-500' : 
                'text-muted-foreground'
              }`}>
                {change}
              </span>
              <span className="text-muted-foreground ml-1">from previous period</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
