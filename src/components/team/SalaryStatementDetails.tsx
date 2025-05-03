
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TeamMember, TeamPerformance } from '@/services/team-api';
import { formatCurrency } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface SalaryStatementDetailsProps {
  member: TeamMember;
  performance: TeamPerformance;
  period: string;
}

const SalaryStatementDetails: React.FC<SalaryStatementDetailsProps> = ({ 
  member, 
  performance,
  period 
}) => {
  // Format date based on period
  const getStatementDate = () => {
    const now = new Date();
    
    switch (period) {
      case 'current-week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
        
      case 'current-month':
        return new Date(now.getFullYear(), now.getMonth(), 1)
          .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
      case 'last-quarter':
        const quarterStart = new Date(now);
        quarterStart.setMonth(now.getMonth() - 3);
        return `${quarterStart.toLocaleDateString()} - ${now.toLocaleDateString()}`;
        
      case 'current-year':
        return now.getFullYear().toString();
        
      default:
        return new Date().toLocaleDateString();
    }
  };
  
  // Calculate the various components of the salary
  const baseSalary = member.base_salary || 0;
  const hourlyEarnings = (performance?.total_hours || 0) * (member.hourly_rate || 0);
  const taskBonus = performance?.completed_tasks ? 
    (performance.completed_tasks * 50 * (performance.average_rating || 1)) : 0;
  const totalSalary = performance?.calculated_salary || (baseSalary + hourlyEarnings + taskBonus);
  
  return (
    <div className="space-y-6 print:text-black">
      <div className="border rounded-lg p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <Avatar className="h-12 w-12 mr-3">
              <AvatarImage src={member.avatar || ''} alt={member.name} />
              <AvatarFallback>{member.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Statement Period</p>
            <p className="text-sm text-muted-foreground">{getStatementDate()}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Base Salary</p>
              <p className="text-xl font-semibold">{formatCurrency(baseSalary)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Hours Logged</p>
              <p className="text-xl font-semibold">{performance?.total_hours || 0} hrs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
              <p className="text-xl font-semibold">{performance?.completed_tasks || 0}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="border rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-3">Earnings Breakdown</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Base Salary</TableCell>
                <TableCell>Monthly</TableCell>
                <TableCell>1</TableCell>
                <TableCell className="text-right">{formatCurrency(baseSalary)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Hourly Work</TableCell>
                <TableCell>{formatCurrency(member.hourly_rate || 0)}/hr</TableCell>
                <TableCell>{performance?.total_hours || 0} hrs</TableCell>
                <TableCell className="text-right">{formatCurrency(hourlyEarnings)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Task Completion Bonus</TableCell>
                <TableCell>Based on rating: {performance?.average_rating?.toFixed(1) || 0}</TableCell>
                <TableCell>{performance?.completed_tasks || 0} tasks</TableCell>
                <TableCell className="text-right">{formatCurrency(taskBonus)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="font-semibold">Total Earnings</TableCell>
                <TableCell className="text-right font-semibold">{formatCurrency(totalSalary)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-8 pt-4 border-t text-center print:mt-16">
          <div className="max-w-xs mx-auto">
            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground">Art Director Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryStatementDetails;
