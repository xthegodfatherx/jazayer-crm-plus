
import React, { useState } from 'react';
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

  const projects: Project[] = [
    {
      id: '1',
      name: 'Sonatrach Web Application',
      description: 'Corporate website redesign for Sonatrach with modern UI/UX',
      client: 'Sonatrach',
      startDate: '2025-03-01',
      dueDate: '2025-05-15',
      status: 'active',
      progress: 65,
      budget: 120000,
      teamMembers: ['Ahmed Khalifi', 'Selma Bouaziz', 'Karim Mansouri'],
      tags: ['Web Development', 'UI/UX', 'Corporate'],
      tasks: 24,
      completedTasks: 16,
      totalHours: 187,
    },
    {
      id: '2',
      name: 'Djezzy Mobile App',
      description: 'Customer service mobile application for Djezzy subscribers',
      client: 'Djezzy',
      startDate: '2025-02-15',
      dueDate: '2025-06-30',
      status: 'active',
      progress: 40,
      budget: 180000,
      teamMembers: ['Leila Benzema', 'Ahmed Khalifi', 'Mohammed Ali'],
      tags: ['Mobile App', 'Android', 'iOS'],
      tasks: 32,
      completedTasks: 12,
      totalHours: 145,
    },
    {
      id: '3',
      name: 'Air Algérie Booking System',
      description: 'Flight booking and management system for Air Algérie',
      client: 'Air Algérie',
      startDate: '2025-01-10',
      dueDate: '2025-04-20',
      status: 'completed',
      progress: 100,
      budget: 90000,
      teamMembers: ['Karim Mansouri', 'Selma Bouaziz'],
      tags: ['Web Development', 'Booking System'],
      tasks: 18,
      completedTasks: 18,
      totalHours: 210,
    },
    {
      id: '4',
      name: 'Ooredoo Data Analytics Dashboard',
      description: 'Internal analytics dashboard for marketing department',
      client: 'Ooredoo Algérie',
      startDate: '2025-03-20',
      dueDate: '2025-05-30',
      status: 'active',
      progress: 25,
      budget: 75000,
      teamMembers: ['Leila Benzema', 'Mohammed Ali'],
      tags: ['Data Analytics', 'Dashboard', 'Marketing'],
      tasks: 20,
      completedTasks: 5,
      totalHours: 68,
    },
    {
      id: '5',
      name: 'Cevital E-commerce Platform',
      description: 'Online store for Cevital food products',
      client: 'Cevital',
      startDate: '2025-04-01',
      dueDate: '2025-07-30',
      status: 'pending',
      progress: 5,
      budget: 150000,
      teamMembers: ['Ahmed Khalifi', 'Karim Mansouri', 'Selma Bouaziz'],
      tags: ['E-commerce', 'Web Development'],
      tasks: 28,
      completedTasks: 1,
      totalHours: 24,
    },
    {
      id: '6',
      name: 'Mobilis Internal CRM',
      description: 'Customer relationship management system for sales team',
      client: 'Mobilis',
      startDate: '2025-02-01',
      dueDate: '2025-04-10',
      status: 'on-hold',
      progress: 60,
      budget: 65000,
      teamMembers: ['Mohammed Ali', 'Leila Benzema'],
      tags: ['CRM', 'Web Application'],
      tasks: 15,
      completedTasks: 9,
      totalHours: 112,
    },
  ];

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button>
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

      <Tabs defaultValue="grid">
        <TabsContent value="grid" className="mt-0">
          <ProjectGrid projects={filteredProjects} />
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <ProjectList projects={filteredProjects} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projects;
