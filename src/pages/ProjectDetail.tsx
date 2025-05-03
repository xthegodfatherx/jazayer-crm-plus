import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Users, Folder, CheckSquare, ArrowLeft, BarChart2, Timer } from 'lucide-react';
import TaskTimer from '@/components/tasks/TaskTimer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Task } from './Tasks';
import { Project } from '@/services/projects-api';
import { timeEntriesApi, projectsApi, tasksApi, handleError } from '@/services/api';
import { TimeEntryInsert } from '@/services/time-entries-api';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [activeTimer, setActiveTimer] = useState<Task | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error('Project ID is missing');
        }
        
        // Fetch project data from API
        const { data: projectData } = await projectsApi.get(id);
        setProject(projectData);
        
        // Fetch tasks for this project
        const { data: apiTasks } = await tasksApi.getAll({ 
          filters: { project_id: id } 
        });
        
        // Transform API tasks to match our UI format
        const transformedTasks: Task[] = apiTasks.map(apiTask => ({
          id: apiTask.id,
          title: apiTask.title,
          description: apiTask.description || '',
          assignee: apiTask.assigned_to || 'Unassigned',
          dueDate: apiTask.due_date || new Date().toISOString(),
          status: apiTask.status as Task['status'],
          priority: apiTask.priority,
          rating: apiTask.rating,
          tags: apiTask.tags || [],
          timeTracked: 0, // This would come from time entries in a real app
          project: projectData.name,
        }));
        
        setProjectTasks(transformedTasks);
        
        // In a real app, you'd fetch team members from a team members API
        // For now, we'll use mock data
        setTeamMembers([
          { name: 'Ahmed Khalifi', role: 'UI/UX Designer', hoursLogged: 68, tasksCompleted: 12 },
          { name: 'Selma Bouaziz', role: 'Frontend Developer', hoursLogged: 43, tasksCompleted: 8 },
          { name: 'Karim Mansouri', role: 'Project Manager', hoursLogged: 32, tasksCompleted: 4 },
          { name: 'Leila Benzema', role: 'Backend Developer', hoursLogged: 56, tasksCompleted: 10 },
          { name: 'Mohammed Ali', role: 'QA Engineer', hoursLogged: 24, tasksCompleted: 6 },
        ]);
        
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading project data...</p>
        </div>
      </div>
    );
  }

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

  const handleSaveTime = async (taskId: string, seconds: number) => {
    try {
      const task = projectTasks.find(t => t.id === taskId);
      if (!task) return;
      
      // Create time entry via API with corrected types
      const timeEntryData: TimeEntryInsert = {
        task_id: taskId,
        project_id: id || null,
        start_time: new Date(Date.now() - seconds * 1000).toISOString(),
        end_time: new Date().toISOString(),
        duration: seconds,
        description: `Time entry for task: ${task.title}`,
        billable: true,
        user_id: null // This would be the current user's ID in a real app
      };
      
      await timeEntriesApi.create(timeEntryData);
      
      // Update local state
      setProjectTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, timeTracked: (task.timeTracked || 0) + seconds } 
          : task
      ));
      
      setActiveTimer(null);
    } catch (error) {
      handleError(error);
    }
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
                  {project.client_id && <Badge variant="outline">{project.client_id}</Badge>}
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(project.status)}`} />
                  <span className="text-sm capitalize">{project.status}</span>
                </div>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Budget</div>
                <div className="text-2xl font-bold">{project.budget.toLocaleString()} {project.currency}</div>
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
                  <span className="font-medium">{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  <span className="font-medium">{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Tasks</span>
                  <span className="font-medium">{projectTasks.filter(t => t.status === 'done').length}/{projectTasks.length}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Hours Logged</span>
                  <span className="font-medium">{teamMembers.reduce((sum, member) => sum + member.hoursLogged, 0)} hrs</span>
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
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
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
                  {teamMembers.map((member, index) => (
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
                  <Progress 
                    value={projectTasks.length > 0 ? 
                      (projectTasks.filter(t => t.status === 'done').length / projectTasks.length) * 100 : 0
                    } 
                    className="h-2" 
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {projectTasks.filter(t => t.status === 'done').length} of {projectTasks.length} tasks completed 
                    ({projectTasks.length > 0 ? 
                      ((projectTasks.filter(t => t.status === 'done').length / projectTasks.length) * 100).toFixed(0) : 0}%)
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
                      <h3 className="text-3xl font-bold">{teamMembers.reduce((sum, member) => sum + member.hoursLogged, 0)}</h3>
                      <p className="text-sm text-muted-foreground">Total Hours Spent</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <h3 className="text-3xl font-bold">{teamMembers.length}</h3>
                      <p className="text-sm text-muted-foreground">Team Members</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <h3 className="text-3xl font-bold">
                        {projectTasks.length > 0 ? 
                          (teamMembers.reduce((sum, member) => sum + member.hoursLogged, 0) / projectTasks.length).toFixed(1) : "0.0"
                        }
                      </h3>
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
