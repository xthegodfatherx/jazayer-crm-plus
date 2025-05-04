
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  ArrowUpDown, 
  ChevronDown, 
  Download, 
  Eye, 
  FilePlus, 
  MoreHorizontal, 
  Search, 
  Trash2
} from 'lucide-react';
import InvoiceDetails from '@/components/invoices/InvoiceDetails';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { invoicesApi, clientsApi } from '@/services/api';
import type { Invoice } from '@/services/invoices-api';
import type { Client } from '@/services/clients-api';

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Fetch invoices and clients from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch invoices
        const invoicesResponse = await invoicesApi.getAll();
        setInvoices(invoicesResponse.data);
        
        // Fetch clients for the dropdown
        const clientsResponse = await clientsApi.getAll();
        setClients(clientsResponse.data);
        
      } catch (err) {
        console.error('Failed to fetch invoices:', err);
        setError('Failed to load invoices. Please try again later.');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch invoice data'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter invoices based on search query and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      (invoice.invoice_number && invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (invoice.client?.name && invoice.client.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsOpen(true);
  };
  
  const handleCreateInvoice = async (newInvoice: Omit<Invoice, "id">) => {
    try {
      setIsLoading(true);
      const { data } = await invoicesApi.create(newInvoice);
      setInvoices([...invoices, data]);
      toast({
        title: 'Invoice Created',
        description: `Invoice #${data.invoice_number} has been created successfully.`
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create invoice'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateInvoice = async (updatedInvoice: Invoice) => {
    try {
      setIsLoading(true);
      const { data } = await invoicesApi.update(updatedInvoice.id, updatedInvoice);
      setInvoices(invoices.map(inv => inv.id === data.id ? data : inv));
      toast({
        title: 'Invoice Updated',
        description: `Invoice #${data.invoice_number} has been updated successfully.`
      });
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update invoice'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteInvoice = async (id: string) => {
    try {
      setIsLoading(true);
      await invoicesApi.delete(id);
      setInvoices(invoices.filter(invoice => invoice.id !== id));
      toast({
        title: 'Invoice Deleted',
        description: 'The invoice has been deleted successfully.'
      });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete invoice'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'outline';
      case 'pending':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-5 w-64" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <Skeleton className="h-10 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Invoices</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Invoice Management</CardTitle>
          <CardDescription>
            Create, view, and manage invoices for your clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search invoices..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <FilePlus className="h-4 w-4 mr-2" />
                    New Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                    <DialogDescription>
                      Create a new invoice for a client. Fill in the details below.
                    </DialogDescription>
                  </DialogHeader>
                  
                  {/* Replace this with your invoice form component */}
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="client">Client</Label>
                      <Select>
                        <SelectTrigger id="client">
                          <SelectValue placeholder="Select Client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="invoice-number">Invoice Number</Label>
                      <Input id="invoice-number" placeholder="INV-0001" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="issue-date">Issue Date</Label>
                      <Input id="issue-date" type="date" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="due-date">Due Date</Label>
                      <Input id="due-date" type="date" />
                    </div>
                    
                    {/* More fields would go here */}
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Invoice</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {error ? (
            <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          ) : filteredInvoices.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">
                      <div className="flex items-center">
                        Invoice #
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoice_number}
                      </TableCell>
                      <TableCell>
                        {invoice.client?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {invoice.issued_date ? new Date(invoice.issued_date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteInvoice(invoice.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
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
          ) : (
            <div className="p-8 text-center border rounded-md">
              <p className="text-muted-foreground">No invoices found matching your filters.</p>
              <Button className="mt-4">Create Invoice</Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedInvoice && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Invoice #{selectedInvoice.invoice_number}</DialogTitle>
            </DialogHeader>
            <InvoiceDetails invoice={selectedInvoice} onUpdateInvoice={handleUpdateInvoice} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Invoices;
