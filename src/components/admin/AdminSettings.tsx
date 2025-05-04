
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Save, 
  Building, 
  Mail, 
  Globe, 
  BellRing,
  Languages,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  Shield,
  Info,
  Loader
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { settingsApi, SystemSettings, NotificationSettings, SecuritySettings, InvoiceSettings, SalarySettings } from '@/services/settings-api';
import { Skeleton } from '@/components/ui/skeleton';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('company');
  const { toast } = useToast();
  
  // State for all settings
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings | null>(null);
  const [salarySettings, setSalarySettings] = useState<SalarySettings | null>(null);
  
  // Loading and error states
  const [loading, setLoading] = useState<{[key: string]: boolean}>({
    system: false,
    notifications: false,
    security: false,
    invoice: false,
    salary: false
  });
  const [error, setError] = useState<{[key: string]: string | null}>({
    system: null,
    notifications: null,
    security: null,
    invoice: null,
    salary: null
  });
  const [saving, setSaving] = useState<{[key: string]: boolean}>({
    system: false,
    notifications: false,
    security: false,
    invoice: false,
    salary: false
  });

  // File upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  // Load system settings
  useEffect(() => {
    const fetchSystemSettings = async () => {
      setLoading(prev => ({ ...prev, system: true }));
      setError(prev => ({ ...prev, system: null }));
      
      try {
        const settings = await settingsApi.getSystemSettings();
        setSystemSettings(settings);
      } catch (err) {
        setError(prev => ({ ...prev, system: 'Failed to load system settings' }));
        toast({
          title: 'Error',
          description: 'Failed to load system settings',
          variant: 'destructive'
        });
      } finally {
        setLoading(prev => ({ ...prev, system: false }));
      }
    };
    
    if (activeTab === 'company') {
      fetchSystemSettings();
    }
  }, [activeTab, toast]);

  // Load notification settings
  useEffect(() => {
    const fetchNotificationSettings = async () => {
      setLoading(prev => ({ ...prev, notifications: true }));
      setError(prev => ({ ...prev, notifications: null }));
      
      try {
        const settings = await settingsApi.getNotificationSettings();
        setNotificationSettings(settings);
      } catch (err) {
        setError(prev => ({ ...prev, notifications: 'Failed to load notification settings' }));
        toast({
          title: 'Error',
          description: 'Failed to load notification settings',
          variant: 'destructive'
        });
      } finally {
        setLoading(prev => ({ ...prev, notifications: false }));
      }
    };
    
    if (activeTab === 'notifications') {
      fetchNotificationSettings();
    }
  }, [activeTab, toast]);

  // Load security settings
  useEffect(() => {
    const fetchSecuritySettings = async () => {
      setLoading(prev => ({ ...prev, security: true }));
      setError(prev => ({ ...prev, security: null }));
      
      try {
        const settings = await settingsApi.getSecuritySettings();
        setSecuritySettings(settings);
      } catch (err) {
        setError(prev => ({ ...prev, security: 'Failed to load security settings' }));
        toast({
          title: 'Error',
          description: 'Failed to load security settings',
          variant: 'destructive'
        });
      } finally {
        setLoading(prev => ({ ...prev, security: false }));
      }
    };
    
    if (activeTab === 'security') {
      fetchSecuritySettings();
    }
  }, [activeTab, toast]);
  
  // Load invoice settings
  useEffect(() => {
    const fetchInvoiceSettings = async () => {
      setLoading(prev => ({ ...prev, invoice: true }));
      setError(prev => ({ ...prev, invoice: null }));
      
      try {
        const settings = await settingsApi.getInvoiceSettings();
        setInvoiceSettings(settings);
      } catch (err) {
        setError(prev => ({ ...prev, invoice: 'Failed to load invoice settings' }));
        toast({
          title: 'Error',
          description: 'Failed to load invoice settings',
          variant: 'destructive'
        });
      } finally {
        setLoading(prev => ({ ...prev, invoice: false }));
      }
    };
    
    if (activeTab === 'invoice') {
      fetchInvoiceSettings();
    }
  }, [activeTab, toast]);
  
  // Load salary settings
  useEffect(() => {
    const fetchSalarySettings = async () => {
      setLoading(prev => ({ ...prev, salary: true }));
      setError(prev => ({ ...prev, salary: null }));
      
      try {
        const settings = await settingsApi.getSalarySettings();
        setSalarySettings(settings);
      } catch (err) {
        setError(prev => ({ ...prev, salary: 'Failed to load salary settings' }));
        toast({
          title: 'Error',
          description: 'Failed to load salary settings',
          variant: 'destructive'
        });
      } finally {
        setLoading(prev => ({ ...prev, salary: false }));
      }
    };
    
    if (activeTab === 'salary') {
      fetchSalarySettings();
    }
  }, [activeTab, toast]);
  
  // Handle system settings update
  const handleSystemSettingsUpdate = async () => {
    if (!systemSettings) return;
    
    setSaving(prev => ({ ...prev, system: true }));
    
    try {
      // If there's a logo file, upload it first
      if (logoFile) {
        const uploadResult = await settingsApi.uploadCompanyLogo(logoFile);
        setSystemSettings(prev => prev ? { ...prev, company_logo: uploadResult.logo_url } : null);
        setLogoFile(null);
      }
      
      // Update system settings
      const updatedSettings = await settingsApi.updateSystemSettings(systemSettings);
      setSystemSettings(updatedSettings);
      
      toast({
        title: 'Success',
        description: 'System settings updated successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update system settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(prev => ({ ...prev, system: false }));
    }
  };
  
  // Handle notification settings update
  const handleNotificationSettingsUpdate = async () => {
    if (!notificationSettings) return;
    
    setSaving(prev => ({ ...prev, notifications: true }));
    
    try {
      const updatedSettings = await settingsApi.updateNotificationSettings(notificationSettings);
      setNotificationSettings(updatedSettings);
      
      toast({
        title: 'Success',
        description: 'Notification settings updated successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update notification settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(prev => ({ ...prev, notifications: false }));
    }
  };
  
  // Handle security settings update
  const handleSecuritySettingsUpdate = async () => {
    if (!securitySettings) return;
    
    setSaving(prev => ({ ...prev, security: true }));
    
    try {
      const updatedSettings = await settingsApi.updateSecuritySettings(securitySettings);
      setSecuritySettings(updatedSettings);
      
      toast({
        title: 'Success',
        description: 'Security settings updated successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update security settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(prev => ({ ...prev, security: false }));
    }
  };
  
  // Handle invoice settings update
  const handleInvoiceSettingsUpdate = async () => {
    if (!invoiceSettings) return;
    
    setSaving(prev => ({ ...prev, invoice: true }));
    
    try {
      const updatedSettings = await settingsApi.updateInvoiceSettings(invoiceSettings);
      setInvoiceSettings(updatedSettings);
      
      toast({
        title: 'Success',
        description: 'Invoice settings updated successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update invoice settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(prev => ({ ...prev, invoice: false }));
    }
  };
  
  // Handle salary settings update
  const handleSalarySettingsUpdate = async () => {
    if (!salarySettings) return;
    
    setSaving(prev => ({ ...prev, salary: true }));
    
    try {
      const updatedSettings = await settingsApi.updateSalarySettings(salarySettings);
      setSalarySettings(updatedSettings);
      
      toast({
        title: 'Success',
        description: 'Salary settings updated successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update salary settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(prev => ({ ...prev, salary: false }));
    }
  };
  
  // Handle logo file change
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    }
  };
  
  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>Configure your application settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="company" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="mb-4">
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Company</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <BellRing className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="invoice" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Invoice</span>
            </TabsTrigger>
            <TabsTrigger value="salary" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Salary</span>
            </TabsTrigger>
            <TabsTrigger value="localization" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span>Localization</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Company Settings */}
          <TabsContent value="company" className="space-y-4">
            {error.system && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5" />
                <span>{error.system}</span>
              </div>
            )}
            
            {loading.system ? renderSkeleton() : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input 
                    id="company-name" 
                    placeholder="Your Company Name" 
                    value={systemSettings?.company_name || ''}
                    onChange={e => setSystemSettings(prev => prev ? {...prev, company_name: e.target.value} : null)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-email">Contact Email</Label>
                  <Input 
                    id="company-email" 
                    placeholder="contact@example.com" 
                    value={systemSettings?.company_email || ''}
                    onChange={e => setSystemSettings(prev => prev ? {...prev, company_email: e.target.value} : null)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-website">Website</Label>
                  <Input 
                    id="company-website" 
                    placeholder="https://example.com" 
                    value={systemSettings?.company_website || ''}
                    onChange={e => setSystemSettings(prev => prev ? {...prev, company_website: e.target.value} : null)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Phone Number</Label>
                  <Input 
                    id="company-phone" 
                    placeholder="+123456789" 
                    value={systemSettings?.company_phone || ''}
                    onChange={e => setSystemSettings(prev => prev ? {...prev, company_phone: e.target.value} : null)}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="company-address">Address</Label>
                  <Textarea 
                    id="company-address" 
                    placeholder="Company Address" 
                    value={systemSettings?.company_address || ''}
                    onChange={e => setSystemSettings(prev => prev ? {...prev, company_address: e.target.value} : null)}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="company-logo">Company Logo</Label>
                  {systemSettings?.company_logo && (
                    <div className="mb-2">
                      <img 
                        src={systemSettings.company_logo} 
                        alt="Company Logo" 
                        className="h-12 object-contain" 
                      />
                    </div>
                  )}
                  <Input 
                    id="company-logo" 
                    type="file" 
                    accept="image/*"
                    onChange={handleLogoFileChange}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button onClick={handleSystemSettingsUpdate} disabled={loading.system || saving.system}>
                {saving.system ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4">
            {error.notifications && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5" />
                <span>{error.notifications}</span>
              </div>
            )}
            
            {loading.notifications ? renderSkeleton() : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Notifications</h3>
                    <p className="text-sm text-muted-foreground">Enable or disable all notifications</p>
                  </div>
                  <Switch 
                    checked={notificationSettings?.email_notifications || false}
                    onCheckedChange={checked => 
                      setNotificationSettings(prev => prev ? {
                        ...prev, 
                        email_notifications: checked,
                        task_reminders: checked ? prev.task_reminders : false,
                        invoice_notifications: checked ? prev.invoice_notifications : false,
                        system_notifications: checked ? prev.system_notifications : false
                      } : null)
                    }
                    id="notifications"
                  />
                </div>
                
                <hr className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch 
                      checked={notificationSettings?.email_notifications || false}
                      onCheckedChange={checked => 
                        setNotificationSettings(prev => prev ? {...prev, email_notifications: checked} : null)
                      }
                      id="email-notifications"
                      disabled={!notificationSettings?.email_notifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="task-reminders" className="text-base">Task Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get reminders for upcoming tasks</p>
                    </div>
                    <Switch 
                      checked={notificationSettings?.task_reminders || false}
                      onCheckedChange={checked => 
                        setNotificationSettings(prev => prev ? {...prev, task_reminders: checked} : null)
                      }
                      id="task-reminders"
                      disabled={!notificationSettings?.email_notifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="invoice-notifications" className="text-base">Invoice Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get notifications about invoice status changes</p>
                    </div>
                    <Switch 
                      checked={notificationSettings?.invoice_notifications || false}
                      onCheckedChange={checked => 
                        setNotificationSettings(prev => prev ? {...prev, invoice_notifications: checked} : null)
                      }
                      id="invoice-notifications"
                      disabled={!notificationSettings?.email_notifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="system-notifications" className="text-base">System Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive important system alerts</p>
                    </div>
                    <Switch 
                      checked={notificationSettings?.system_notifications || false}
                      onCheckedChange={checked => 
                        setNotificationSettings(prev => prev ? {...prev, system_notifications: checked} : null)
                      }
                      id="system-notifications"
                      disabled={!notificationSettings?.email_notifications}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <Button onClick={handleNotificationSettingsUpdate} disabled={loading.notifications || saving.notifications}>
                {saving.notifications ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          {/* Invoice Settings */}
          <TabsContent value="invoice" className="space-y-4">
            {error.invoice && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5" />
                <span>{error.invoice}</span>
              </div>
            )}
            
            {loading.invoice ? renderSkeleton() : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax-percentage">Tax Percentage (%)</Label>
                  <Input 
                    id="tax-percentage" 
                    type="number"
                    placeholder="0"
                    value={invoiceSettings?.tax_percentage || 0}
                    onChange={e => setInvoiceSettings(prev => prev ? 
                      {...prev, tax_percentage: parseFloat(e.target.value)} : null)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-terms">Default Payment Terms (days)</Label>
                  <Input 
                    id="payment-terms" 
                    type="number"
                    placeholder="30"
                    value={invoiceSettings?.default_payment_terms || 30}
                    onChange={e => setInvoiceSettings(prev => prev ? 
                      {...prev, default_payment_terms: parseInt(e.target.value)} : null)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="invoice-prefix">Invoice Prefix</Label>
                  <Input 
                    id="invoice-prefix" 
                    placeholder="INV-"
                    value={invoiceSettings?.invoice_prefix || ''}
                    onChange={e => setInvoiceSettings(prev => prev ? 
                      {...prev, invoice_prefix: e.target.value} : null)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="download-format">Default Download Format</Label>
                  <Select 
                    value={invoiceSettings?.default_download_format || 'pdf'}
                    onValueChange={value => setInvoiceSettings(prev => prev ? 
                      {...prev, default_download_format: value as 'pdf' | 'docx' | 'xlsx'} : null)}
                  >
                    <SelectTrigger id="download-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">DOCX</SelectItem>
                      <SelectItem value="xlsx">XLSX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="footer-text">Invoice Footer Text</Label>
                  <Textarea 
                    id="footer-text" 
                    placeholder="Thank you for your business!"
                    value={invoiceSettings?.invoice_footer_text || ''}
                    onChange={e => setInvoiceSettings(prev => prev ? 
                      {...prev, invoice_footer_text: e.target.value} : null)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="include-logo" className="text-base">Include Company Logo</Label>
                    <p className="text-sm text-muted-foreground">Display company logo on invoices</p>
                  </div>
                  <Switch 
                    checked={invoiceSettings?.include_company_logo || false}
                    onCheckedChange={checked => setInvoiceSettings(prev => prev ? 
                      {...prev, include_company_logo: checked} : null)}
                    id="include-logo"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="payment-instructions" className="text-base">Include Payment Instructions</Label>
                    <p className="text-sm text-muted-foreground">Display payment details on invoices</p>
                  </div>
                  <Switch 
                    checked={invoiceSettings?.include_payment_instructions || false}
                    onCheckedChange={checked => setInvoiceSettings(prev => prev ? 
                      {...prev, include_payment_instructions: checked} : null)}
                    id="payment-instructions"
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <Button onClick={handleInvoiceSettingsUpdate} disabled={loading.invoice || saving.invoice}>
                {saving.invoice ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          {/* Salary Settings */}
          <TabsContent value="salary" className="space-y-4">
            {error.salary && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5" />
                <span>{error.salary}</span>
              </div>
            )}
            
            {loading.salary ? renderSkeleton() : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="calculation-method">Salary Calculation Method</Label>
                  <Select 
                    value={salarySettings?.calculation_method || 'task_based'}
                    onValueChange={value => setSalarySettings(prev => prev ? 
                      {...prev, calculation_method: value as 'task_based' | 'fixed' | 'hourly'} : null)}
                  >
                    <SelectTrigger id="calculation-method" className="w-full">
                      <SelectValue placeholder="Select calculation method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="task_based">Task-Based</SelectItem>
                      <SelectItem value="fixed">Fixed Salary</SelectItem>
                      <SelectItem value="hourly">Hourly Rate</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {salarySettings?.calculation_method === 'hourly' && (
                    <div className="pt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="hourly-rate">Default Hourly Rate</Label>
                        <Input 
                          id="hourly-rate" 
                          type="number"
                          placeholder="0"
                          value={salarySettings?.default_hourly_rate || 0}
                          onChange={e => setSalarySettings(prev => prev ? 
                            {...prev, default_hourly_rate: parseFloat(e.target.value)} : null)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="overtime-multiplier">Overtime Multiplier</Label>
                        <Input 
                          id="overtime-multiplier" 
                          type="number"
                          step="0.1"
                          placeholder="1.5"
                          value={salarySettings?.overtime_multiplier || 1.5}
                          onChange={e => setSalarySettings(prev => prev ? 
                            {...prev, overtime_multiplier: parseFloat(e.target.value)} : null)}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="bonus-calculation">Bonus Calculation Method</Label>
                  <Select 
                    value={salarySettings?.bonus_calculation_method || 'percentage'}
                    onValueChange={value => setSalarySettings(prev => prev ? 
                      {...prev, bonus_calculation_method: value as 'percentage' | 'fixed'} : null)}
                  >
                    <SelectTrigger id="bonus-calculation" className="w-full">
                      <SelectValue placeholder="Select bonus calculation method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage of Salary</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {salarySettings?.bonus_calculation_method === 'percentage' ? (
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="bonus-percentage">Bonus Percentage (%)</Label>
                      <Input 
                        id="bonus-percentage" 
                        type="number"
                        placeholder="0"
                        value={salarySettings?.bonus_percentage || 0}
                        onChange={e => setSalarySettings(prev => prev ? 
                          {...prev, bonus_percentage: parseFloat(e.target.value)} : null)}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="bonus-amount">Bonus Fixed Amount</Label>
                      <Input 
                        id="bonus-amount" 
                        type="number"
                        placeholder="0"
                        value={salarySettings?.bonus_fixed_amount || 0}
                        onChange={e => setSalarySettings(prev => prev ? 
                          {...prev, bonus_fixed_amount: parseFloat(e.target.value)} : null)}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <Button onClick={handleSalarySettingsUpdate} disabled={loading.salary || saving.salary}>
                {saving.salary ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          {/* Localization Settings */}
          <TabsContent value="localization" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Default Language</Label>
                <Select defaultValue={systemSettings?.default_language || 'ar'}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue={systemSettings?.timezone || 'Africa/Algiers'}>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Algiers">Africa/Algiers</SelectItem>
                    <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select defaultValue={systemSettings?.date_format || 'DD/MM/YYYY'}>
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select defaultValue={systemSettings?.default_currency || 'DZD'}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DZD">Algerian Dinar (DZD)</SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={handleSystemSettingsUpdate} disabled={loading.system || saving.system}>
                {saving.system ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4">
            {error.security && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5" />
                <span>{error.security}</span>
              </div>
            )}
            
            {loading.security ? renderSkeleton() : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
                  </div>
                  <Switch 
                    checked={securitySettings?.two_factor_enabled || false}
                    onCheckedChange={checked => setSecuritySettings(prev => prev ? 
                      {...prev, two_factor_enabled: checked} : null)}
                    id="two-factor"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="session-timeout">Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Automatically log out inactive users</p>
                  </div>
                  <Select 
                    value={securitySettings?.session_timeout?.toString() || '60'}
                    onValueChange={value => setSecuritySettings(prev => prev ? 
                      {...prev, session_timeout: parseInt(value)} : null)}
                  >
                    <SelectTrigger id="session-timeout" className="w-[180px]">
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="password-policy">Password Policy</Label>
                    <p className="text-sm text-muted-foreground">Set minimum password requirements</p>
                  </div>
                  <Select 
                    value={securitySettings?.password_policy || 'strong'}
                    onValueChange={value => setSecuritySettings(prev => prev ? 
                      {...prev, password_policy: value as 'basic' | 'standard' | 'strong' | 'very-strong'} : null)}
                  >
                    <SelectTrigger id="password-policy" className="w-[180px]">
                      <SelectValue placeholder="Select policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (8+ chars)</SelectItem>
                      <SelectItem value="standard">Standard (8+ chars, 1 number)</SelectItem>
                      <SelectItem value="strong">Strong (8+ chars, mixed case, numbers)</SelectItem>
                      <SelectItem value="very-strong">Very Strong (12+ chars, special chars)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ip-restriction">IP Restriction</Label>
                    <p className="text-sm text-muted-foreground">Limit access to specific IP addresses</p>
                  </div>
                  <Switch 
                    checked={securitySettings?.ip_restriction_enabled || false}
                    onCheckedChange={checked => setSecuritySettings(prev => prev ? 
                      {...prev, ip_restriction_enabled: checked} : null)}
                    id="ip-restriction"
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <Button onClick={handleSecuritySettingsUpdate} disabled={loading.security || saving.security}>
                {saving.security ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
