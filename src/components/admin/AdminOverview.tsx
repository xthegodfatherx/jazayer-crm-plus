import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CircleDollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { Task } from '@/types/task';
import { tasksApi } from '@/services/tasks-api';
import { useToast } from '@/hooks/use-toast';
import { teamApi } from '@/services/team-api';
import { Progress } from '@/components/ui/progress';

interface AdminOverviewProps {
  className?: string;
}

const AdminOverview: React.FC<AdminOverviewProps> = ({ className }) => {
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [teamSize, setTeamSize] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch tasks and team data in parallel
        const [tasksData, teamData] = await Promise.all([
          tasksApi.getAll(),
          teamApi.getAll()
        ]);

        // Calculate task statistics
        const total = tasksData.data.length;
        const completed = tasksData.data.filter(task => task.status === 'done').length;
        setTotalTasks(total);
        setCompletedTasks(completed);

        // Calculate team size
        setTeamSize(teamData.data.length);

        // Calculate average team rating
        const totalRating = teamData.data.reduce((sum, member) => sum + (member.average_rating || 0), 0);
        const avgRating = teamSize > 0 ? totalRating / teamSize : 0;
        setAverageRating(parseFloat(avgRating.toFixed(1)));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load admin overview data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Total Tasks</CardTitle>
            <CardDescription>All tasks in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? 'Loading...' : totalTasks}</div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span>{loading ? 'Loading...' : `${(completedTasks / totalTasks * 100).toFixed(1)}% Completed`}</span>
            </div>
            {loading ? (
              <Progress value={0} className="mt-2" />
            ) : (
              <Progress value={(completedTasks / totalTasks * 100)} className="mt-2" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Completed Tasks</CardTitle>
            <CardDescription>Tasks marked as done</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? 'Loading...' : completedTasks}</div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <CheckSquare className="h-4 w-4 mr-2" />
              <span>{loading ? 'Loading...' : 'View completed tasks'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Team Size</CardTitle>
            <CardDescription>Number of active team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? 'Loading...' : teamSize}</div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <Users className="h-4 w-4 mr-2" />
              <span>{loading ? 'Loading...' : 'Manage team members'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Average Team Rating</CardTitle>
            <CardDescription>Average rating of all team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? 'Loading...' : averageRating}</div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <Star className="h-4 w-4 mr-2" />
              <span>{loading ? 'Loading...' : 'View team performance'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
