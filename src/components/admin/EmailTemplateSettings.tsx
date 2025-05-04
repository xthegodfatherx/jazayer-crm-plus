
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Save, Settings, AlertTriangle } from 'lucide-react';
import { settingsApi, EmailTemplate, NotificationSettings } from '@/services/settings-api';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleError } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';

const emailTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Template name is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Email body is required"),
  is_enabled: z.boolean(),
  type: z.enum(['task', 'invoice', 'project', 'system']),
});

const notificationSchema = z.object({
  email_notifications: z.boolean(),
  task_reminders: z.boolean(),
  invoice_notifications: z.boolean(),
  system_notifications: z.boolean(),
});

const EmailTemplateSettings: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [savingNotification, setSavingNotification] = useState(false);
  const { toast } = useToast();
  
  const templateForm = useForm<z.infer<typeof emailTemplateSchema>>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      id: '',
      name: '',
      subject: '',
      body: '',
      is_enabled: true,
      type: 'task',
    },
  });

  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      email_notifications: true,
      task_reminders: true,
      invoice_notifications: true,
      system_notifications: true,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [templatesResponse, notificationsResponse] = await Promise.all([
          settingsApi.getEmailTemplates(),
          settingsApi.getNotificationSettings()
        ]);
        
        if (templatesResponse) {
          setTemplates(templatesResponse);
          if (templatesResponse.length > 0) {
            setSelectedTemplate(templatesResponse[0]);
            templateForm.reset(templatesResponse[0]);
          }
        }
        
        if (notificationsResponse) {
          notificationForm.reset({
            email_notifications: notificationsResponse.email_notifications,
            task_reminders: notificationsResponse.task_reminders,
            invoice_notifications: notificationsResponse.invoice_notifications,
            system_notifications: notificationsResponse.system_notifications,
          });
        }
      } catch (error) {
        handleError(error);
        toast({
          title: "Error loading data",
          description: "Failed to load email templates or notification settings.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast, templateForm, notificationForm]);

  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    templateForm.reset(template);
  };

  const onTemplateSubmit = async (values: z.infer<typeof emailTemplateSchema>) => {
    if (!selectedTemplate) return;
    
    try {
      setSavingTemplate(true);
      await settingsApi.updateEmailTemplate(selectedTemplate.id, values);
      
      // Update local state
      const updatedTemplates = templates.map(t => 
        t.id === selectedTemplate.id ? { ...t, ...values } : t
      );
      setTemplates(updatedTemplates);
      setSelectedTemplate({ ...selectedTemplate, ...values });
      
      toast({
        title: "Template updated",
        description: "Email template has been updated successfully.",
      });
    } catch (error) {
      handleError(error);
      toast({
        title: "Update failed",
        description: "Failed to update email template.",
        variant: "destructive"
      });
    } finally {
      setSavingTemplate(false);
    }
  };

  const onNotificationSubmit = async (values: z.infer<typeof notificationSchema>) => {
    try {
      setSavingNotification(true);
      await settingsApi.updateNotificationSettings(values);
      
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      handleError(error);
      toast({
        title: "Update failed",
        description: "Failed to update notification settings.",
        variant: "destructive"
      });
    } finally {
      setSavingNotification(false);
    }
  };

  const getTemplatePreview = () => {
    if (!selectedTemplate) return null;
    
    // HTML email preview with replaced placeholders
    const emailBody = selectedTemplate.body
      .replace('{user}', 'John Doe')
      .replace('{company}', 'ACME Corp')
      .replace('{date}', new Date().toLocaleDateString());
      
    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="bg-[#9b87f5] text-white p-4 rounded-t-md">
          <h2 className="text-lg font-semibold">{selectedTemplate.subject}</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div dangerouslySetInnerHTML={{ __html: emailBody }} />
          
          <div className="border-t pt-4 mt-4 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email & Notifications</CardTitle>
          <CardDescription>Configure email templates and notification settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading settings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-t-4 border-t-[#9b87f5]">
      <CardHeader className="bg-[#f8f9fa]">
        <CardTitle className="flex items-center text-[#1A1F2C]">
          <Mail className="mr-2 h-5 w-5 text-[#9b87f5]" />
          Email & Notifications
        </CardTitle>
        <CardDescription>Configure email templates and notification settings</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="mb-6 w-full grid grid-cols-2">
            <TabsTrigger value="templates" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              <span>Email Templates</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Notification Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 border rounded-md p-4 bg-white shadow-sm">
                <h3 className="font-medium mb-2 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-[#9b87f5]" />
                  Email Templates
                </h3>
                <div className="text-sm text-gray-500 mb-3">
                  Select a template to edit its content and settings.
                </div>
                {templates.length === 0 ? (
                  <div className="text-center py-8 border rounded-md bg-gray-50">
                    <AlertTriangle className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                    <p className="text-gray-600">No templates available</p>
                    <p className="text-xs text-gray-500 mt-1">Contact system administrator</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-3 rounded-md cursor-pointer flex items-center justify-between transition-colors ${
                          selectedTemplate?.id === template.id
                            ? 'bg-[#9b87f5]/10 border border-[#9b87f5]/30 shadow-sm'
                            : 'hover:bg-gray-100 border border-transparent'
                        }`}
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <div>
                          <p className="font-medium text-sm">{template.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{template.type}</p>
                        </div>
                        <Switch checked={template.is_enabled} className="pointer-events-none" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2">
                {selectedTemplate ? (
                  <div className="space-y-6">
                    <div className="border rounded-lg p-5 bg-white shadow-sm">
                      <h3 className="text-lg font-medium mb-4 text-gray-800">Edit Template</h3>
                      <Form {...templateForm}>
                        <form onSubmit={templateForm.handleSubmit(onTemplateSubmit)} className="space-y-4">
                          <FormField
                            control={templateForm.control}
                            name="subject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Subject</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="Enter email subject" 
                                    className="bg-gray-50 focus:bg-white transition-colors"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={templateForm.control}
                            name="body"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Body</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    className="min-h-[250px] bg-gray-50 focus:bg-white transition-colors font-mono text-sm" 
                                    {...field} 
                                    placeholder="Enter email content with HTML formatting"
                                  />
                                </FormControl>
                                <FormDescription>
                                  Available variables: <code>{'{user}'}</code> <code>{'{company}'}</code> <code>{'{date}'}</code>
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={templateForm.control}
                            name="is_enabled"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between space-x-2 rounded-md border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel>Enable Template</FormLabel>
                                  <FormDescription>
                                    When enabled, this email template will be sent
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
                          
                          <div className="pt-2">
                            <Button 
                              type="submit" 
                              disabled={savingTemplate}
                              className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
                            >
                              {savingTemplate && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              <Save className="mr-2 h-4 w-4" />
                              Save Template
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                    
                    <div className="border rounded-lg p-5 bg-white shadow-sm">
                      <h3 className="text-lg font-medium mb-4 text-gray-800">Email Preview</h3>
                      {getTemplatePreview()}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[600px] bg-gray-50 border rounded-lg">
                    <div className="text-center text-gray-500">
                      <Mail className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                      <p>Select a template to edit</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="border rounded-lg p-5 bg-white shadow-sm">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Notification Preferences</h3>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                      control={notificationForm.control}
                      name="email_notifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications via email
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
                      control={notificationForm.control}
                      name="task_reminders"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Task Reminders</FormLabel>
                            <FormDescription>
                              Get reminded about upcoming and overdue tasks
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!notificationForm.getValues().email_notifications}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationForm.control}
                      name="invoice_notifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Invoice Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications about invoice status changes
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!notificationForm.getValues().email_notifications}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationForm.control}
                      name="system_notifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">System Notifications</FormLabel>
                            <FormDescription>
                              Get notified about system updates and maintenance
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!notificationForm.getValues().email_notifications}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={savingNotification}
                    className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
                  >
                    {savingNotification && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Notification Settings
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t px-6 py-3">
        <p className="text-xs text-gray-500">
          Email templates are used for system communications with users. Make sure your templates follow email best practices.
        </p>
      </CardFooter>
    </Card>
  );
};

export default EmailTemplateSettings;
