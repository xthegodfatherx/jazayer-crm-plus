
import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Edit, Trash, ArrowUpRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Invoice } from '@/services/invoice-api';

interface InvoiceListProps {
  invoices: Invoice[];
  loading?: boolean;
  onDelete?: (id: string) => void;
  onSend?: (id: string) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ 
  invoices, 
  loading = false, 
  onDelete,
  onSend
}) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-500';
      case 'unpaid': return 'bg-amber-500';
      case 'overdue': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-blue-500'; // draft
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <Skeleton className="h-8 w-[100px]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-muted-foreground">No invoices found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>List of all invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">
              <Link to={`/invoices/${invoice.id}`} className="hover:underline">
                {invoice.invoice_number}
              </Link>
            </TableCell>
            <TableCell>{invoice.client}</TableCell>
            <TableCell>{invoice.amount.toLocaleString()} DZD</TableCell>
            <TableCell>{formatDate(invoice.due_date)}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" /> View details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSend && onSend(invoice.id)}>
                    <Send className="h-4 w-4 mr-2" /> Send to client
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete && onDelete(invoice.id)} className="text-red-600">
                    <Trash className="h-4 w-4 mr-2" /> Delete
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

export default InvoiceList;
