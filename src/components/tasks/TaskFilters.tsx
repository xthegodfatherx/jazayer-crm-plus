import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Task } from '@/pages/Tasks';
import { Slider } from '@/components/ui/slider';

interface FilterOptions {
  status?: Task['status'] | 'all-statuses';
  priority?: Task['priority'] | 'all-priorities';
  assignee?: string;
  tags?: string[];
  searchQuery?: string;
  showPinned?: boolean;
  minRating?: number;
  project?: string;
  dueDate?: 'all' | 'today' | 'tomorrow' | 'overdue' | 'this-week';
  onlyMyTasks?: boolean; // New property for showing only current user's tasks
}

interface TaskFiltersProps {
  onApplyFilters: (filters: FilterOptions) => void;
  projects?: string[];
  assignees?: string[];
  currentUser?: string; // Added current user prop
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ onApplyFilters, projects = [], assignees = [], currentUser }) => {
  // Use null instead of empty string for "all" values
  const [status, setStatus] = useState<Task['status'] | 'all-statuses' | null>('all-statuses');
  const [priority, setPriority] = useState<Task['priority'] | 'all-priorities' | null>('all-priorities');
  const [assignee, setAssignee] = useState<string | null>(null);
  const [project, setProject] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<'all' | 'today' | 'tomorrow' | 'overdue' | 'this-week'>('all');
  const [showPinned, setShowPinned] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [onlyMyTasks, setOnlyMyTasks] = useState(false); // New state for only my tasks filter

  // Common tag options
  const commonTags = ['Design', 'Frontend', 'Backend', 'Documentation', 'Bug', 'Feature', 'Mobile', 'Security'];

  const handleAddTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleApplyFilters = () => {
    const filters: FilterOptions = {};
    
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (assignee) filters.assignee = assignee;
    if (project) filters.project = project;
    if (dueDate !== 'all') filters.dueDate = dueDate;
    if (showPinned) filters.showPinned = showPinned;
    if (minRating > 0) filters.minRating = minRating;
    if (searchQuery) filters.searchQuery = searchQuery;
    if (selectedTags.length > 0) filters.tags = selectedTags;
    if (onlyMyTasks) filters.onlyMyTasks = onlyMyTasks;
    
    onApplyFilters(filters);
  };

  const handleClearFilters = () => {
    setStatus('all-statuses');
    setPriority('all-priorities');
    setAssignee(null);
    setProject(null);
    setDueDate('all');
    setShowPinned(false);
    setMinRating(0);
    setSearchQuery('');
    setSelectedTags([]);
    setOnlyMyTasks(false);
    
    onApplyFilters({});
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={status || 'all-statuses'} 
            onValueChange={(value: Task['status'] | 'all-statuses') => setStatus(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-statuses">All statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select 
            value={priority || 'all-priorities'} 
            onValueChange={(value: Task['priority'] | 'all-priorities') => setPriority(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-priorities">All priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="assignee">Assignee</Label>
          <Select value={assignee || undefined} onValueChange={setAssignee}>
            <SelectTrigger>
              <SelectValue placeholder="All assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-assignees">All assignees</SelectItem>
              {assignees?.map(assignee => (
                <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Select value={dueDate} onValueChange={(value: 'all' | 'today' | 'tomorrow' | 'overdue' | 'this-week') => setDueDate(value)}>
            <SelectTrigger>
              <SelectValue placeholder="All due dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All due dates</SelectItem>
              <SelectItem value="today">Due today</SelectItem>
              <SelectItem value="tomorrow">Due tomorrow</SelectItem>
              <SelectItem value="this-week">Due this week</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="project">Project</Label>
          <Select value={project || undefined} onValueChange={setProject}>
            <SelectTrigger>
              <SelectValue placeholder="All projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-projects">All projects</SelectItem>
              {projects?.map(project => (
                <SelectItem key={project} value={project}>{project}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="minRating">Minimum Rating</Label>
          <div className="pt-4">
            <Slider
              id="minRating"
              min={0}
              max={5}
              step={1}
              value={[minRating]}
              onValueChange={(value) => setMinRating(value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Any</span>
              <span>{minRating} ⭐ or higher</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="searchQuery">Search</Label>
          <Input
            id="searchQuery"
            placeholder="Search in title, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-2 grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="showPinned">Pinned Only</Label>
            <Switch
              id="showPinned"
              checked={showPinned}
              onCheckedChange={setShowPinned}
            />
          </div>
          
          {currentUser && (
            <div className="flex items-center justify-between">
              <Label htmlFor="onlyMyTasks">Only My Tasks</Label>
              <Switch
                id="onlyMyTasks"
                checked={onlyMyTasks}
                onCheckedChange={setOnlyMyTasks}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex">
          <Input
            placeholder="Add tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="rounded-r-none"
          />
          <Button 
            type="button"
            onClick={handleAddTag}
            className="rounded-l-none"
          >
            Add
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedTags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {commonTags
            .filter(tag => !selectedTags.includes(tag))
            .map(tag => (
              <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-secondary" onClick={() => setSelectedTags([...selectedTags, tag])}>
                {tag}
              </Badge>
            ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={handleClearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
        <Button onClick={handleApplyFilters}>
          <Check className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default TaskFilters;
