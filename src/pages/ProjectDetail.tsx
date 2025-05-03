import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, FileText, Users, Briefcase } from 'lucide-react';
import { Task } from '@/types/task';
import TaskList from '@/components/tasks/TaskList';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<{ id: string; name: string; description: string } | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Mock project data
    const mockProject = {
      id: projectId,
      name: `Project ${projectId}`,
      description: 'A detailed description of the project goes here.'
    };
    setProject(mockProject);

    // Mock task data
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Design Landing Page',
        description: 'Create a visually appealing landing page design.',
        status: 'todo',
        priority: 'high',
        dueDate: '2024-08-15',
        assigned_to: 'John Doe',
        tags: ['design', 'ui'],
        comments: [],
        subtasks: [],
        assignee: 'John Doe',
      },
      {
        id: '2',
        title: 'Develop API Endpoints',
        description: 'Implement the necessary API endpoints for data retrieval.',
        status: 'in_progress',
        priority: 'medium',
        dueDate: '2024-08-22',
        assigned_to: 'Jane Smith',
        tags: ['backend', 'api'],
        comments: [],
        subtasks: [],
        assignee: 'Jane Smith',
      },
      {
        id: '3',
        title: 'Write Documentation',
        description: 'Document all the implemented features and APIs.',
        status: 'done',
        priority: 'low',
        dueDate: '2024-08-29',
        assigned_to: 'Alice Johnson',
        tags: ['documentation'],
        comments: [],
        subtasks: [],
        assignee: 'Alice Johnson',
      },
    ];
    setTasks(mockTasks);
    setLoading(false);
  }, [projectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <Button>
          <Briefcase className="h-4 w-4 mr-2" />
          View Project Details
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-center">12</div>
                <p className="text-center text-sm text-muted-foreground mt-2">Total Tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-center">7</div>
                <p className="text-center text-sm text-muted-foreground mt-2">Completed Tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-center">5</div>
                <p className="text-center text-sm text-muted-foreground mt-2">Pending Tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-center">4.5</div>
                <p className="text-center text-sm text-muted-foreground mt-2">Average Task Rating</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="tasks">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>List of tasks for this project</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList tasks={tasks} onRateTask={() => {}} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>Project team members and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-xl font-bold">John Doe</div>
                    <p className="text-sm text-muted-foreground mt-2">Project Manager</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-xl font-bold">Jane Smith</div>
                    <p className="text-sm text-muted-foreground mt-2">Software Developer</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-xl font-bold">Alice Johnson</div>
                    <p className="text-sm text-muted-foreground mt-2">Technical Writer</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
