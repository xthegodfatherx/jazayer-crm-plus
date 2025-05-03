
import React, { useState, useEffect } from 'react';
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
import { Calendar as CalendarIcon, Download, Clock, Filter, Search, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { usePermissions } from '@/contexts/PermissionsContext';
import { timeEntriesApi, TimeEntry } from '@/services/time-entries-api';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/services/api';

const AdminTimeTracking = () => {
  const { hasPermission } = usePermissions();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<{id: string, name: string}[]>([]);
  const [projects, setProjects] = useState<{id: string, name: string}[]>([]);
  const { toast } = useToast();
  
  // Fetch time entries
  useEffect(() => {
    const fetchTimeEntries = async () => {
      try {
        setLoading(true);
        const { data } = await timeEntriesApi.getAll();
        setTimeEntries(data);
        
        // Extract unique users and projects for filtering
        const userMap = new Map();
        const projectMap = new Map();
        
        data.forEach(entry => {
          if (entry.user && entry.user.id) {
            userMap.set(entry.user.id, entry.user.name);
          }
          if (entry.project && entry.project.id) {
            projectMap.set(entry.project.id, entry.project.name);
          }
        });
        
        setUsers(Array.from(userMap.entries()).map(([id, name]) => ({ id, name })));
        setProjects(Array.from(projectMap.entries()).map(([id, name]) => ({ id, name })));
      } catch (error) {
        handleError(error);
        toast({
          title: "Error loading time entries",
          description: "Failed to load time tracking data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimeEntries();
  }, [toast]);
  
  // Filter time entries
  const filteredEntries = timeEntries.filter(entry => {
    // Search query
    const matchesSearch = 
      (entry.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.task?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.project?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    // Project filter
    const matchesProject = filterProject === 'all' || entry.project?.id === filterProject;
    
    // User filter
    const matchesUser = filterUser === 'all' || entry.user?.id === filterUser;
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    
    return matchesSearch && matchesProject && matchesUser && matchesStatus;
  });
  
  // Format duration from seconds to hours and minutes
  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return '0h 0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  
  // Handle status change
  const handleStatusChange = async (entryId: string, newStatus: 'approved' | 'pending' | 'rejected') => {
    try {
      setLoading(true);
      if (newStatus === 'approved') {
        await timeEntriesApi.approve(entryId);
      } else if (newStatus === 'rejected') {
        await timeEntriesApi.reject(entryId, 'Rejected by admin');
      } else {
        // Update to pending status
        await timeEntriesApi.update(entryId, { status: newStatus });
      }
      
      // Refresh the time entries
      const { data } = await timeEntriesApi.getAll();
      setTimeEntries(data);
      
      toast({
        title: "Status updated",
        description: `Time entry status updated to ${newStatus}`,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'pending': return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'rejected': return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default: return '';
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Format time
  const formatTime = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
              <CalendarIcon className="h-4 w-4 mr-2" />
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
        {loading ? (
          <div className="flex justify-center items-center p-16">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            <p>Loading time entries...</p>
          </div>
        ) : (
          <>
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
                      <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
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
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
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
                  {filteredEntries.length > 0 ? (
                    filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <Checkbox id={`select-${entry.id}`} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{entry.user?.name?.charAt(0) || '?'}</AvatarFallback>
                            </Avatar>
                            <span>{entry.user?.name || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell>{entry.task?.title || 'N/A'}</TableCell>
                        <TableCell>{entry.project?.name || 'N/A'}</TableCell>
                        <TableCell>{formatDate(entry.start_time)}</TableCell>
                        <TableCell>
                          {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                        </TableCell>
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
                            <Select
                              value={entry.status}
                              onValueChange={(value) => handleStatusChange(entry.id, value as any)}
                            >
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        No time entries found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminTimeTracking;
