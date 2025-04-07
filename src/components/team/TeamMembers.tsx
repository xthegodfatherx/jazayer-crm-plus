
import React from 'react';
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
  Star, 
  ChevronUp, 
  ChevronDown,
  Edit,
  Trash,
  Mail,
  ShieldCheck
} from 'lucide-react';
import StarRating from '@/components/tasks/StarRating';

interface TeamMember {
  id: number;
  name: string;
  avatar: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'vacation';
  rating: number;
  tasksCompleted: number;
  tasksInProgress: number;
}

const TeamMembers: React.FC = () => {
  const members: TeamMember[] = [
    {
      id: 1,
      name: 'Ahmed Khalifi',
      avatar: '',
      email: 'ahmed@jazayer-crm.dz',
      role: 'UI Designer',
      department: 'Design',
      status: 'active',
      rating: 4.8,
      tasksCompleted: 24,
      tasksInProgress: 3,
    },
    {
      id: 2,
      name: 'Selma Bouaziz',
      avatar: '',
      email: 'selma@jazayer-crm.dz',
      role: 'Frontend Developer',
      department: 'Development',
      status: 'active',
      rating: 4.5,
      tasksCompleted: 18,
      tasksInProgress: 5,
    },
    {
      id: 3,
      name: 'Karim Mansouri',
      avatar: '',
      email: 'karim@jazayer-crm.dz',
      role: 'Project Manager',
      department: 'Management',
      status: 'active',
      rating: 4.2,
      tasksCompleted: 12,
      tasksInProgress: 2,
    },
    {
      id: 4,
      name: 'Leila Benzema',
      avatar: '',
      email: 'leila@jazayer-crm.dz',
      role: 'Backend Developer',
      department: 'Development',
      status: 'vacation',
      rating: 3.9,
      tasksCompleted: 15,
      tasksInProgress: 0,
    },
    {
      id: 5,
      name: 'Mohammed Ali',
      avatar: '',
      email: 'mohammed@jazayer-crm.dz',
      role: 'Sales Manager',
      department: 'Sales',
      status: 'active',
      rating: 4.0,
      tasksCompleted: 8,
      tasksInProgress: 4,
    },
  ];

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
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={member.avatar} alt={member.name} />
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
                  {member.tasksCompleted}
                </span>
                <span className="text-amber-600 flex items-center">
                  <ChevronDown className="h-4 w-4 mr-1" />
                  {member.tasksInProgress}
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
        ))}
      </TableBody>
    </Table>
  );
};

export default TeamMembers;
