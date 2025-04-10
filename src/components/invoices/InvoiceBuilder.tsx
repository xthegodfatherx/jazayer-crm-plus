
import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, Edit, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InvoiceSection, InvoiceStyle, SectionType } from '@/types/invoice';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SortableSectionProps {
  section: InvoiceSection;
  style: InvoiceStyle;
  onEdit: (id: string, field: string, value: any) => void;
  onDelete: (id: string) => void;
}

const SortableSection: React.FC<SortableSectionProps> = ({ section, style, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(section.title);

  const handleSave = () => {
    onEdit(section.id, 'title', editValue);
    setEditing(false);
  };

  const sectionStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: section.type === 'header' || section.type === 'footer' ? style.secondaryColor + '20' : undefined,
    borderColor: section.type === 'items' || section.type === 'summary' ? style.primaryColor + '40' : undefined,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={sectionStyle}
      className={`mb-4 border ${section.required ? 'border-dashed border-muted-foreground/40' : ''}`}
    >
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          {editing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-8 w-40"
                autoFocus
              />
              <Button size="icon" variant="ghost" onClick={handleSave}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setEditing(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <CardTitle className="text-base">{section.title}</CardTitle>
          )}
          {section.required && (
            <span className="text-xs text-muted-foreground">(Required)</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!section.required && (
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onDelete(section.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditing(true)}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {section.type === 'notes' || section.type === 'terms' ? (
          <Textarea
            placeholder={`Enter ${section.title.toLowerCase()} here...`}
            value={section.content || ''}
            onChange={(e) => onEdit(section.id, 'content', e.target.value)}
            className="min-h-24"
          />
        ) : (
          <div className="h-16 flex items-center justify-center border border-dashed rounded-md bg-muted/40 text-muted-foreground">
            {section.type} section
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface InvoiceBuilderProps {
  sections: InvoiceSection[];
  onSectionsChange: (sections: InvoiceSection[]) => void;
  style: InvoiceStyle;
  onStyleChange: (style: InvoiceStyle) => void;
}

const AVAILABLE_SECTIONS: Record<string, { title: string, type: SectionType }> = {
  notes: { title: 'Notes', type: 'notes' },
  terms: { title: 'Terms & Conditions', type: 'terms' },
  payment: { title: 'Payment Instructions', type: 'payment' },
};

const FONTS = [
  { value: 'inter', label: 'Inter (Sans-serif)' },
  { value: 'merriweather', label: 'Merriweather (Serif)' },
  { value: 'montserrat', label: 'Montserrat (Modern)' },
  { value: 'poppins', label: 'Poppins (Clean)' },
  { value: 'roboto', label: 'Roboto (Classic)' },
];

const InvoiceBuilder: React.FC<InvoiceBuilderProps> = ({ 
  sections, 
  onSectionsChange,
  style,
  onStyleChange
}) => {
  const [expandedPanel, setExpandedPanel] = useState<string | null>('layout');
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeIndex = sections.findIndex(s => s.id === active.id);
      const overIndex = sections.findIndex(s => s.id === over.id);
      
      const newSections = [...sections];
      const movedItem = newSections.splice(activeIndex, 1)[0];
      newSections.splice(overIndex, 0, movedItem);
      
      // Update order property based on new positions
      const updatedSections = newSections.map((section, idx) => ({
        ...section,
        order: idx + 1
      }));
      
      onSectionsChange(updatedSections);
    }
  };

  const addSection = (type: SectionType) => {
    const newSection: InvoiceSection = {
      id: `section-${Date.now()}`,
      type,
      title: AVAILABLE_SECTIONS[type].title,
      required: false,
      order: sections.length + 1
    };
    
    onSectionsChange([...sections, newSection]);
  };

  const editSection = (id: string, field: string, value: any) => {
    const updatedSections = sections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    );
    
    onSectionsChange(updatedSections);
  };

  const deleteSection = (id: string) => {
    const updatedSections = sections
      .filter(section => section.id !== id)
      .map((section, idx) => ({ ...section, order: idx + 1 }));
    
    onSectionsChange(updatedSections);
  };

  const handleStyleChange = (field: keyof InvoiceStyle, value: any) => {
    onStyleChange({
      ...style,
      [field]: value
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={sections.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map(section => (
              <SortableSection 
                key={section.id} 
                section={section} 
                style={style}
                onEdit={editSection} 
                onDelete={deleteSection} 
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setExpandedPanel(expandedPanel === 'layout' ? null : 'layout')}
              >
                <h3 className="text-lg font-medium">Invoice Layout</h3>
                <Button variant="ghost" size="icon">
                  {expandedPanel === 'layout' ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {expandedPanel === 'layout' && (
                <div className="space-y-4 mt-4">
                  <p className="text-sm text-muted-foreground">Add sections to your invoice:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(AVAILABLE_SECTIONS).map(([key, { title, type }]) => (
                      <Button 
                        key={key} 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => addSection(type)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setExpandedPanel(expandedPanel === 'style' ? null : 'style')}
              >
                <h3 className="text-lg font-medium">Style</h3>
                <Button variant="ghost" size="icon">
                  {expandedPanel === 'style' ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {expandedPanel === 'style' && (
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <p className="text-sm">Primary Color</p>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-10 h-10 p-0 rounded"
                            style={{ backgroundColor: style.primaryColor }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-none">
                          <HexColorPicker 
                            color={style.primaryColor} 
                            onChange={(color) => handleStyleChange('primaryColor', color)}
                          />
                        </PopoverContent>
                      </Popover>
                      <Input 
                        value={style.primaryColor} 
                        onChange={(e) => handleStyleChange('primaryColor', e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm">Secondary Color</p>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-10 h-10 p-0 rounded"
                            style={{ backgroundColor: style.secondaryColor }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-none">
                          <HexColorPicker 
                            color={style.secondaryColor} 
                            onChange={(color) => handleStyleChange('secondaryColor', color)}
                          />
                        </PopoverContent>
                      </Popover>
                      <Input 
                        value={style.secondaryColor} 
                        onChange={(e) => handleStyleChange('secondaryColor', e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm">Font</p>
                    <Select 
                      value={style.fontFamily} 
                      onValueChange={(value) => handleStyleChange('fontFamily', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        {FONTS.map((font) => (
                          <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Switch 
                        id="show-logo" 
                        checked={style.showLogo} 
                        onCheckedChange={(checked) => handleStyleChange('showLogo', checked)} 
                      />
                      <Label htmlFor="show-logo">Show Logo</Label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceBuilder;
