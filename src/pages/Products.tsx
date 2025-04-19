
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

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

const Products = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([
    { 
      id: '1', 
      name: 'Business Card Design',
      description: 'Professional business card design service including print-ready files',
      sku: 'CARD-001', 
      price: 3500, 
      category: 'Design',
      inStock: true,
      stockQuantity: 999
    },
    { 
      id: '2', 
      name: 'Website Maintenance (Monthly)',
      description: 'Monthly website maintenance package including updates and security monitoring',
      sku: 'WEB-MAINT-001', 
      price: 5000, 
      category: 'Service',
      inStock: true,
      stockQuantity: 999
    },
    { 
      id: '3', 
      name: 'Logo Design',
      description: 'Custom logo design with unlimited revisions and source files',
      sku: 'LOGO-001', 
      price: 12000, 
      category: 'Design',
      inStock: true,
      stockQuantity: 999
    }
  ]);
  
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

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      sku: formData.sku,
      price: parseFloat(formData.price),
      category: formData.category,
      inStock: formData.inStock,
      stockQuantity: parseInt(formData.stockQuantity)
    };
    
    setProducts(prev => [...prev, newProduct]);
    resetForm();
    setIsAddDialogOpen(false);
    
    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added to your product catalog.`,
    });
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

  const handleUpdateProduct = () => {
    if (!currentProduct) return;
    
    const updatedProducts = products.map(prod => 
      prod.id === currentProduct.id 
        ? {
            ...prod,
            name: formData.name,
            description: formData.description,
            sku: formData.sku,
            price: parseFloat(formData.price),
            category: formData.category,
            inStock: formData.inStock,
            stockQuantity: parseInt(formData.stockQuantity)
          } 
        : prod
    );
    
    setProducts(updatedProducts);
    setIsEditDialogOpen(false);
    setCurrentProduct(null);
    resetForm();
    
    toast({
      title: "Product Updated",
      description: `${formData.name} has been updated.`,
    });
  };

  const handleDeleteProduct = (id: string) => {
    const productToDelete = products.find(product => product.id === id);
    setProducts(products.filter(product => product.id !== id));
    
    toast({
      title: "Product Deleted",
      description: `${productToDelete?.name} has been deleted from your catalog.`,
    });
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
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="inStock" 
                  checked={formData.inStock} 
                  onCheckedChange={handleSwitchChange} 
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
                  />
                </div>
              )}
              
              <div className="flex justify-end pt-4">
                <Button onClick={handleAddProduct}>Add Product</Button>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input 
                  id="edit-category" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange} 
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
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="edit-inStock" 
                checked={formData.inStock} 
                onCheckedChange={handleSwitchChange} 
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
                />
              </div>
            )}
            
            <div className="flex justify-end pt-4">
              <Button onClick={handleUpdateProduct}>Update Product</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
