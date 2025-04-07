
import React from 'react';
import { Client } from '@/pages/Clients';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, CalendarDays, DollarSign, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ClientGridProps {
  clients: Client[];
}

const ClientGrid: React.FC<ClientGridProps> = ({ clients }) => {
  const getStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'active':
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case 'inactive':
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case 'lead':
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "";
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <Card key={client.id} className="overflow-hidden">
          <CardHeader className="p-0">
            <div className="h-20 bg-gradient-to-r from-primary/80 to-primary relative">
              <div className="absolute -bottom-10 left-4">
                <Avatar className="h-20 w-20 border-4 border-background">
                  {client.logo ? (
                    <AvatarImage src={client.logo} alt={client.company} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {client.company.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="absolute top-4 right-4">
                <Badge 
                  variant="secondary" 
                  className={getStatusColor(client.status)}
                >
                  {client.status === 'active' ? 'Active' : 
                   client.status === 'inactive' ? 'Inactive' : 'Lead'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-12 px-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{client.company}</h3>
                <p className="text-sm text-muted-foreground">{client.contactPerson}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Edit Client</DropdownMenuItem>
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Create Invoice</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="grid grid-cols-1 gap-3 mt-4">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-start text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                <span className="line-clamp-2">{client.address}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-4">
              {client.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t p-4 flex justify-between">
            <div className="flex items-center text-sm">
              <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Last active: {formatDate(client.lastActivity)}</span>
            </div>
            <div className="flex items-center text-sm font-medium">
              {client.status === 'lead' ? (
                <span className="text-muted-foreground">Prospect</span>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                  <span>{formatCurrency(client.totalRevenue)}</span>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ClientGrid;
