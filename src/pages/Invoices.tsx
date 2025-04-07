
import React, { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';

export interface Invoice {
  id: string;
  number: string;
  client: {
    id: string;
    name: string;
    logo?: string;
  };
  issueDate: string;
  dueDate: string;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: {
    id: string;
    description: string;
    quantity: number;
    price: number;
    tax?: number;
  }[];
}

const Invoices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      number: 'INV-2025-001',
      client: {
        id: '1',
        name: 'Sonatrach',
        logo: '',
      },
      issueDate: '2025-04-01',
      dueDate: '2025-04-15',
      total: 75000,
      status: 'sent',
      items: [
        {
          id: '1-1',
          description: 'Web Application Development',
          quantity: 1,
          price: 60000,
          tax: 19,
        },
        {
          id: '1-2',
          description: 'UI/UX Design',
          quantity: 1,
          price: 15000,
          tax: 19,
        },
      ],
    },
    {
      id: '2',
      number: 'INV-2025-002',
      client: {
        id: '2',
        name: 'Djezzy',
        logo: '',
      },
      issueDate: '2025-03-15',
      dueDate: '2025-03-29',
      total: 45000,
      status: 'paid',
      items: [
        {
          id: '2-1',
          description: 'Mobile App Development (Phase 1)',
          quantity: 1,
          price: 45000,
          tax: 19,
        },
      ],
    },
    {
      id: '3',
      number: 'INV-2025-003',
      client: {
        id: '3',
        name: 'Air Algérie',
        logo: '',
      },
      issueDate: '2025-03-20',
      dueDate: '2025-04-10',
      total: 36000,
      status: 'overdue',
      items: [
        {
          id: '3-1',
          description: 'Digital Marketing Campaign',
          quantity: 1,
          price: 25000,
          tax: 19,
        },
        {
          id: '3-2',
          description: 'Social Media Management',
          quantity: 1,
          price: 11000,
          tax: 19,
        },
      ],
    },
    {
      id: '4',
      number: 'INV-2025-004',
      client: {
        id: '4',
        name: 'Ooredoo Algérie',
        logo: '',
      },
      issueDate: '2025-04-05',
      dueDate: '2025-04-20',
      total: 55000,
      status: 'draft',
      items: [
        {
          id: '4-1',
          description: 'IT Consulting Services',
          quantity: 40,
          price: 1250,
          tax: 19,
        },
        {
          id: '4-2',
          description: 'Server Infrastructure Setup',
          quantity: 1,
          price: 5000,
          tax: 19,
        },
      ],
    },
  ]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredInvoices = invoices.filter(invoice => 
    invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateInvoice = (newInvoice: Invoice) => {
    setInvoices([...invoices, newInvoice]);
    setIsCreateDialogOpen(false);
    toast({
      title: "Invoice Created",
      description: `Invoice ${newInvoice.number} has been created successfully.`,
    });
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
              <DropdownMenuItem>
                Export to PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem>
                Print Invoices
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
              </DialogHeader>
              <CreateInvoiceForm 
                onCreateInvoice={handleCreateInvoice}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
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
                    <TabsTrigger value="sent">Sent</TabsTrigger>
                    <TabsTrigger value="paid">Paid</TabsTrigger>
                    <TabsTrigger value="overdue">Overdue</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="all" className="m-0">
                  <InvoiceList invoices={filteredInvoices} />
                </TabsContent>
                <TabsContent value="draft" className="m-0">
                  <InvoiceList invoices={filteredInvoices.filter(i => i.status === 'draft')} />
                </TabsContent>
                <TabsContent value="sent" className="m-0">
                  <InvoiceList invoices={filteredInvoices.filter(i => i.status === 'sent')} />
                </TabsContent>
                <TabsContent value="paid" className="m-0">
                  <InvoiceList invoices={filteredInvoices.filter(i => i.status === 'paid')} />
                </TabsContent>
                <TabsContent value="overdue" className="m-0">
                  <InvoiceList invoices={filteredInvoices.filter(i => i.status === 'overdue')} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <InvoiceSummary invoices={invoices} />
        </div>
      </div>
    </div>
  );
};

export default Invoices;
