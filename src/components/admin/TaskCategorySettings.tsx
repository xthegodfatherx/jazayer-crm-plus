
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

export interface TaskCategory {
  id: string;
  name: string;
  pricing: {
    oneStar: number;
    twoStar: number;
    threeStar: number;
  };
}

const TaskCategorySettings = () => {
  const { userRole } = usePermissions();
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TaskCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    oneStar: '',
    twoStar: '',
    threeStar: ''
  });

  const canManageCategories = userRole === 'admin' || userRole === 'manager';

  // Load initial categories (would come from API in real app)
  useEffect(() => {
    // Sample initial categories
    const initialCategories: TaskCategory[] = [
      {
        id: 'web-design',
        name: 'Web Design',
        pricing: { oneStar: 10, twoStar: 20, threeStar: 30 }
      },
      {
        id: 'logo-design',
        name: 'Logo Design',
        pricing: { oneStar: 5, twoStar: 15, threeStar: 25 }
      },
      {
        id: 'video-editing',
        name: 'Video Editing',
        pricing: { oneStar: 15, twoStar: 25, threeStar: 35 }
      }
    ];
    
    setCategories(initialCategories);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCategory: TaskCategory = {
      id: editingCategory?.id || Date.now().toString(),
      name: formData.name,
      pricing: {
        oneStar: Number(formData.oneStar),
        twoStar: Number(formData.twoStar),
        threeStar: Number(formData.threeStar)
      }
    };

    if (editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? newCategory : cat
      ));
      toast({
        title: "Category Updated",
        description: `${newCategory.name} has been updated successfully.`
      });
    } else {
      setCategories([...categories, newCategory]);
      toast({
        title: "Category Created",
        description: `${newCategory.name} has been added successfully.`
      });
    }

    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', oneStar: '', twoStar: '', threeStar: '' });
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

  const handleDelete = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast({
      title: "Category Deleted",
      description: "The category has been removed successfully."
    });
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
            {categories.map(category => (
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TaskCategorySettings;
