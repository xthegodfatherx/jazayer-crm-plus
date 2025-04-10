
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, CreditCard, DollarSign, FileText, Palette, Save, Send } from 'lucide-react';
import InvoiceTemplateSelector from './InvoiceTemplateSelector';
import InvoiceBuilder from './InvoiceBuilder';
import { InvoicePreview } from './InvoicePreview';
import { InvoiceSection, InvoiceStyle, InvoiceTemplate, Invoice } from '@/types/invoice';
import { useToast } from '@/hooks/use-toast';

interface CreateInvoiceAdvancedProps {
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
}

// Default templates
const defaultTemplates: InvoiceTemplate[] = [
  {
    id: 'standard',
    name: 'Standard Invoice',
    description: 'Classic invoice with all essential details',
    previewImage: '/invoice-templates/standard.png',
    primaryColor: '#8B5CF6',
    secondaryColor: '#C4B5FD',
    fontFamily: 'inter',
    showLogo: true,
    sections: [
      { id: 'header-1', type: 'header', title: 'Header', required: true, order: 1 },
      { id: 'client-1', type: 'clientInfo', title: 'Client Information', required: true, order: 2 },
      { id: 'invoice-1', type: 'invoiceInfo', title: 'Invoice Details', required: true, order: 3 },
      { id: 'items-1', type: 'items', title: 'Items', required: true, order: 4 },
      { id: 'summary-1', type: 'summary', title: 'Summary', required: true, order: 5 },
      { id: 'payment-1', type: 'payment', title: 'Payment Methods', required: true, order: 6 },
    ]
  },
  {
    id: 'project',
    name: 'Project Invoice',
    description: 'Detailed breakdown of project tasks and time',
    previewImage: '/invoice-templates/project.png',
    primaryColor: '#0EA5E9',
    secondaryColor: '#BAE6FD',
    fontFamily: 'poppins',
    showLogo: true,
    sections: [
      { id: 'header-2', type: 'header', title: 'Header', required: true, order: 1 },
      { id: 'client-2', type: 'clientInfo', title: 'Client Information', required: true, order: 2 },
      { id: 'invoice-2', type: 'invoiceInfo', title: 'Invoice Details', required: true, order: 3 },
      { id: 'items-2', type: 'items', title: 'Project Tasks', required: true, order: 4 },
      { id: 'summary-2', type: 'summary', title: 'Summary', required: true, order: 5 },
      { id: 'notes-2', type: 'notes', title: 'Notes', required: false, order: 6, content: '' },
      { id: 'payment-2', type: 'payment', title: 'Payment Methods', required: true, order: 7 },
    ]
  },
  {
    id: 'subscription',
    name: 'Subscription Invoice',
    description: 'Recurring invoice with subscription details',
    previewImage: '/invoice-templates/subscription.png',
    primaryColor: '#10B981',
    secondaryColor: '#A7F3D0',
    fontFamily: 'montserrat',
    showLogo: true,
    sections: [
      { id: 'header-3', type: 'header', title: 'Header', required: true, order: 1 },
      { id: 'client-3', type: 'clientInfo', title: 'Client Information', required: true, order: 2 },
      { id: 'invoice-3', type: 'invoiceInfo', title: 'Subscription Details', required: true, order: 3 },
      { id: 'items-3', type: 'items', title: 'Services', required: true, order: 4 },
      { id: 'summary-3', type: 'summary', title: 'Summary', required: true, order: 5 },
      { id: 'terms-3', type: 'terms', title: 'Terms & Conditions', required: false, order: 6, content: 'This subscription will automatically renew unless cancelled.' },
      { id: 'payment-3', type: 'payment', title: 'Payment Methods', required: true, order: 7 },
    ]
  },
];

// Sample clients
const sampleClients = [
  { id: '1', name: 'Sonatrach' },
  { id: '2', name: 'Djezzy' },
  { id: '3', name: 'Air Algérie' },
  { id: '4', name: 'Ooredoo Algérie' },
];

// Sample currencies
const currencies = [
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'دج' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
];

// Payment methods
const paymentMethods = [
  { id: 'bank', name: 'Bank Transfer', isActive: true },
  { id: 'cib', name: 'CIB/EDAHABIA', isActive: true },
  { id: 'baridimob', name: 'CCP/BaridiMob', isActive: true },
  { id: 'cash', name: 'Cash', isActive: true },
  { id: 'paypal', name: 'PayPal', isActive: false },
];

