
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger, 
} from '@/components/ui/popover';
import { Search, Calendar as CalendarIcon, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { taskCategoriesApi } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';

export interface TaskFiltersProps {
  onFilter: (filters: any) => void;
}

interface TaskCategory {
  id: string;
  name: string;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ onFilter }) => {
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const { data } = await taskCategoriesApi.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching task categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleApplyFilters = () => {
    const filters: Record<string, any> = {};
    
    if (search) filters.search = search;
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (category) filters.category_id = category;
    if (dueDate) filters.due_date = format(dueDate, 'yyyy-MM-dd');
    
    onFilter(filters);
  };
  
  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setCategory('');
    setDueDate(undefined);
    onFilter({});
  };

  return (
    <div className="bg-card p-4 rounded-md space-y-4 border">
      <h3 className="text-lg font-medium mb-2">Filter Tasks</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              className="pl-8"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div>
          <Label htmlFor="due-date">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="due-date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Select date"}
                {dueDate && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setDueDate(undefined);
                    }}
                    className="ml-auto hover:bg-accent p-1 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" onClick={handleClearFilters}>Clear</Button>
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
      </div>
    </div>
  );
};

export default TaskFilters;
