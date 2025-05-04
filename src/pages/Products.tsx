
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Package, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/services/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  category: string;
  inStock: boolean;
  stockQuantity: number;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

const Products = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    category: '',
    inStock: true,
    stockQuantity: '999'
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.get(`${API_URL}/products`);
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, inStock: checked }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      sku: '',
      price: '',
      category: '',
      inStock: true,
      stockQuantity: '999'
    });
  };

  const handleAddProduct = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await apiClient.post(`${API_URL}/products`, {
        name: formData.name,
        description: formData.description,
        sku: formData.sku,
        price: parseFloat(formData.price),
        category: formData.category,
        in_stock: formData.inStock,
        stock_quantity: parseInt(formData.stockQuantity)
      });
      
      const newProduct = response.data.data;
      setProducts(prev => [...prev, newProduct]);
      
      resetForm();
      setIsAddDialogOpen(false);
      
      toast({
        title: "Product Added",
        description: `${newProduct.name} has been added to your product catalog.`,
      });
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      sku: product.sku,
      price: product.price.toString(),
      category: product.category,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity.toString()
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!currentProduct) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await apiClient.put(`${API_URL}/products/${currentProduct.id}`, {
        name: formData.name,
        description: formData.description,
        sku: formData.sku,
        price: parseFloat(formData.price),
        category: formData.category,
        in_stock: formData.inStock,
        stock_quantity: parseInt(formData.stockQuantity)
      });
      
      const updatedProduct = response.data.data;
      
      setProducts(prevProducts => 
        prevProducts.map(prod => 
          prod.id === currentProduct.id ? updatedProduct : prod
        )
      );
      
      setIsEditDialogOpen(false);
      setCurrentProduct(null);
      resetForm();
      
      toast({
        title: "Product Updated",
        description: `${updatedProduct.name} has been updated.`,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const productToDelete = products.find(product => product.id === id);
    
    try {
      await apiClient.delete(`${API_URL}/products/${id}`);
      
      setProducts(products.filter(product => product.id !== id));
      
      toast({
        title: "Product Deleted",
        description: `${productToDelete?.name} has been deleted from your catalog.`,
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Product name" 
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="Product description" 
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input 
                    id="sku" 
                    name="sku" 
                    value={formData.sku} 
                    onChange={handleInputChange} 
                    placeholder="SKU-001" 
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category" 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange} 
                    placeholder="Product category" 
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (DZD)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  value={formData.price} 
                  onChange={handleInputChange} 
                  placeholder="0.00" 
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="inStock" 
                  checked={formData.inStock} 
                  onCheckedChange={handleSwitchChange} 
                  disabled={isSubmitting}
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
              
              {formData.inStock && (
                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input 
                    id="stockQuantity" 
                    name="stockQuantity" 
                    type="number" 
                    value={formData.stockQuantity} 
                    onChange={handleInputChange} 
                    placeholder="0" 
                    disabled={isSubmitting}
                  />
                </div>
              )}
              
              <div className="flex justify-end pt-4">
                <Button onClick={handleAddProduct} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Product'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-primary" />
            Product Management
          </CardTitle>
          <CardDescription>Manage your product catalog</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}
          
          {!isLoading && error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {!isLoading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No products found. Add your first product.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p>{product.name}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {product.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.price.toLocaleString()} DZD</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditClick(product)}
                          className="mr-1"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Product Name</Label>
              <Input 
                id="edit-name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange}
                rows={3}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sku">SKU</Label>
                <Input 
                  id="edit-sku" 
                  name="sku" 
                  value={formData.sku} 
                  onChange={handleInputChange}
                  disabled={isSubmitting} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input 
                  id="edit-category" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange}
                  disabled={isSubmitting} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price (DZD)</Label>
              <Input 
                id="edit-price" 
                name="price" 
                type="number" 
                value={formData.price} 
                onChange={handleInputChange}
                disabled={isSubmitting} 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="edit-inStock" 
                checked={formData.inStock} 
                onCheckedChange={handleSwitchChange}
                disabled={isSubmitting} 
              />
              <Label htmlFor="edit-inStock">In Stock</Label>
            </div>
            
            {formData.inStock && (
              <div className="space-y-2">
                <Label htmlFor="edit-stockQuantity">Stock Quantity</Label>
                <Input 
                  id="edit-stockQuantity" 
                  name="stockQuantity" 
                  type="number" 
                  value={formData.stockQuantity} 
                  onChange={handleInputChange}
                  disabled={isSubmitting} 
                />
              </div>
            )}
            
            <div className="flex justify-end pt-4">
              <Button onClick={handleUpdateProduct} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Product'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
