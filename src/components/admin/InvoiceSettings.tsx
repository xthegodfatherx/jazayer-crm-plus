
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { settingsApi, InvoiceSettings as InvoiceSettingsType } from '@/services/settings-api';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleError } from '@/services/api';

const formSchema = z.object({
  tax_percentage: z.number().min(0).max(100),
  default_payment_terms: z.number().min(0),
  invoice_prefix: z.string().min(1).max(10),
  invoice_footer_text: z.string().max(500),
  default_download_format: z.enum(['pdf', 'docx', 'xlsx']),
  include_company_logo: z.boolean(),
  include_payment_instructions: z.boolean(),
});

const InvoiceSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tax_percentage: 0,
      default_payment_terms: 14,
      invoice_prefix: 'INV-',
      invoice_footer_text: '',
      default_download_format: 'pdf',
      include_company_logo: true,
      include_payment_instructions: true,
    },
  });

  useEffect(() => {
    const fetchInvoiceSettings = async () => {
      try {
        setLoading(true);
        const response = await settingsApi.getInvoiceSettings();
        
        if (response) {
          form.reset({
            tax_percentage: response.tax_percentage,
            default_payment_terms: response.default_payment_terms,
            invoice_prefix: response.invoice_prefix,
            invoice_footer_text: response.invoice_footer_text,
            default_download_format: response.default_download_format,
            include_company_logo: response.include_company_logo,
            include_payment_instructions: response.include_payment_instructions,
          });
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceSettings();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSaving(true);
      await settingsApi.updateInvoiceSettings(values);
      toast({
        title: "Settings saved",
        description: "Invoice settings have been updated successfully.",
      });
    } catch (error) {
      handleError(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invoice Settings</CardTitle>
          <CardDescription>Configure how invoices are generated and displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading settings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Settings</CardTitle>
        <CardDescription>Configure how invoices are generated and displayed</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="tax_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Tax Percentage</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0} 
                        max={100} 
                        step={0.01} 
                        {...form.register("tax_percentage", { valueAsNumber: true })}
                      />
                    </FormControl>
                    <FormDescription>
                      Default tax rate applied to invoices (%)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="default_payment_terms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Payment Terms</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min={0}
                        {...form.register("default_payment_terms", { valueAsNumber: true })}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of days until payment is due
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="invoice_prefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number Prefix</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="INV-" />
                  </FormControl>
                  <FormDescription>
                    This prefix will be added to all invoice numbers
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invoice_footer_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Footer Text</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter footer text to appear on all invoices" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Text that will appear at the bottom of all invoices
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="default_download_format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Download Format</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">DOCX</SelectItem>
                      <SelectItem value="xlsx">XLSX</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Default file format for downloaded invoices
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="include_company_logo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Company Logo</FormLabel>
                      <FormDescription>
                        Include company logo on invoices
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="include_payment_instructions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Payment Instructions</FormLabel>
                      <FormDescription>
                        Include payment instructions on invoices
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full md:w-auto">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default InvoiceSettings;
