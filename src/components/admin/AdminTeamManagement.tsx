
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { 
  MoreVertical, 
  PlusCircle, 
  Loader2, 
  Search,
  Edit,
  Trash2,
  UserCheck
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { handleError, teamApi, TeamMember } from '@/services/api';

const AdminTeamManagement: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await teamApi.getTeamMembers();
        setTeamMembers(response?.data || []);
      } catch (error) {
        handleError(error);
        toast({
          variant: "destructive",
          title: "Failed to load team members",
          description: "Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [toast]);

  const filteredTeamMembers = teamMembers.filter(member => 
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Team Management</CardTitle>
            <CardDescription>Add, edit, or remove team members</CardDescription>
          </div>
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No team members found. Add team members to get started.
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeamMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No results found.</TableCell>
                  </TableRow>
                ) : (
                  filteredTeamMembers.map(member => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>{member.name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          {member.name || "Unnamed"}
                        </div>
                      </TableCell>
                      <TableCell>{member.email || "No email"}</TableCell>
                      <TableCell>{member.role || "Member"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Manage Role
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminTeamManagement;
