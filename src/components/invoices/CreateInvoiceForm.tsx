
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Invoice } from '@/pages/Invoices';
import { useToast } from '@/hooks/use-toast';

interface CreateInvoiceFormProps {
  onCreateInvoice: (invoice: Invoice) => void;
  onCancel: () => void;
}

const CreateInvoiceForm: React.FC<CreateInvoiceFormProps> = ({ onCreateInvoice, onCancel }) => {
  const [client, setClient] = useState('');
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)); // 14 days from now
  const [items, setItems] = useState([{ id: '1', description: '', quantity: 1, price: 0 }]);
  const { toast } = useToast();

  // Sample clients (in a real app, these would come from an API or context)
  const clients = [
    { id: '1', name: 'Sonatrach' },
    { id: '2', name: 'Djezzy' },
    { id: '3', name: 'Air Algérie' },
    { id: '4', name: 'Ooredoo Algérie' },
  ];

  const addItem = () => {
    setItems([...items, { id: `${items.length + 1}`, description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    } else {
      toast({
        title: "Cannot remove",
        description: "Invoice must have at least one item",
        variant: "destructive",
      });
    }
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!client || !issueDate || !dueDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (items.some(item => !item.description || item.price <= 0)) {
      toast({
        title: "Validation Error",
        description: "All items must have a description and price",
        variant: "destructive",
      });
      return;
    }
    
    const selectedClient = clients.find(c => c.id === client);
    
    if (!selectedClient) {
      toast({
        title: "Validation Error",
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
        logo: '',
      },
      issueDate: format(issueDate, 'yyyy-MM-dd'),
      dueDate: format(dueDate, 'yyyy-MM-dd'),
      total: calculateTotal(),
      status: 'draft',
      items: items.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        tax: 19, // Default tax rate
      })),
    };
    
    onCreateInvoice(newInvoice);
    toast({
      title: "Invoice Created",
      description: `Invoice ${newInvoice.number} has been created as a draft`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Select value={client} onValueChange={setClient}>
            <SelectTrigger id="client">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Status</Label>
          <Input value="Draft" disabled />
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
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Invoice Items</h3>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
        
        {items.map((item, index) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-5">
                  <Label htmlFor={`description-${item.id}`} className="mb-2 block">Description</Label>
                  <Textarea 
                    id={`description-${item.id}`}
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                    className="resize-none"
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <Label htmlFor={`quantity-${item.id}`} className="mb-2 block">Quantity</Label>
                  <Input 
                    id={`quantity-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="col-span-6 md:col-span-3">
                  <Label htmlFor={`price-${item.id}`} className="mb-2 block">Price (DZD)</Label>
                  <Input 
                    id={`price-${item.id}`}
                    type="number"
                    min="0"
                    step="100"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-2 md:col-span-2 flex items-end">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive" 
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-right">
                    <p className="text-sm text-muted-foreground mb-1">Total</p>
                    <p className="font-medium">{(item.quantity * item.price).toLocaleString()} DZD</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex justify-between">
            <span className="font-medium">Subtotal:</span>
            <span>{calculateTotal().toLocaleString()} DZD</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-medium">Tax (19%):</span>
            <span>{(calculateTotal() * 0.19).toLocaleString()} DZD</span>
          </div>
          <div className="flex justify-between mt-2 text-lg font-bold">
            <span>Total:</span>
            <span>{(calculateTotal() * 1.19).toLocaleString()} DZD</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Create Invoice</Button>
      </div>
    </form>
  );
};

export default CreateInvoiceForm;
