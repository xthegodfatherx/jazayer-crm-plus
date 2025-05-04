
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Save, 
  Mail,
  AlertTriangle,
  Eye,
  Edit,
  Loader
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EmailTemplate, settingsApi } from '@/services/settings-api';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const EmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  
  const { toast } = useToast();
  
  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await settingsApi.getEmailTemplates();
        setTemplates(data);
      } catch (err) {
        setError('Failed to load email templates');
        toast({
          title: 'Error',
          description: 'Failed to load email templates',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTemplates();
  }, [toast]);
  
  // Handle template selection for editing
  const handleEditTemplate = (template: EmailTemplate) => {
    setCurrentTemplate(template);
    setEditDialogOpen(true);
  };
  
  // Handle template selection for preview
  const handlePreviewTemplate = (template: EmailTemplate) => {
    setCurrentTemplate(template);
    setPreviewDialogOpen(true);
  };
  
  // Handle template update
  const handleUpdateTemplate = async () => {
    if (!currentTemplate) return;
    
    setSaving(true);
    
    try {
      const updatedTemplate = await settingsApi.updateEmailTemplate(
        currentTemplate.id, 
        {
          subject: currentTemplate.subject,
          body: currentTemplate.body,
          is_enabled: currentTemplate.is_enabled
        }
      );
      
      // Update templates array
      setTemplates(templates.map(t => 
        t.id === updatedTemplate.id ? updatedTemplate : t
      ));
      
      toast({
        title: 'Success',
        description: 'Email template updated successfully',
      });
      
      setEditDialogOpen(false);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update email template',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Filter templates by type
  const getFilteredTemplates = (type: string) => {
    return templates.filter(template => template.type === type);
  };
  
  // Get badge color by template type
  const getTemplateBadgeColor = (type: string) => {
    switch(type) {
      case 'task': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'invoice': return 'bg-green-100 text-green-800 border-green-200';
      case 'project': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'system': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return '';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Templates
            </CardTitle>
            <CardDescription>Customize email notifications sent by the system</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Loading state */}
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        ) : (
          <Tabs defaultValue="task">
            <TabsList className="mb-4">
              <TabsTrigger value="task">Task Templates</TabsTrigger>
              <TabsTrigger value="invoice">Invoice Templates</TabsTrigger>
              <TabsTrigger value="project">Project Templates</TabsTrigger>
              <TabsTrigger value="system">System Templates</TabsTrigger>
            </TabsList>
            
            {['task', 'invoice', 'project', 'system'].map(type => (
              <TabsContent key={type} value={type}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredTemplates(type).length > 0 ? (
                      getFilteredTemplates(type).map(template => (
                        <TableRow key={template.id}>
                          <TableCell>
                            <div className="font-medium">{template.name}</div>
                            <Badge variant="outline" className={getTemplateBadgeColor(template.type)}>
                              {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{template.subject}</TableCell>
                          <TableCell>
                            <Badge variant={template.is_enabled ? 'default' : 'secondary'}>
                              {template.is_enabled ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePreviewTemplate(template)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditTemplate(template)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No templates found for this type
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        )}
        
        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Email Template</DialogTitle>
            </DialogHeader>
            
            {currentTemplate && (
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{currentTemplate.name}</h3>
                    <Badge variant="outline" className={getTemplateBadgeColor(currentTemplate.type)}>
                      {currentTemplate.type.charAt(0).toUpperCase() + currentTemplate.type.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label htmlFor="is_enabled">Active</Label>
                    <Switch
                      id="is_enabled"
                      checked={currentTemplate.is_enabled}
                      onCheckedChange={(checked) => 
                        setCurrentTemplate({...currentTemplate, is_enabled: checked})
                      }
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    value={currentTemplate.subject}
                    onChange={(e) => 
                      setCurrentTemplate({...currentTemplate, subject: e.target.value})
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="body">Email Body</Label>
                  <div className="text-xs text-muted-foreground mb-2">
                    You can use placeholders like {'{user_name}'}, {'{task_name}'}, etc.
                  </div>
                  <Textarea
                    id="body"
                    value={currentTemplate.body}
                    onChange={(e) => 
                      setCurrentTemplate({...currentTemplate, body: e.target.value})
                    }
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateTemplate} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Template
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Preview Dialog */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Email Template Preview</DialogTitle>
            </DialogHeader>
            
            {currentTemplate && (
              <div className="space-y-4 py-4">
                <div>
                  <h3 className="text-lg font-medium">{currentTemplate.name}</h3>
                  <Badge variant="outline" className={getTemplateBadgeColor(currentTemplate.type)}>
                    {currentTemplate.type.charAt(0).toUpperCase() + currentTemplate.type.slice(1)}
                  </Badge>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="border-b pb-2 mb-4">
                    <div className="font-semibold">Subject:</div>
                    <div>{currentTemplate.subject}</div>
                  </div>
                  
                  <div className="prose max-w-none">
                    {currentTemplate.body.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EmailTemplates;
