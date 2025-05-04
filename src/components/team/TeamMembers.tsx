
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TeamMember } from '@/services/team-api';

interface TeamMembersProps {
  members: TeamMember[];
}

const TeamMembers: React.FC<TeamMembersProps> = ({ members }) => {
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <div key={member.id} className="bg-card dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              {member.avatar_url ? (
                <img src={member.avatar_url} alt={member.name} className="rounded-full" />
              ) : (
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
              <p className="text-muted-foreground">{member.email}</p>
              <div className="mt-1">
                <Badge variant="secondary">{member.role}</Badge>
              </div>
            </div>
          </div>
          <div className="mt-2">
            Status: 
            <span className={`ml-1 font-medium inline-flex items-center`}>
              <span className={`h-2 w-2 rounded-full mr-1 ${getStatusColor(member.status)}`}></span>
              {member.status || 'offline'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamMembers;
