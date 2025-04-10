
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, X, Pin, CalendarRange } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Task } from '@/pages/Tasks';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FilterOptions {
  status?: Task['status'];
  priority?: Task['priority'];
  assignee?: string;
  tags?: string[];
  searchQuery?: string;
  showPinned?: boolean;
  minRating?: number;
  project?: string;
  dueDate?: 'all' | 'today' | 'tomorrow' | 'overdue' | 'this-week';
}

interface TaskFiltersProps {
  onApplyFilters: (filters: FilterOptions) => void;
  projects: string[];
  assignees: string[];
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ 
  onApplyFilters,
  projects,
  assignees
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState<Task['status'] | ''>('');
  const [priority, setPriority] = useState<Task['priority'] | ''>('');
  const [assignee, setAssignee] = useState('');
  const [project, setProject] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [showPinned, setShowPinned] = useState(false);
  const [dueDate, setDueDate] = useState<'all' | 'today' | 'tomorrow' | 'overdue' | 'this-week'>('all');

  const availableTags = [
    'Design', 'Development', 'Frontend', 'Backend', 'API', 
    'Mobile', 'Documentation', 'Website', 'Security', 'Integration',
    'Payment', 'UI/UX', 'Testing', 'Database', 'DevOps'
  ];

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleApplyFilters = () => {
    const filters: FilterOptions = {};
    
    if (searchQuery) filters.searchQuery = searchQuery;
    if (status) filters.status = status as Task['status'];
    if (priority) filters.priority = priority as Task['priority'];
    if (assignee) filters.assignee = assignee;
    if (project) filters.project = project;
    if (selectedTags.length > 0) filters.tags = selectedTags;
    if (showPinned) filters.showPinned = true;
    if (minRating > 0) filters.minRating = minRating;
    if (dueDate !== 'all') filters.dueDate = dueDate;
    
    onApplyFilters(filters);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatus('');
    setPriority('');
    setAssignee('');
    setProject('');
    setSelectedTags([]);
    setShowPinned(false);
    setMinRating(0);
    setDueDate('all');
    
    onApplyFilters({});
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium mb-4">Filter Tasks</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="search" className="text-sm font-medium">
            Search
          </Label>
          <div className="relative mt-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              id="search" 
              placeholder="Search tasks..." 
              className="pl-8" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="status" className="text-sm font-medium">
            Status
          </Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="priority" className="text-sm font-medium">
            Priority
          </Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="assignee" className="text-sm font-medium">
            Assignee
          </Label>
          <Select value={assignee} onValueChange={setAssignee}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="All assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All assignees</SelectItem>
              {assignees.map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="project" className="text-sm font-medium">
            Project
          </Label>
          <Select value={project} onValueChange={setProject}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="All projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All projects</SelectItem>
              {projects.map(proj => (
                <SelectItem key={proj} value={proj}>{proj}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-sm font-medium">
            Due Date
          </Label>
          <RadioGroup className="mt-2" value={dueDate} onValueChange={(value: 'all' | 'today' | 'tomorrow' | 'overdue' | 'this-week') => setDueDate(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="r1" />
              <Label htmlFor="r1" className="text-sm">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="today" id="r2" />
              <Label htmlFor="r2" className="text-sm">Today</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tomorrow" id="r3" />
              <Label htmlFor="r3" className="text-sm">Tomorrow</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="overdue" id="r4" />
              <Label htmlFor="r4" className="text-sm">Overdue</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="this-week" id="r5" />
              <Label htmlFor="r5" className="text-sm">This Week</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label className="text-sm font-medium">
            Rating
          </Label>
          <div className="mt-5">
            <Slider 
              defaultValue={[0]} 
              max={5} 
              step={1} 
              value={[minRating]}
              onValueChange={(values) => setMinRating(values[0])}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Unrated</span>
            <span>{minRating} stars and up</span>
          </div>
        </div>
        
        <div>
          <Label htmlFor="tags" className="text-sm font-medium">
            Tags
          </Label>
          <Select onValueChange={addTag}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select tags" />
            </SelectTrigger>
            <SelectContent>
              {availableTags.map(tag => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedTags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-medium">
            Additional Filters
          </Label>
          <div className="space-y-3 mt-3">
            <div className="flex items-center space-x-2">
              <Switch 
                id="show-pinned" 
                checked={showPinned}
                onCheckedChange={setShowPinned}
              />
              <Label htmlFor="show-pinned" className="text-sm flex items-center">
                <Pin className="h-4 w-4 mr-1" /> Pinned Tasks Only
              </Label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
      </div>
    </div>
  );
};

export default TaskFilters;
