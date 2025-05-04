
import React, { useState, useEffect } from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { taskCategoriesApi } from '@/services/api';
import type { Database } from '@/integrations/supabase/types';
import { Skeleton } from '@/components/ui/skeleton';

type TaskCategory = Database['public']['Tables']['task_categories']['Row'];

const TaskCategoryManagement = () => {
  const { userRole } = usePermissions();
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<TaskCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price_1_star: '',
    price_2_star: '',
    price_3_star: ''
  });

  const canManageCategories = userRole === 'admin' || userRole === 'manager';
  
  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      if (!canManageCategories) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const response = await taskCategoriesApi.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, [canManageCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData = {
      name: formData.name,
      price_1_star: Number(formData.price_1_star),
      price_2_star: Number(formData.price_2_star),
      price_3_star: Number(formData.price_3_star),
    };
    
    try {
      setIsLoading(true);
      if (editingCategory) {
        const { data } = await taskCategoriesApi.update(editingCategory.id, categoryData);
        if (data) {
          setCategories(categories.map(cat => 
            cat.id === editingCategory.id ? data : cat
          ));
          
          toast({
            title: "Category Updated",
            description: `${data.name} has been updated successfully.`
          });
        }
      } else {
        const { data } = await taskCategoriesApi.create(categoryData);
        if (data) {
          setCategories([...categories, data]);
          
          toast({
            title: "Category Created",
            description: `${data.name} has been added successfully.`
          });
        }
      }

      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', price_1_star: '', price_2_star: '', price_3_star: '' });
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: "Failed to save category. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: TaskCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      price_1_star: category.price_1_star?.toString() || '',
      price_2_star: category.price_2_star?.toString() || '',
      price_3_star: category.price_3_star?.toString() || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    try {
      setIsLoading(true);
      await taskCategoriesApi.delete(categoryId);
      setCategories(categories.filter(cat => cat.id !== categoryId));
      toast({
        title: "Category Deleted",
        description: "The category has been removed successfully."
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!canManageCategories) {
    return <div className="p-4 text-center text-muted-foreground">
      You don't have permission to manage task categories.
    </div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Task Categories</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingCategory(null);
                setFormData({ name: '', price_1_star: '', price_2_star: '', price_3_star: '' });
              }}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Logo Design"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_1_star">1-Star Price</Label>
                <Input
                  id="price_1_star"
                  type="number"
                  value={formData.price_1_star}
                  onChange={e => setFormData({...formData, price_1_star: e.target.value})}
                  placeholder="Price for 1-star rating"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_2_star">2-Star Price</Label>
                <Input
                  id="price_2_star"
                  type="number"
                  value={formData.price_2_star}
                  onChange={e => setFormData({...formData, price_2_star: e.target.value})}
                  placeholder="Price for 2-star rating"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_3_star">3-Star Price</Label>
                <Input
                  id="price_3_star"
                  type="number"
                  value={formData.price_3_star}
                  onChange={e => setFormData({...formData, price_3_star: e.target.value})}
                  placeholder="Price for 3-star rating"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading && !error && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        )}
        
        {error && (
          <div className="text-center py-4 text-red-500">
            {error}
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => {
                const fetchCategories = async () => {
                  setIsLoading(true);
                  setError(null);
                  try {
                    const response = await taskCategoriesApi.getAll();
                    setCategories(response.data);
                  } catch (error) {
                    console.error('Failed to fetch categories:', error);
                    setError('Failed to load categories. Please try again later.');
                  } finally {
                    setIsLoading(false);
                  }
                };
                
                fetchCategories();
              }}
            >
              Try Again
            </Button>
          </div>
        )}
        
        {!isLoading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>1-Star Price</TableHead>
                <TableHead>2-Star Price</TableHead>
                <TableHead>3-Star Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No categories found. Add your first category!</TableCell>
                </TableRow>
              ) : (
                categories.map(category => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>${category.price_1_star}</TableCell>
                    <TableCell>${category.price_2_star}</TableCell>
                    <TableCell>${category.price_3_star}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                          disabled={isLoading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCategoryManagement;
