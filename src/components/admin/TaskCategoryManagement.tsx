
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

interface TaskCategory {
  id: string;
  name: string;
  pricing: {
    oneStar: number;
    twoStar: number;
    threeStar: number;
  };
}

const TaskCategoryManagement = () => {
  const { userRole } = usePermissions();
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TaskCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    oneStar: '',
    twoStar: '',
    threeStar: ''
  });

  const canManageCategories = userRole === 'admin' || userRole === 'manager';
  
  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      if (!canManageCategories) return;
      
      setIsLoading(true);
      try {
        const response = await taskCategoriesApi.getAll();
        // Transform response data to match our frontend model if needed
        const transformedData = response.data.map((item: any) => ({
          id: item.id.toString(),
          name: item.name,
          pricing: {
            oneStar: item.price_1_star,
            twoStar: item.price_2_star,
            threeStar: item.price_3_star
          }
        }));
        setCategories(transformedData);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Toast error is handled by API interceptor
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
      price_1_star: Number(formData.oneStar),
      price_2_star: Number(formData.twoStar),
      price_3_star: Number(formData.threeStar),
    };
    
    try {
      if (editingCategory) {
        const response = await taskCategoriesApi.update(editingCategory.id, categoryData);
        const updatedCategory = {
          id: response.data.id.toString(),
          name: response.data.name,
          pricing: {
            oneStar: response.data.price_1_star,
            twoStar: response.data.price_2_star,
            threeStar: response.data.price_3_star
          }
        };
        
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id ? updatedCategory : cat
        ));
        
        toast({
          title: "Category Updated",
          description: `${response.data.name} has been updated successfully.`
        });
      } else {
        const response = await taskCategoriesApi.create(categoryData);
        const newCategory = {
          id: response.data.id.toString(),
          name: response.data.name,
          pricing: {
            oneStar: response.data.price_1_star,
            twoStar: response.data.price_2_star,
            threeStar: response.data.price_3_star
          }
        };
        
        setCategories([...categories, newCategory]);
        
        toast({
          title: "Category Created",
          description: `${response.data.name} has been added successfully.`
        });
      }

      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', oneStar: '', twoStar: '', threeStar: '' });
    } catch (error) {
      console.error('Error saving category:', error);
      // Toast error is handled by API interceptor
    }
  };

  const handleEdit = (category: TaskCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      oneStar: category.pricing.oneStar.toString(),
      twoStar: category.pricing.twoStar.toString(),
      threeStar: category.pricing.threeStar.toString()
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await taskCategoriesApi.delete(categoryId);
      setCategories(categories.filter(cat => cat.id !== categoryId));
      toast({
        title: "Category Deleted",
        description: "The category has been removed successfully."
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      // Toast error is handled by API interceptor
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
            <Button onClick={() => {
              setEditingCategory(null);
              setFormData({ name: '', oneStar: '', twoStar: '', threeStar: '' });
            }}>
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
                <Label htmlFor="oneStar">1-Star Price</Label>
                <Input
                  id="oneStar"
                  type="number"
                  value={formData.oneStar}
                  onChange={e => setFormData({...formData, oneStar: e.target.value})}
                  placeholder="Price for 1-star rating"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twoStar">2-Star Price</Label>
                <Input
                  id="twoStar"
                  type="number"
                  value={formData.twoStar}
                  onChange={e => setFormData({...formData, twoStar: e.target.value})}
                  placeholder="Price for 2-star rating"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threeStar">3-Star Price</Label>
                <Input
                  id="threeStar"
                  type="number"
                  value={formData.threeStar}
                  onChange={e => setFormData({...formData, threeStar: e.target.value})}
                  placeholder="Price for 3-star rating"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading categories...</div>
        ) : (
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
                    <TableCell>${category.pricing.oneStar}</TableCell>
                    <TableCell>${category.pricing.twoStar}</TableCell>
                    <TableCell>${category.pricing.threeStar}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category.id)}
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
