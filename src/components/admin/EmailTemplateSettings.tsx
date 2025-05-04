
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Mail, 
  FileText, 
  CheckSquare, 
  Bell, 
  Send,
  Trash2,
  Copy,
  Save,
  RefreshCw,
  Loader2,
  ChevronRight,
  ChevronDown,
  Edit,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi, EmailTemplate } from '@/services/settings-api';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// HTML editor component
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const EmailTemplateSettings: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  
  const defaultTemplates = {
    task_assigned: {
      name: 'Task Assigned',
      type: 'task',
      icon: <CheckSquare className="h-5 w-5 text-blue-600" />,
    },
    task_completed: {
      name: 'Task Completed',
      type: 'task',
      icon: <CheckSquare className="h-5 w-5 text-green-600" />,
    },
    invoice_created: {
      name: 'Invoice Created',
      type: 'invoice',
      icon: <FileText className="h-5 w-5 text-purple-600" />,
    },
    invoice_paid: {
      name: 'Invoice Paid',
      type: 'invoice',
      icon: <FileText className="h-5 w-5 text-green-600" />,
    },
    project_created: {
      name: 'Project Created',
      type: 'project',
      icon: <FileText className="h-5 w-5 text-blue-600" />,
    },
    welcome_email: {
      name: 'Welcome Email',
      type: 'system',
      icon: <Mail className="h-5 w-5 text-indigo-600" />,
    },
    password_reset: {
      name: 'Password Reset',
      type: 'system',
      icon: <Mail className="h-5 w-5 text-red-600" />,
    },
  };
  
  // Fetch templates
  const { 
    data: templates, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['emailTemplates'],
    queryFn: () => settingsApi.getEmailTemplates(),
  });

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: (template: Partial<EmailTemplate>) => {
      if (!template.id) throw new Error("Template ID is required");
      return settingsApi.updateEmailTemplate(template.id, template);
    },
    onSuccess: () => {
      toast({
        title: "Template updated",
        description: "Email template has been successfully updated.",
      });
      
      // Reset editing state
      setEditingTemplate(null);
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update email template. Please try again."
      });
      console.error("Update error:", error);
    }
  });

  // Set initial active template
  useEffect(() => {
    if (templates && templates.length > 0 && !activeTemplate) {
      setActiveTemplate(templates[0].id);
    }
  }, [templates, activeTemplate]);

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate({ ...template });
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;
    
    updateTemplateMutation.mutate({
      id: editingTemplate.id,
      subject: editingTemplate.subject,
      body: editingTemplate.body,
      is_enabled: editingTemplate.is_enabled
    });
  };

  const handleCancelEdit = () => {
    setEditingTemplate(null);
  };

  const getActiveTemplate = () => {
    return templates?.find(t => t.id === activeTemplate) || null;
  };
  
  const getTemplateIcon = (type: string) => {
    switch(type) {
      case 'task': return <CheckSquare className="h-5 w-5 text-blue-600" />;
      case 'invoice': return <FileText className="h-5 w-5 text-purple-600" />;
      case 'project': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'system': return <Mail className="h-5 w-5 text-indigo-600" />;
      default: return <Mail className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTemplateBadgeColor = (type: string) => {
    switch(type) {
      case 'task': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'invoice': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'project': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'system': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Template variables by type
  const getTemplateVariables = (type: string) => {
    switch(type) {
      case 'task':
        return [
          { name: '{{task_name}}', description: 'Name of the task' },
          { name: '{{task_description}}', description: 'Description of the task' },
          { name: '{{due_date}}', description: 'Due date of the task' },
          { name: '{{assignee_name}}', description: 'Name of the assignee' },
          { name: '{{assigner_name}}', description: 'Name of the person who assigned' },
          { name: '{{task_status}}', description: 'Status of the task' },
          { name: '{{task_url}}', description: 'Link to view the task' }
        ];
      case 'invoice':
        return [
          { name: '{{invoice_number}}', description: 'Invoice number' },
          { name: '{{invoice_date}}', description: 'Date the invoice was issued' },
          { name: '{{due_date}}', description: 'Due date for payment' },
          { name: '{{amount}}', description: 'Total amount due' },
          { name: '{{client_name}}', description: 'Name of the client' },
          { name: '{{company_name}}', description: 'Your company name' },
          { name: '{{invoice_url}}', description: 'Link to view the invoice' }
        ];
      case 'project':
        return [
          { name: '{{project_name}}', description: 'Name of the project' },
          { name: '{{project_description}}', description: 'Description of the project' },
          { name: '{{start_date}}', description: 'Project start date' },
          { name: '{{end_date}}', description: 'Project end date' },
          { name: '{{client_name}}', description: 'Name of the client' },
          { name: '{{project_manager}}', description: 'Name of the project manager' },
          { name: '{{project_url}}', description: 'Link to view the project' }
        ];
      case 'system':
        return [
          { name: '{{user_name}}', description: 'Name of the user' },
          { name: '{{user_email}}', description: 'Email of the user' },
          { name: '{{company_name}}', description: 'Your company name' },
          { name: '{{reset_link}}', description: 'Password reset link' },
          { name: '{{login_url}}', description: 'Link to login page' },
          { name: '{{verification_code}}', description: 'Email verification code' }
        ];
      default:
        return [];
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>Failed to load email templates. Please try again.</p>
            <Button 
              variant="outline" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['emailTemplates'] })}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Template Selector */}
      <Card className="md:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle>Email Templates</CardTitle>
          <CardDescription>
            Manage notification email templates
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all">
            <div className="px-4">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="task">Tasks</TabsTrigger>
                <TabsTrigger value="invoice">Invoices</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="m-0">
              <div className="max-h-[400px] overflow-y-auto">
                {templates?.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setActiveTemplate(template.id)}
                    className={`w-full flex items-center p-3 text-left hover:bg-gray-100 transition-colors ${
                      activeTemplate === template.id ? 'bg-gray-100' : ''
                    }`}
                  >
                    <div className="mr-3">
                      {getTemplateIcon(template.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {template.subject}
                      </div>
                    </div>
                    <Badge className={getTemplateBadgeColor(template.type)}>
                      {template.is_enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="task" className="m-0">
              <div className="max-h-[400px] overflow-y-auto">
                {templates?.filter(t => t.type === 'task').map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setActiveTemplate(template.id)}
                    className={`w-full flex items-center p-3 text-left hover:bg-gray-100 transition-colors ${
                      activeTemplate === template.id ? 'bg-gray-100' : ''
                    }`}
                  >
                    <div className="mr-3">
                      {getTemplateIcon(template.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {template.subject}
                      </div>
                    </div>
                    <Badge className={getTemplateBadgeColor(template.type)}>
                      {template.is_enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="invoice" className="m-0">
              <div className="max-h-[400px] overflow-y-auto">
                {templates?.filter(t => t.type === 'invoice').map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setActiveTemplate(template.id)}
                    className={`w-full flex items-center p-3 text-left hover:bg-gray-100 transition-colors ${
                      activeTemplate === template.id ? 'bg-gray-100' : ''
                    }`}
                  >
                    <div className="mr-3">
                      {getTemplateIcon(template.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {template.subject}
                      </div>
                    </div>
                    <Badge className={getTemplateBadgeColor(template.type)}>
                      {template.is_enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="system" className="m-0">
              <div className="max-h-[400px] overflow-y-auto">
                {templates?.filter(t => t.type === 'system').map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setActiveTemplate(template.id)}
                    className={`w-full flex items-center p-3 text-left hover:bg-gray-100 transition-colors ${
                      activeTemplate === template.id ? 'bg-gray-100' : ''
                    }`}
                  >
                    <div className="mr-3">
                      {getTemplateIcon(template.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {template.subject}
                      </div>
                    </div>
                    <Badge className={getTemplateBadgeColor(template.type)}>
                      {template.is_enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Template Editor */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{getActiveTemplate()?.name || 'Select a template'}</CardTitle>
              <CardDescription>
                {getActiveTemplate()?.subject || 'Email template editor'}
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              {!editingTemplate && getActiveTemplate() && (
                <Button 
                  variant="outline" 
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  {previewMode ? 'Edit' : 'Preview'}
                </Button>
              )}
              
              {!editingTemplate && getActiveTemplate() && (
                <Button 
                  variant="default"
                  onClick={() => handleEditTemplate(getActiveTemplate()!)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Template
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {!getActiveTemplate() && (
            <div className="flex items-center justify-center h-[500px] border-2 border-dashed border-gray-200 rounded-md">
              <p className="text-gray-500">Select a template to edit</p>
            </div>
          )}
          
          {getActiveTemplate() && !editingTemplate && !previewMode && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Subject</Label>
                  <Badge variant={getActiveTemplate().is_enabled ? "default" : "outline"}>
                    {getActiveTemplate().is_enabled ? 'Active' : 'Disabled'}
                  </Badge>
                </div>
                <div className="p-2 border rounded-md bg-gray-50">
                  {getActiveTemplate().subject}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Email Body</Label>
                <div className="border rounded-md bg-gray-50 p-4 max-h-[500px] overflow-y-auto whitespace-pre-wrap">
                  <div dangerouslySetInnerHTML={{ __html: getActiveTemplate().body }} />
                </div>
              </div>
              
              <Accordion type="single" collapsible>
                <AccordionItem value="variables">
                  <AccordionTrigger>
                    <span className="text-sm font-medium">Available Variables</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {getTemplateVariables(getActiveTemplate().type).map((variable, index) => (
                        <div key={index} className="border rounded-md p-2 bg-gray-50">
                          <div className="font-mono text-sm">{variable.name}</div>
                          <div className="text-xs text-muted-foreground">{variable.description}</div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
          
          {getActiveTemplate() && !editingTemplate && previewMode && (
            <div className="border rounded-md p-4 max-h-[600px] overflow-y-auto">
              <div className="bg-white max-w-2xl mx-auto shadow rounded-md overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold">{getActiveTemplate().subject}</h2>
                </div>
                <div className="p-6">
                  <div dangerouslySetInnerHTML={{ __html: getActiveTemplate().body }} />
                </div>
              </div>
            </div>
          )}
          
          {editingTemplate && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="subject">Subject</Label>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="enabled" className="text-sm">Active</Label>
                    <Switch 
                      id="enabled" 
                      checked={editingTemplate.is_enabled} 
                      onCheckedChange={(value) => setEditingTemplate({...editingTemplate, is_enabled: value})}
                    />
                  </div>
                </div>
                <Input 
                  id="subject" 
                  value={editingTemplate.subject} 
                  onChange={(e) => setEditingTemplate({...editingTemplate, subject: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="body">Email Body (HTML)</Label>
                <Textarea 
                  id="body" 
                  value={editingTemplate.body} 
                  onChange={(e) => setEditingTemplate({...editingTemplate, body: e.target.value})}
                  className="min-h-[400px] font-mono text-sm"
                />
              </div>
              
              <Accordion type="single" collapsible>
                <AccordionItem value="variables">
                  <AccordionTrigger>
                    <span className="text-sm font-medium">Available Variables</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {getTemplateVariables(editingTemplate.type).map((variable, index) => (
                        <div 
                          key={index} 
                          className="border rounded-md p-2 bg-gray-50 cursor-pointer hover:bg-gray-100" 
                          onClick={() => {
                            const textarea = document.getElementById('body') as HTMLTextAreaElement;
                            if (textarea) {
                              const start = textarea.selectionStart;
                              const end = textarea.selectionEnd;
                              const text = editingTemplate.body;
                              const newText = text.slice(0, start) + variable.name + text.slice(end);
                              setEditingTemplate({...editingTemplate, body: newText});
                              
                              // Set focus back to textarea
                              setTimeout(() => {
                                textarea.focus();
                                textarea.setSelectionRange(start + variable.name.length, start + variable.name.length);
                              }, 0);
                            }
                          }}
                        >
                          <div className="font-mono text-sm">{variable.name}</div>
                          <div className="text-xs text-muted-foreground">{variable.description}</div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="preview">
                  <AccordionTrigger>
                    <span className="text-sm font-medium">Preview</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="border rounded-md p-4 mt-2 bg-white">
                      <div dangerouslySetInnerHTML={{ __html: editingTemplate.body }} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleCancelEdit}
                  disabled={updateTemplateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveTemplate}
                  disabled={updateTemplateMutation.isPending}
                >
                  {updateTemplateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Template
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTemplateSettings;
