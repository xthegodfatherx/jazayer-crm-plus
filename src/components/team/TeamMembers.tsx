
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  ChevronUp, 
  ChevronDown,
  Edit,
  Trash,
  Mail,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import StarRating from '@/components/tasks/StarRating';
import { teamApi, TeamMember } from '@/services/team-api';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/services/api';

const TeamMembers: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const { data } = await teamApi.getMembers();
        setMembers(data);
      } catch (error) {
        handleError(error);
        toast({
          title: "Error loading team members",
          description: "Failed to load team members data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [toast]);

  const getStatusBadge = (status: TeamMember['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      case 'vacation':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Vacation</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p>Loading team members...</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Name</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Tasks</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              No team members found
            </TableCell>
          </TableRow>
        ) : (
          members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={member.avatar || ''} alt={member.name} />
                    <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{member.department}</TableCell>
              <TableCell>{getStatusBadge(member.status)}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <StarRating rating={member.rating} readOnly size="sm" />
                  <span className="ml-2 text-sm">{member.rating}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="text-green-600 flex items-center mr-3">
                    <ChevronUp className="h-4 w-4 mr-1" />
                    {member.tasks_completed}
                  </span>
                  <span className="text-amber-600 flex items-center">
                    <ChevronDown className="h-4 w-4 mr-1" />
                    {member.tasks_in_progress}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Contact
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Change Role
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default TeamMembers;
