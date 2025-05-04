
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TeamMembers from '@/components/team/TeamMembers';
import TeamPerformance from '@/components/team/TeamPerformance';
import SalaryCalculator from '@/components/team/SalaryCalculator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { teamApi } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { TeamMember } from '@/services/team-api';

const Team = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTeamMembers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await teamApi.getMembers();
        setMembers(response.data);
        if (response.data.length > 0 && !selectedMemberId) {
          setSelectedMemberId(response.data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch team members:', err);
        setError('Failed to load team members. Please try again later.');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch team members data'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-md" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Team</h1>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="salary">Salary Calculator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <TeamMembers members={members} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <TeamPerformance />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="salary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Salary Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMemberId && (
                <SalaryCalculator memberId={selectedMemberId} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Team;
