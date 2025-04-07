
import React from 'react';
import { Client } from '@/pages/Clients';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Edit, 
  Trash, 
  FileText, 
  CheckSquare,
  Mail,
  Phone,
  Building
} from 'lucide-react';

interface ClientListProps {
  clients: Client[];
}

const ClientList: React.FC<ClientListProps> = ({ clients }) => {
  const getStatusBadge = (status: Client['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      case 'lead':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Lead</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', { 
      style: 'currency', 
      currency: 'DZD',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-DZ', { dateStyle: 'medium' }).format(date);
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Client</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    {client.logo ? (
                      <AvatarImage src={client.logo} alt={client.company} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {client.company.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">{client.company}</p>
                    <p className="text-sm text-muted-foreground">{client.contactPerson}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    <span>{client.phone}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(client.status)}</TableCell>
              <TableCell>
                {client.status === 'lead' ? (
                  <span className="text-muted-foreground">Prospect</span>
                ) : (
                  formatCurrency(client.totalRevenue)
                )}
              </TableCell>
              <TableCell>{formatDate(client.lastActivity)}</TableCell>
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
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Building className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      Create Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      New Task
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientList;
