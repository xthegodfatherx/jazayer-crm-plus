
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
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Save, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { settingsApi, SystemSettings as SystemSettingsType } from '@/services/settings-api';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleError } from '@/services/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const formSchema = z.object({
  company_name: z.string().min(1).max(100),
  company_email: z.string().email(),
  company_website: z.string().url().optional().or(z.literal('')),
  company_phone: z.string().optional().or(z.literal('')),
  company_address: z.string().optional().or(z.literal('')),
  company_logo: z.string().optional().or(z.literal('')),
  default_language: z.enum(['ar', 'en', 'fr']),
  timezone: z.string(),
  date_format: z.string(),
  default_currency: z.string(),
});

const timezones = [
  'Africa/Algiers',
  'Africa/Cairo',
  'Africa/Casablanca',
  'Africa/Johannesburg',
  'Africa/Lagos',
  'Africa/Nairobi',
  'Africa/Tunis',
  'America/Argentina/Buenos_Aires',
  'America/Bogota',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Mexico_City',
  'America/New_York',
  'America/Sao_Paulo',
  'America/Toronto',
  'Asia/Dubai',
  'Asia/Hong_Kong',
  'Asia/Istanbul',
  'Asia/Jakarta',
  'Asia/Jerusalem',
  'Asia/Kolkata',
  'Asia/Riyadh',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Melbourne',
  'Australia/Sydney',
  'Europe/Amsterdam',
  'Europe/Athens',
  'Europe/Berlin',
  'Europe/Brussels',
  'Europe/London',
  'Europe/Madrid',
  'Europe/Moscow',
  'Europe/Paris',
  'Europe/Rome',
  'Pacific/Auckland',
];

const currencies = ['DZD', 'USD', 'EUR', 'GBP', 'AED', 'SAR', 'MAD', 'EGP', 'TND'];

const dateFormats = [
  'YYYY-MM-DD',
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'DD-MM-YYYY',
  'MM-DD-YYYY',
  'DD.MM.YYYY',
  'YYYY/MM/DD'
];

const SystemSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: '',
      company_email: '',
      company_website: '',
      company_phone: '',
      company_address: '',
      company_logo: '',
      default_language: 'en',
      timezone: 'Africa/Algiers',
      date_format: 'YYYY-MM-DD',
      default_currency: 'DZD',
    },
  });

  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        setLoading(true);
        const response = await settingsApi.getSystemSettings();
        
        if (response) {
          form.reset({
            company_name: response.company_name,
            company_email: response.company_email,
            company_website: response.company_website || '',
            company_phone: response.company_phone || '',
            company_address: response.company_address || '',
            company_logo: response.company_logo || '',
            default_language: response.default_language,
            timezone: response.timezone,
            date_format: response.date_format,
            default_currency: response.default_currency,
          });
          
          if (response.company_logo) {
            setLogoPreview(response.company_logo);
          }
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemSettings();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSaving(true);
      
      // If there's a new logo, upload it first
      if (logoFile) {
        const uploadResult = await settingsApi.uploadCompanyLogo(logoFile);
        if (uploadResult?.logo_url) {
          values.company_logo = uploadResult.logo_url;
        }
      }
      
      await settingsApi.updateSystemSettings(values);
      toast({
        title: "Settings updated",
        description: "System settings have been saved successfully.",
      });
    } catch (error) {
      handleError(error);
    } finally {
      setSaving(false);
    }
  };
  
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Configure global system settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading system settings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>Configure global system settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company Information</h3>
              
              <div className="flex items-center mb-6">
                <Avatar className="h-24 w-24 mr-4">
                  {logoPreview ? (
                    <AvatarImage src={logoPreview} alt="Company logo" />
                  ) : (
                    <AvatarFallback>
                      {form.watch('company_name')?.charAt(0) || 'C'}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Company Logo</h4>
                  <div className="flex items-center">
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <div className="flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
                        <Upload className="h-4 w-4 mr-2" />
                        <span>{logoPreview ? 'Change Logo' : 'Upload Logo'}</span>
                      </div>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company_website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Website</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="company_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Regional Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="default_language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="ar">Arabic</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timezones.map((timezone) => (
                            <SelectItem key={timezone} value={timezone}>
                              {timezone}
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
                  name="date_format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Format</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dateFormats.map((format) => (
                            <SelectItem key={format} value={format}>
                              {format}
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
                  name="default_currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save System Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
