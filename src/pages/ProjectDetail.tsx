
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Project } from './Projects';
import { Task } from './Tasks';
import {
  Clock,
  Calendar,
  Users,
  Folder,
  CheckSquare,
  ArrowLeft,
  BarChart2,
  Timer,
} from 'lucide-react';
import TaskTimer from '@/components/tasks/TaskTimer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [activeTimer, setActiveTimer] = useState<Task | null>(null);

  // Mock data - in a real app, this would come from an API
  const allProjects: Project[] = [
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
  ];

  const allTasks: Task[] = [
    {
      id: '1',
      title: 'Design new homepage',
      description: 'Create a modern homepage design for the client website',
      assignee: 'Ahmed Khalifi',
      dueDate: '2025-04-15',
      status: 'in-progress',
      priority: 'high',
      rating: 4,
      tags: ['Design', 'Website', 'Sonatrach Web Application'],
      subtasks: [
        { id: '1-1', title: 'Create wireframes', completed: true },
        { id: '1-2', title: 'Design mockups', completed: false },
        { id: '1-3', title: 'Get client approval', completed: false },
      ]
    },
    {
      id: '2',
      title: 'Implement API authentication',
      description: 'Add JWT authentication to the REST API',
      assignee: 'Leila Benzema',
      dueDate: '2025-04-20',
      status: 'todo',
      priority: 'medium',
      tags: ['Backend', 'Security', 'Djezzy Mobile App'],
    },
    {
      id: '3',
      title: 'Fix mobile responsive issues',
      description: 'Address the layout problems on small screens',
      assignee: 'Selma Bouaziz',
      dueDate: '2025-04-10',
      status: 'in-review',
      priority: 'high',
      rating: 3,
      tags: ['Frontend', 'Mobile', 'Sonatrach Web Application'],
    },
  ];

  const teamMembers = [
    { name: 'Ahmed Khalifi', role: 'UI/UX Designer', hoursLogged: 68, tasksCompleted: 12 },
    { name: 'Selma Bouaziz', role: 'Frontend Developer', hoursLogged: 43, tasksCompleted: 8 },
    { name: 'Karim Mansouri', role: 'Project Manager', hoursLogged: 32, tasksCompleted: 4 },
    { name: 'Leila Benzema', role: 'Backend Developer', hoursLogged: 56, tasksCompleted: 10 },
    { name: 'Mohammed Ali', role: 'QA Engineer', hoursLogged: 24, tasksCompleted: 6 },
  ];

  useEffect(() => {
    // In a real app, this would be an API call
    const projectData = allProjects.find(p => p.id === id);
    if (projectData) {
      setProject(projectData);
      
      // Filter tasks for this project
      const tasks = allTasks.filter(task => 
        task.tags.some(tag => tag === projectData.name)
      );
      setProjectTasks(tasks);
    }
  }, [id]);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-medium">Project not found</h2>
          <p className="text-muted-foreground mt-2">The project you're looking for doesn't exist</p>
          <Button className="mt-4" onClick={() => navigate('/projects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const startTimerForTask = (task: Task) => {
    setActiveTimer(task);
  };

  const handleSaveTime = (taskId: string, seconds: number) => {
    // In a real app, this would save to a database
    console.log(`Saved time for task ${taskId}: ${seconds} seconds`);
    setActiveTimer(null);
  };

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
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/projects')} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{project.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline">{project.client}</Badge>
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(project.status)}`} />
                  <span className="text-sm capitalize">{project.status}</span>
                </div>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Budget</div>
                <div className="text-2xl font-bold">{project.budget.toLocaleString()} DZD</div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Start Date</span>
                  <span className="font-medium">{new Date(project.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  <span className="font-medium">{new Date(project.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Tasks</span>
                  <span className="font-medium">{project.completedTasks}/{project.tasks}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Hours Logged</span>
                  <span className="font-medium">{project.totalHours} hrs</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team Members</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              {project.teamMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback>{member.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member}</p>
                      <p className="text-sm text-muted-foreground">
                        {teamMembers.find(m => m.name === member)?.role || 'Team Member'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">
            <CheckSquare className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="timeTracking">
            <Clock className="h-4 w-4 mr-2" />
            Time Tracking
          </TabsTrigger>
          <TabsTrigger value="performance">
            <BarChart2 className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectTasks.length > 0 ? (
                  projectTasks.map(task => (
                    <Card key={task.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-4 border-l-4 border-primary flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{task.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-2">
                              <span className="flex items-center mr-3">
                                <Users className="h-3 w-3 mr-1" />
                                {task.assignee}
                              </span>
                              <span className="flex items-center mr-3">
                                <Calendar className="h-3 w-3 mr-1" />
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                              <Badge variant="outline" className="text-xs capitalize">
                                {task.status.replace('-', ' ')}
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => startTimerForTask(task)}
                          >
                            <Timer className="h-4 w-4 mr-2" />
                            Track Time
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                    <h3 className="mt-4 font-medium">No tasks found</h3>
                    <p className="text-sm text-muted-foreground mt-1">This project doesn't have any tasks yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeTracking" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Time Tracking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Member</TableHead>
                    <TableHead>Hours Logged</TableHead>
                    <TableHead>Tasks Completed</TableHead>
                    <TableHead>Avg Hours/Task</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.filter(m => project.teamMembers.includes(m.name)).map((member, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.hoursLogged}</TableCell>
                      <TableCell>{member.tasksCompleted}</TableCell>
                      <TableCell>{(member.hoursLogged / (member.tasksCompleted || 1)).toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Task Completion Rate</h3>
                  <Progress value={(project.completedTasks / project.tasks) * 100} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {project.completedTasks} of {project.tasks} tasks completed ({((project.completedTasks / project.tasks) * 100).toFixed(0)}%)
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Budget Utilization</h3>
                  <Progress value={65} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    65% of the budget has been utilized
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Timeline Progress</h3>
                  <Progress value={45} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    45% of the project timeline has elapsed
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <h3 className="text-3xl font-bold">{project.totalHours}</h3>
                      <p className="text-sm text-muted-foreground">Total Hours Spent</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <h3 className="text-3xl font-bold">{project.teamMembers.length}</h3>
                      <p className="text-sm text-muted-foreground">Team Members</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <h3 className="text-3xl font-bold">{(project.totalHours / project.tasks).toFixed(1)}</h3>
                      <p className="text-sm text-muted-foreground">Avg Hours/Task</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {activeTimer && (
        <TaskTimer 
          taskId={activeTimer.id} 
          taskTitle={activeTimer.title} 
          onSaveTime={handleSaveTime}
          assignee={activeTimer.assignee}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
