
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon }) => {
  return (
    <Card>
      <CardContent className="flex flex-col p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="p-2 rounded-full bg-muted/50">{icon}</div>
        </div>
        <div className="flex items-center mt-4">
          {trend === 'up' ? (
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
          ) : trend === 'down' ? (
            <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
          ) : null}
          <span className={cn(
            "text-xs font-medium",
            trend === 'up' ? 'text-green-500' : 
            trend === 'down' ? 'text-red-500' : 
            'text-muted-foreground'
          )}>
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
