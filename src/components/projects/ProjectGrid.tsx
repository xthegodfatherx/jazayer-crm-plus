
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project } from '@/pages/Projects';
import { Link } from 'react-router-dom';

interface ProjectGridProps {
  projects: Project[];
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects }) => {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'on-hold': return 'bg-yellow-500';
      case 'pending': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline">{project.client}</Badge>
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(project.status)}`} />
                  <span className="text-xs ml-1 capitalize">{project.status}</span>
                </div>
              </div>
              
              <Link to={`/projects/${project.id}`} className="block">
                <h3 className="font-medium text-lg mb-2 hover:text-primary">{project.name}</h3>
              </Link>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{project.description}</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Due: {new Date(project.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {project.totalHours} hours
                  </div>
                  <div className="flex items-center">
                    <CheckSquare className="h-3 w-3 mr-1" />
                    {project.completedTasks}/{project.tasks} tasks
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {project.teamMembers.length} members
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-muted/30 border-t flex items-center justify-between">
              <div className="flex -space-x-2">
                {project.teamMembers.slice(0, 3).map((member, i) => (
                  <Avatar key={i} className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-xs">{member.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                ))}
                {project.teamMembers.length > 3 && (
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-xs">+{project.teamMembers.length - 3}</AvatarFallback>
                  </Avatar>
                )}
              </div>
              <Link to={`/projects/${project.id}`}>
                <Button size="sm" variant="outline">View Project</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectGrid;
