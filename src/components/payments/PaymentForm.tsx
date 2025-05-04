
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, CreditCard, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { paymentsApi, invoicesApi, clientsApi, handleError } from '@/services/api';
import { Invoice as ApiInvoice } from '@/services/invoices-api';

// Form schema
const formSchema = z.object({
  invoice_id: z.string().optional().nullable(),
  amount: z.coerce.number().positive({ message: 'Amount must be positive' }),
  payment_date: z.date(),
  payment_method: z.string().min(1, { message: 'Payment method is required' }),
  reference_number: z.string().optional(),
  notes: z.string().optional(),
  client_id: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface PaymentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface Client {
  id: string;
  name: string;
}

// Create a local invoice interface that matches what the component uses
interface FormattedInvoice {
  id: string;
  invoice_number: string;
  amount: number;
  client_id: string;
  status: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess, onCancel }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<FormattedInvoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      payment_date: new Date(),
      payment_method: 'bank_transfer',
      reference_number: '',
      notes: '',
      invoice_id: null,
      client_id: null,
    },
  });

  // Fetch clients and invoices
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch clients
        const { data: clientsData } = await clientsApi.getAll();
        setClients(clientsData);

        // Fetch unpaid invoices
        const { data: invoicesData } = await invoicesApi.getAll({ 
          filters: { status: 'issued,overdue' } 
        });
        
        // Map API invoices to the format the component expects
        const formattedInvoices = invoicesData.map((invoice: ApiInvoice) => ({
          id: invoice.id,
          invoice_number: invoice.id, // Using id as invoice_number if actual number not available
          amount: invoice.amount || 0,  // Using amount instead of total
          client_id: invoice.client_id || '',
          status: invoice.status,
        }));
        
        setInvoices(formattedInvoices);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle selected invoice change
  const handleInvoiceChange = (invoiceId: string) => {
    const selectedInvoice = invoices.find(inv => inv.id === invoiceId);
    if (selectedInvoice) {
      form.setValue('amount', selectedInvoice.amount);
      form.setValue('client_id', selectedInvoice.client_id);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);
      
      // Format the data for API
      const paymentData = {
        ...data,
        payment_date: data.payment_date.toISOString(),
        status: 'completed' as const,
      };
      
      // Send to API
      await paymentsApi.create(paymentData);
      
      // Show success message
      toast({
        title: "Payment recorded",
        description: "The payment has been recorded successfully",
      });
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <p>Loading payment form data...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="invoice_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice (Optional)</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleInvoiceChange(value);
                }}
                value={field.value ?? undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an invoice" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">No invoice (direct payment)</SelectItem>
                  {invoices.map(invoice => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      {invoice.invoice_number} - {new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(invoice.amount)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ?? undefined}
                disabled={!!form.watch('invoice_id')}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">DZD</span>
                  <Input type="number" className="pl-12" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Payment Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="online_payment">Online Payment</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reference_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference Number (Optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                E.g., Cheque number, transaction ID, or other reference
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any additional payment notes here" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Record Payment
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentForm;
