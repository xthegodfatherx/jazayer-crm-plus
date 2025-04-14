
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Download, Clock, Filter, Search } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { usePermissions } from '@/contexts/PermissionsContext';

// Sample time tracking entry type
interface TimeEntry {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  task: string;
  project: string;
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  date: string;
  status: 'approved' | 'pending' | 'rejected';
}

const AdminTimeTracking = () => {
  const { hasPermission } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Sample data
  const timeEntries: TimeEntry[] = [
    {
      id: '1',
      user: { name: 'Ahmed Khalifi' },
      task: 'Design new homepage',
      project: 'Client Website Redesign',
      startTime: '09:00',
      endTime: '11:00',
      duration: 7200, // 2 hours
      date: '2025-04-10',
      status: 'approved'
    },
    {
      id: '2',
      user: { name: 'Leila Benzema' },
      task: 'Fix mobile responsive issues',
      project: 'Client Website Redesign',
      startTime: '10:30',
      endTime: '12:30',
      duration: 7200, // 2 hours
      date: '2025-04-10',
      status: 'approved'
    },
    {
      id: '3',
      user: { name: 'Karim Mansouri' },
      task: 'Implement API authentication',
      project: 'API Development',
      startTime: '13:00',
      endTime: '15:30',
      duration: 9000, // 2.5 hours
      date: '2025-04-10',
      status: 'pending'
    },
    {
      id: '4',
      user: { name: 'Selma Bouaziz' },
      task: 'Debug payment integration',
      project: 'E-commerce Platform',
      startTime: '14:00',
      endTime: '17:00',
      duration: 10800, // 3 hours
      date: '2025-04-10',
      status: 'pending'
    },
    {
      id: '5',
      user: { name: 'Ahmed Khalifi' },
      task: 'Client meeting',
      project: 'Client Website Redesign',
      startTime: '11:30',
      endTime: '12:30',
      duration: 3600, // 1 hour
      date: '2025-04-10',
      status: 'rejected'
    },
  ];
  
  // Filter time entries
  const filteredEntries = timeEntries.filter(entry => {
    // Search query
    const matchesSearch = 
      entry.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.project.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Project filter
    const matchesProject = filterProject === 'all' || entry.project === filterProject;
    
    // User filter
    const matchesUser = filterUser === 'all' || entry.user.name === filterUser;
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    
    return matchesSearch && matchesProject && matchesUser && matchesStatus;
  });
  
  // Get unique projects for filtering
  const projects = Array.from(new Set(timeEntries.map(entry => entry.project)));
  
  // Get unique users for filtering
  const users = Array.from(new Set(timeEntries.map(entry => entry.user.name)));
  
  // Format duration from seconds to hours and minutes
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  
  // Handle status change
  const handleStatusChange = (entryId: string, newStatus: 'approved' | 'pending' | 'rejected') => {
    console.log(`Changing entry ${entryId} status to ${newStatus}`);
    // In a real app, this would update the status through an API
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'pending': return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'rejected': return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Time Tracking Overview</CardTitle>
            <CardDescription>Manage and approve time entries submitted by team members</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Select Date Range
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search time entries..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={filterProject} onValueChange={setFilterProject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project} value={project}>{project}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map(user => (
                  <SelectItem key={user} value={user}>{user}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox id="select-all" />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                {hasPermission('view-time-logs') && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <Checkbox id={`select-${entry.id}`} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{entry.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{entry.user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{entry.task}</TableCell>
                  <TableCell>{entry.project}</TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.startTime} - {entry.endTime}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {formatDuration(entry.duration)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(entry.status)}>
                      {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </span>
                  </TableCell>
                  {hasPermission('view-time-logs') && (
                    <TableCell className="text-right">
                      <Select value={entry.status} onValueChange={(value) => handleStatusChange(entry.id, value as any)}>
                        <SelectTrigger className="h-8 w-[130px]">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approved">Approve</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="rejected">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {filteredEntries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No time entries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminTimeTracking;
