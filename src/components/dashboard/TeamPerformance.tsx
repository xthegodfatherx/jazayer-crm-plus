
import React from 'react';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
}

const TeamPerformance: React.FC = () => {
  const teamMembers: TeamMember[] = [
    { id: 1, name: 'Ahmed Khalifi', role: 'UI Designer', avatar: '', rating: 4.8 },
    { id: 2, name: 'Selma Bouaziz', role: 'Frontend Developer', avatar: '', rating: 4.5 },
    { id: 3, name: 'Karim Mansouri', role: 'Project Manager', avatar: '', rating: 4.2 },
    { id: 4, name: 'Leila Benzema', role: 'Backend Developer', avatar: '', rating: 3.9 },
  ];

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

  return (
    <div className="space-y-4">
      {teamMembers.map((member) => (
        <div key={member.id} className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">{member.rating}</span>
            {renderStars(member.rating)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamPerformance;
