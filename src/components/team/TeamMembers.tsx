// src/components/team/TeamMembers.tsx
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'busy';
  role: string;
}

interface TeamMembersProps {
  members: TeamMember[];
}

const TeamMembers: React.FC<TeamMembersProps> = ({ members }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <div key={member.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              {member.avatarUrl ? (
                <img src={member.avatarUrl} alt={member.name} className="rounded-full" />
              ) : (
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">{member.email}</p>
              <div className="mt-1">
                <Badge variant="secondary">{member.role}</Badge>
              </div>
            </div>
          </div>
          <div className="mt-2">
            Status: 
            <span className={`ml-1 font-medium ${
              member.status === 'online' ? 'text-green-500' :
              member.status === 'offline' ? 'text-gray-500' :
              member.status === 'busy' ? 'text-orange-500' :
              'text-gray-500'
            }`}>
              {member.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamMembers;
