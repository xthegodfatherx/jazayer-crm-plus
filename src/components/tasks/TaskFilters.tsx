
import React from 'react';
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
import { Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TaskFilters = () => {
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const availableTags = [
    'Design', 'Development', 'Frontend', 'Backend', 'API', 
    'Mobile', 'Documentation', 'Website', 'Security', 'Integration'
  ];

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
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
            <Input id="search" placeholder="Search tasks..." className="pl-8" />
          </div>
        </div>
        
        <div>
          <Label htmlFor="status" className="text-sm font-medium">
            Status
          </Label>
          <Select>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
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
          <Select>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
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
          <Select>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="All assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All assignees</SelectItem>
              <SelectItem value="ahmed">Ahmed Khalifi</SelectItem>
              <SelectItem value="selma">Selma Bouaziz</SelectItem>
              <SelectItem value="karim">Karim Mansouri</SelectItem>
              <SelectItem value="leila">Leila Benzema</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-sm font-medium">
            Rating
          </Label>
          <div className="mt-5">
            <Slider defaultValue={[0]} max={5} step={1} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Unrated</span>
            <span>5 stars</span>
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
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline">Reset Filters</Button>
        <Button>Apply Filters</Button>
      </div>
    </div>
  );
};

export default TaskFilters;
