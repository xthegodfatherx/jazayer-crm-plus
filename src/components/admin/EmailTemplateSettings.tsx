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
import { Loader2, Mail, Save, Settings } from 'lucide-react';
import { settingsApi, EmailTemplate, NotificationSettings } from '@/services/settings-api';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleError } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';

const emailTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  subject: z.string().min(1),
  body: z.string().min(1),
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    } finally {
      setSavingNotification(false);
    }
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
    <Card>
      <CardHeader>
        <CardTitle>Email & Notifications</CardTitle>
        <CardDescription>Configure email templates and notification settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="templates">
          <TabsList className="mb-4">
            <TabsTrigger value="templates">
              <Mail className="mr-2 h-4 w-4" />
              Email Templates
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Notification Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 border rounded-md p-4">
                <h3 className="font-medium mb-2">Templates</h3>
                {templates.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No templates available
                  </div>
                ) : (
                  <div className="space-y-2">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-3 rounded-md cursor-pointer flex items-center justify-between ${
                          selectedTemplate?.id === template.id
                            ? 'bg-primary/10 border border-primary/20'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <div>
                          <p className="font-medium text-sm">{template.name}</p>
                          <p className="text-xs text-muted-foreground">{template.type}</p>
                        </div>
                        <Switch checked={template.is_enabled} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2">
                {selectedTemplate ? (
                  <Form {...templateForm}>
                    <form onSubmit={templateForm.handleSubmit(onTemplateSubmit)} className="space-y-4">
                      <FormField
                        control={templateForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Template Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={templateForm.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Subject</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                                className="min-h-[200px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Available variables: {'{user}'} {'{company}'} {'{date}'}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={templateForm.control}
                        name="is_enabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-x-2 rounded-md border p-3">
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
                      
                      <Button type="submit" disabled={savingTemplate}>
                        {savingTemplate && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Template
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Select a template to edit
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <Form {...notificationForm}>
              <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={notificationForm.control}
                    name="email_notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="invoice_notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="system_notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" disabled={savingNotification}>
                  {savingNotification && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Notification Settings
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmailTemplateSettings;
