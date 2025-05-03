import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, MoreVertical, ArrowUpRight, Download, Trash2, Send } from 'lucide-react';
import { Invoice } from '@/services/invoice-api';
import { formatDateTime, formatCurrency } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

export interface InvoiceListProps {
  invoices: Invoice[];
  loading?: boolean; // Added loading prop as optional
  onViewInvoice?: (invoice: Invoice) => void;
  onDeleteInvoice?: (id: string) => void;
  onSendInvoice?: (id: string) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ 
  invoices,
  loading = false, // Default to false
  onViewInvoice,
  onDeleteInvoice,
  onSendInvoice
}) => {
  
  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <FileText className="h-4 w-4" />
            </TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>
                <FileText className="h-4 w-4" />
              </TableCell>
              <TableCell className="font-medium">{invoice.client}</TableCell>
              <TableCell>{formatDateTime(invoice.issue_date, 'date')}</TableCell>
              <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
              <TableCell>
                <Badge variant="secondary">{invoice.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onViewInvoice?.(invoice)}>
                      <ArrowUpRight className="mr-2 h-4 w-4" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" /> Download
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onSendInvoice?.(invoice.id)}>
                      <Send className="mr-2 h-4 w-4" /> Send
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDeleteInvoice?.(invoice.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
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

export default InvoiceList;
