
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { InvoiceTemplate } from '@/types/invoice';

interface InvoiceTemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  templates: InvoiceTemplate[];
}

const InvoiceTemplateSelector: React.FC<InvoiceTemplateSelectorProps> = ({
  selectedTemplate,
  onSelectTemplate,
  templates
}) => {
  return (
    <RadioGroup 
      value={selectedTemplate} 
      onValueChange={onSelectTemplate}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {templates.map((template) => (
        <Card key={template.id} className={`relative overflow-hidden transition-all cursor-pointer border-2 ${selectedTemplate === template.id ? 'border-primary' : 'border-border'}`}>
          <CardContent className="p-0">
            <div className="absolute top-2 left-2 z-10">
              <RadioGroupItem value={template.id} id={`template-${template.id}`} className="sr-only" />
            </div>
            <Label 
              htmlFor={`template-${template.id}`} 
              className="block cursor-pointer h-full"
            >
              <div className="aspect-[210/297] bg-card relative overflow-hidden">
                <img 
                  src={template.previewImage} 
                  alt={template.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            </Label>
          </CardContent>
        </Card>
      ))}
    </RadioGroup>
  );
};

export default InvoiceTemplateSelector;
