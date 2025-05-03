
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search, FileText, Calendar, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import InvoiceList from '@/components/invoices/InvoiceList';
import InvoiceSummary from '@/components/invoices/InvoiceSummary';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateInvoiceForm from '@/components/invoices/CreateInvoiceForm';
import CreateInvoiceAdvanced from '@/components/invoices/CreateInvoiceAdvanced';
import { useToast } from '@/hooks/use-toast';
import { Invoice, invoiceApi } from '@/services/invoice-api';
import { handleError } from '@/services/api';

const Invoices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const { data } = await invoiceApi.getAll();
        setInvoices(data);
      } catch (error) {
        handleError(error);
        toast({
          title: "Error loading invoices",
          description: "Failed to load invoice data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [toast]);

  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateInvoice = async (newInvoice: Omit<Invoice, 'id'>) => {
    try {
      const { data: createdInvoice } = await invoiceApi.create(newInvoice);
      setInvoices([...invoices, createdInvoice]);
      setIsCreateDialogOpen(false);
      toast({
        title: "Invoice Created",
        description: `Invoice ${createdInvoice.invoice_number} has been created successfully.`,
      });
    } catch (error) {
      handleError(error);
      toast({
        title: "Error creating invoice",
        description: "Failed to create the invoice. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceApi.delete(id);
        setInvoices(invoices.filter(invoice => invoice.id !== id));
        toast({
          title: "Invoice Deleted",
          description: "The invoice has been deleted successfully."
        });
      } catch (error) {
        handleError(error);
        toast({
          title: "Error deleting invoice",
          description: "Failed to delete the invoice. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSendInvoice = async (id: string) => {
    try {
      await invoiceApi.sendInvoice(id);
      // Update the status of the invoice in the UI
      setInvoices(
        invoices.map(invoice => 
          invoice.id === id ? { ...invoice, status: 'unpaid' } : invoice
        )
      );
      toast({
        title: "Invoice Sent",
        description: "The invoice has been sent to the client.",
      });
    } catch (error) {
      handleError(error);
      toast({
        title: "Error sending invoice",
        description: "Failed to send the invoice. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'print') => {
    try {
      toast({
        title: "Processing export",
        description: `Your ${format === 'print' ? 'printing' : format} request is being processed.`,
      });
      
      if (format === 'print') {
        window.print();
        return;
      }
      
      const blob = await invoiceApi.export({ 
        format, 
        invoices: filteredInvoices.map(inv => inv.id) 
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoices.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: "Export complete",
        description: `Your ${format} file has been downloaded.`,
      });
    } catch (error) {
      handleError(error);
      toast({
        title: "Export failed",
        description: `There was a problem with the ${format} export. Please try again.`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Export to PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('print')}>
                Print Invoices
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                setIsAdvancedMode(false);
                setIsCreateDialogOpen(true);
              }}>
                Simple Invoice
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setIsAdvancedMode(true);
                setIsCreateDialogOpen(true);
              }}>
                Custom Invoice (Builder)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search invoices..." 
                className="pl-8" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="all" className="w-full">
                <div className="flex justify-between items-center p-4 border-b">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="draft">Draft</TabsTrigger>
                    <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
                    <TabsTrigger value="paid">Paid</TabsTrigger>
                    <TabsTrigger value="overdue">Overdue</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="all" className="m-0">
                  <InvoiceList 
                    invoices={filteredInvoices} 
                    loading={loading} 
                    onDelete={handleDeleteInvoice}
                    onSend={handleSendInvoice}
                  />
                </TabsContent>
                <TabsContent value="draft" className="m-0">
                  <InvoiceList 
                    invoices={filteredInvoices.filter(i => i.status === 'draft')} 
                    loading={loading}
                    onDelete={handleDeleteInvoice}
                    onSend={handleSendInvoice}
                  />
                </TabsContent>
                <TabsContent value="unpaid" className="m-0">
                  <InvoiceList 
                    invoices={filteredInvoices.filter(i => i.status === 'unpaid')} 
                    loading={loading}
                    onDelete={handleDeleteInvoice}
                  />
                </TabsContent>
                <TabsContent value="paid" className="m-0">
                  <InvoiceList 
                    invoices={filteredInvoices.filter(i => i.status === 'paid')} 
                    loading={loading}
                    onDelete={handleDeleteInvoice}
                  />
                </TabsContent>
                <TabsContent value="overdue" className="m-0">
                  <InvoiceList 
                    invoices={filteredInvoices.filter(i => i.status === 'overdue')} 
                    loading={loading}
                    onDelete={handleDeleteInvoice}
                    onSend={handleSendInvoice}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <InvoiceSummary invoices={invoices} loading={loading} />
        </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAdvancedMode ? "Create Custom Invoice" : "Create Invoice"}</DialogTitle>
          </DialogHeader>
          {isAdvancedMode ? (
            <CreateInvoiceAdvanced 
              onSave={handleCreateInvoice}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          ) : (
            <CreateInvoiceForm 
              onCreateInvoice={handleCreateInvoice}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoices;