const CreateInvoiceAdvanced: React.FC<CreateInvoiceAdvancedProps> = ({ onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState('template');
  const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplates[0].id);
  const [client, setClient] = useState('');
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000));
  const [currency, setCurrency] = useState('DZD');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [sections, setSections] = useState<InvoiceSection[]>(defaultTemplates[0].sections);
  const [style, setStyle] = useState<InvoiceStyle>({
    primaryColor: defaultTemplates[0].primaryColor,
    secondaryColor: defaultTemplates[0].secondaryColor,
    fontFamily: defaultTemplates[0].fontFamily,
    showLogo: defaultTemplates[0].showLogo,
  });
  
  const { toast } = useToast();

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = defaultTemplates.find(t => t.id === templateId);
    if (template) {
      setSections(template.sections);
      setStyle({
        primaryColor: template.primaryColor,
        secondaryColor: template.secondaryColor,
        fontFamily: template.fontFamily,
        showLogo: template.showLogo,
      });
    }
  };

  const handleSaveInvoice = () => {
    if (!client || !issueDate || !dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    const selectedClient = sampleClients.find(c => c.id === client);
    
    if (!selectedClient) {
      toast({
        title: "Invalid Client",
        description: "Please select a valid client",
        variant: "destructive",
      });
      return;
    }
    
    const newInvoice: Invoice = {
      id: `${Date.now()}`,
      number: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      client: {
        id: selectedClient.id,
        name: selectedClient.name,
      },
      issueDate: format(issueDate, 'yyyy-MM-dd'),
      dueDate: format(dueDate, 'yyyy-MM-dd'),
      items: [
        {
          id: '1',
          description: 'Sample Item',
          quantity: 1,
          price: 1000,
          total: 1000,
        }
      ],
      currency: currencies.find(c => c.code === currency) || currencies[0],
      status: 'draft',
      template: selectedTemplate,
      style,
      total: 1000,
      paymentMethod,
    };
    
    onSave(newInvoice);
    toast({
      title: "Invoice Created",
      description: `Invoice ${newInvoice.number} has been created as a draft`,
    });
  };

  const handleNext = () => {
    if (activeTab === 'template') {
      setActiveTab('design');
    } else if (activeTab === 'design') {
      setActiveTab('preview');
    }
  };

  const handleBack = () => {
    if (activeTab === 'design') {
      setActiveTab('template');
    } else if (activeTab === 'preview') {
      setActiveTab('design');
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="template" className="flex gap-2 items-center">
            <FileText className="h-4 w-4" />
            Template
          </TabsTrigger>
          <TabsTrigger value="design" className="flex gap-2 items-center">
            <Palette className="h-4 w-4" />
            Design
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex gap-2 items-center">
            <DollarSign className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="template" className="pt-6">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Invoice Template</h3>
              <InvoiceTemplateSelector 
                selectedTemplate={selectedTemplate}
                onSelectTemplate={handleTemplateChange}
                templates={defaultTemplates}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Select value={client} onValueChange={setClient}>
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleClients.map(client => (
                        <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {issueDate ? format(issueDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={issueDate}
                        onSelect={setIssueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(currency => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.filter(m => m.isActive).map(method => (
                      <SelectItem key={method.id} value={method.id}>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          {method.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="design" className="pt-6">
          <InvoiceBuilder 
            sections={sections}
            onSectionsChange={setSections}
            style={style}
            onStyleChange={setStyle}
          />
        </TabsContent>
        
        <TabsContent value="preview" className="pt-6">
          <Card>
            <CardContent className="p-6">
              <InvoicePreview 
                template={selectedTemplate}
                sections={sections}
                style={style}
                client={sampleClients.find(c => c.id === client)}
                issueDate={issueDate ? format(issueDate, 'yyyy-MM-dd') : ''}
                dueDate={dueDate ? format(dueDate, 'yyyy-MM-dd') : ''}
                currency={currencies.find(c => c.code === currency)}
                paymentMethod={paymentMethods.find(m => m.id === paymentMethod)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between">
        {activeTab !== 'template' ? (
          <Button variant="outline" onClick={handleBack}>Back</Button>
        ) : (
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        )}
        
        {activeTab !== 'preview' ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Preview PDF
            </Button>
            <Button onClick={handleSaveInvoice}>
              <Save className="h-4 w-4 mr-2" />
              Save Invoice
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateInvoiceAdvanced;
