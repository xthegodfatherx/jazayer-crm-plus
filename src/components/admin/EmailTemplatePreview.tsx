
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmailTemplatePreviewProps {
  template: string;
  subject?: string;
  className?: string;
}

const EmailTemplatePreview: React.FC<EmailTemplatePreviewProps> = ({ 
  template, 
  subject,
  className
}) => {
  // Function to replace template variables with example values
  const processTemplate = (html: string) => {
    // Replace common template variables with sample values
    return html
      .replace(/{{user_name}}/g, 'John Doe')
      .replace(/{{user_email}}/g, 'john.doe@example.com')
      .replace(/{{company_name}}/g, 'Acme Inc.')
      .replace(/{{invoice_number}}/g, 'INV-2023-001')
      .replace(/{{amount}}/g, '$ 1,250.00')
      .replace(/{{due_date}}/g, '2023-12-31')
      .replace(/{{task_name}}/g, 'Complete project proposal')
      .replace(/{{project_name}}/g, 'Website Redesign')
      .replace(/{{client_name}}/g, 'XYZ Corporation')
      .replace(/{{verification_code}}/g, '135792')
      .replace(/{{reset_link}}/g, '#example-reset-link')
      .replace(/{{login_url}}/g, '#example-login-url')
      .replace(/{{task_url}}/g, '#example-task-url')
      .replace(/{{invoice_url}}/g, '#example-invoice-url')
      .replace(/{{project_url}}/g, '#example-project-url');
  };

  // If there's no template content, show a default placeholder
  if (!template) {
    return (
      <div className={cn("flex items-center justify-center p-8 border border-dashed rounded-md", className)}>
        <p className="text-muted-foreground">No template content available</p>
      </div>
    );
  }

  // Process the template to replace variables
  const processedTemplate = processTemplate(template);
  
  return (
    <div className={cn("border rounded-md overflow-hidden bg-white shadow-sm", className)}>
      {/* Email header mockup */}
      <div className="bg-gray-100 border-b px-4 py-2">
        <div className="text-sm text-gray-500">From: <span className="text-gray-700">support@acmeinc.com</span></div>
        <div className="text-sm text-gray-500">To: <span className="text-gray-700">john.doe@example.com</span></div>
        <div className="text-sm text-gray-500">Subject: <span className="font-medium text-gray-800">{processTemplate(subject || '')}</span></div>
      </div>
      
      {/* Email content */}
      <div className="p-6 max-h-[500px] overflow-y-auto">
        <div
          dangerouslySetInnerHTML={{ __html: processedTemplate }}
          className="prose max-w-none"
        />
      </div>
      
      {/* Email footer mockup */}
      <div className="bg-gray-50 border-t p-3 flex justify-between items-center">
        <div className="text-xs text-gray-500">This is a preview of how the email will appear to recipients</div>
        <div>
          <Button variant="outline" size="sm" disabled>Reply</Button>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplatePreview;
