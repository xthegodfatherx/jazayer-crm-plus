
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, ChevronLeft, ChevronRight, Search, Activity, AlertTriangle, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { AuditLog, settingsApi } from '@/services/settings-api';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const AuditLogs: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const { toast } = useToast();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  
  // Fetch audit logs
  useEffect(() => {
    const fetchAuditLogs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const filters: {
          action?: string;
          entity_type?: string;
          date_from?: string;
          date_to?: string;
        } = {};
        
        if (actionFilter) filters.action = actionFilter;
        if (entityFilter) filters.entity_type = entityFilter;
        if (dateFrom) filters.date_from = format(dateFrom, 'yyyy-MM-dd');
        if (dateTo) filters.date_to = format(dateTo, 'yyyy-MM-dd');
        
        const response = await settingsApi.getAuditLogs(page, limit, filters);
        setAuditLogs(response.data);
        setTotal(response.total);
      } catch (err) {
        console.error('Error fetching audit logs:', err);
        setError('Failed to load audit logs');
        toast({
          title: 'Error',
          description: 'Failed to load audit logs',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuditLogs();
  }, [page, limit, actionFilter, entityFilter, dateFrom, dateTo, toast]);
  
  // Handle search
  const handleSearch = () => {
    setPage(1);
  };
  
  // Clear filters
  const clearFilters = () => {
    setActionFilter('');
    setEntityFilter('');
    setDateFrom(undefined);
    setDateTo(undefined);
    setPage(1);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy-MM-dd HH:mm');
    } catch (error) {
      return dateString;
    }
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(total / limit);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Audit Logs
            </CardTitle>
            <CardDescription>
              Track all system activities and user actions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search audit logs..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Entity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Entities</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="setting">Setting</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[150px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, 'PP') : 'From Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[150px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, 'PP') : 'To Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" onClick={clearFilters}>Clear</Button>
          </div>
        </div>
        
        {/* Error state */}
        {error && (
          <div className="flex items-center justify-center text-red-500 py-8">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Loading state */}
        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        )}
        
        {/* Table */}
        {!loading && !error && (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.length > 0 ? (
                    auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap">{formatDate(log.created_at)}</TableCell>
                        <TableCell>{log.user_name}</TableCell>
                        <TableCell className="capitalize">{log.action}</TableCell>
                        <TableCell className="capitalize">{log.entity_type}</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">{log.details}</div>
                        </TableCell>
                        <TableCell>{log.ip_address}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        No audit logs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {auditLogs.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} entries
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm" disabled>
                    {page} / {totalPages}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogs;
