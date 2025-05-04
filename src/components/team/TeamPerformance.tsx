
import React, { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { teamApi, TeamPerformance as TeamPerformanceType } from '@/services/team-api';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/services/api';

const TeamPerformance: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamPerformanceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTeamPerformance = async () => {
      try {
        setLoading(true);
        const response = await teamApi.getPerformance('current-month');
        setTeamMembers(response?.data || []);
      } catch (error) {
        handleError(error);
        toast({
          title: "Error loading team performance",
          description: "Failed to load team performance data. Please try again.",
          variant: "destructive"
        });
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamPerformance();
  }, [toast]);

  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="h-4 w-4 text-muted" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-muted" />);
      }
    }
    return <div className="flex">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <p>Loading team performance data...</p>
      </div>
    );
  }

  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No team performance data available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {teamMembers.map((member) => (
        <div key={member.id} className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="" alt={member.member_name || 'Team member'} />
              <AvatarFallback>{(member.member_name || 'TM').slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{member.member_name || 'Unnamed member'}</p>
              <p className="text-xs text-muted-foreground">Completed: {member.completed_tasks || 0}/{member.total_tasks || 0}</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">{member.average_rating?.toFixed(1) || '0.0'}</span>
            {renderStars(member.average_rating || 0)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamPerformance;
