
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search, Folder, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import ProjectList from '@/components/projects/ProjectList';
import ProjectGrid from '@/components/projects/ProjectGrid';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { projectsApi, Project as ApiProject, handleError } from '@/services/api';

export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  startDate: string;
  dueDate: string;
  status: 'pending' | 'active' | 'completed' | 'on-hold';
  progress: number;
  budget: number;
  teamMembers: string[];
  tags: string[];
  tasks: number;
  completedTasks: number;
  totalHours: number;
}

const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data: apiProjects } = await projectsApi.getAll();
        
        // Transform API projects to match our UI format
        // In a real app, we would fetch related data (tasks, team members) in a more efficient way
        const transformedProjects: Project[] = await Promise.all(apiProjects.map(async (apiProject) => {
          // For demonstration, we're making extra API calls to get related data
          // In a real app, this would be optimized or fetched with relationships in the backend
          let clientName = "Unknown Client";
          
          // Check if we have client information
          if (apiProject.client_id) {
            try {
              const clientResponse = await fetch(`http://localhost:8000/api/clients/${apiProject.client_id}`);
              const clientData = await clientResponse.json();
              clientName = clientData.data.name;
            } catch (error) {
              console.error(`Failed to fetch client info for ${apiProject.id}:`, error);
              // Continue with the unknown client name
            }
          }
          
          return {
            id: apiProject.id,
            name: apiProject.name,
            description: apiProject.description || '',
            client: clientName,
            startDate: apiProject.start_date || new Date().toISOString(),
            dueDate: apiProject.end_date || new Date().toISOString(),
            status: apiProject.status,
            progress: apiProject.progress || 0,
            budget: apiProject.budget,
            teamMembers: [], // This would come from a related team members API
            tags: apiProject.tags || [],
            tasks: 0, // This would be fetched from tasks API
            completedTasks: 0, // This would be fetched from tasks API
            totalHours: 0, // This would be calculated from time entries
          };
        }));
        
        setProjects(transformedProjects);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  const handleAddProject = async () => {
    // This would open a dialog to create a new project
    // For now, we'll just log a message
    console.log('Add new project clicked');
  };

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={handleAddProject}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search projects..." 
            className="pl-8" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>This Week</DropdownMenuItem>
              <DropdownMenuItem>This Month</DropdownMenuItem>
              <DropdownMenuItem>Last 3 Months</DropdownMenuItem>
              <DropdownMenuItem>This Year</DropdownMenuItem>
              <DropdownMenuItem>Custom Range</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Folder className="h-5 w-5" />
            <span>{filteredProjects.length} projects found</span>
          </div>
          <Tabs defaultValue="grid">
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {loading ? (
        <Card className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Loading projects...</p>
          </div>
        </Card>
      ) : (
        <Tabs defaultValue="grid">
          <TabsContent value="grid" className="mt-0">
            <ProjectGrid projects={filteredProjects} />
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            <ProjectList projects={filteredProjects} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Projects;
