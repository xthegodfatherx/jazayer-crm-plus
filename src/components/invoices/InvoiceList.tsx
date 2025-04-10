
import React from 'react';
import { Invoice } from '@/types/invoice';
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
  FileText, 
  Send, 
  Edit, 
  Trash, 
  Download,
  Copy,
  DollarSign
} from 'lucide-react';

interface InvoiceListProps {
  invoices: Invoice[];
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices }) => {
  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      case 'sent':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Sent</Badge>;
      case 'paid':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>;
      case 'overdue':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cancelled</Badge>;
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

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">No invoices found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          There are no invoices matching your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {invoices.map((invoice) => (
        <div key={invoice.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 sm:mb-0">
            <Avatar className="h-10 w-10 hidden sm:flex">
              {invoice.client.logo ? (
                <AvatarImage src={invoice.client.logo} alt={invoice.client.name} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary">
                  {invoice.client.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-medium">{invoice.number}</h3>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-6 text-sm text-muted-foreground">
                <span>{invoice.client.name}</span>
                <span className="hidden sm:block">•</span>
                <span>Due: {formatDate(invoice.dueDate)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="flex flex-col items-end">
              <div className="font-medium">{formatCurrency(invoice.total)}</div>
              <div>{getStatusBadge(invoice.status)}</div>
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
                <DropdownMenuItem>
                  <FileText className="h-4 w-4 mr-2" />
                  View Invoice
                </DropdownMenuItem>
                {invoice.status === 'draft' && (
                  <DropdownMenuItem>
                    <Send className="h-4 w-4 mr-2" />
                    Send to Client
                  </DropdownMenuItem>
                )}
                {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                  <DropdownMenuItem>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Mark as Paid
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                {invoice.status === 'draft' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvoiceList;
