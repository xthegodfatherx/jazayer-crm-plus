
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import apiClient from '@/services/api-client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'quarterly' | 'semi-annually' | 'annually';
  features: string[];
  is_active: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

const AdminSubscriptions = () => {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    billing_cycle: 'monthly' as Subscription['billing_cycle'],
    features: '',
    is_active: true
  });

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.get(`${API_URL}/subscriptions`);
        setSubscriptions(response.data.data);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        setError('Failed to load subscription plans. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscriptions();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleActiveChange = (active: boolean) => {
    setFormData(prev => ({ ...prev, is_active: active }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      billing_cycle: 'monthly',
      features: '',
      is_active: true
    });
  };

  const handleAddSubscription = async () => {
    setIsSubmitting(true);
    
    try {
      const featuresList = formData.features.split('\n').filter(feature => feature.trim() !== '');
      
      const response = await apiClient.post(`${API_URL}/subscriptions`, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        billing_cycle: formData.billing_cycle,
        features: featuresList,
        is_active: formData.is_active
      });
      
      const newSubscription = response.data.data;
      setSubscriptions(prev => [...prev, newSubscription]);
      
      resetForm();
      setIsAddDialogOpen(false);
      
      toast({
        title: "Subscription Added",
        description: `${newSubscription.name} subscription plan has been created.`,
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to create subscription plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubscription = async () => {
    if (!currentSubscription) return;
    
    setIsSubmitting(true);
    
    try {
      const featuresList = formData.features.split('\n').filter(feature => feature.trim() !== '');
      
      const response = await apiClient.put(`${API_URL}/subscriptions/${currentSubscription.id}`, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        billing_cycle: formData.billing_cycle,
        features: featuresList,
        is_active: formData.is_active
      });
      
      const updatedSubscription = response.data.data;
      
      setSubscriptions(prevSubscriptions => 
        prevSubscriptions.map(sub => 
          sub.id === currentSubscription.id ? updatedSubscription : sub
        )
      );
      
      setIsEditDialogOpen(false);
      setCurrentSubscription(null);
      resetForm();
      
      toast({
        title: "Subscription Updated",
        description: `${updatedSubscription.name} subscription plan has been updated.`,
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    const subscriptionToDelete = subscriptions.find(sub => sub.id === id);
    
    try {
      await apiClient.delete(`${API_URL}/subscriptions/${id}`);
      
      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
      
      toast({
        title: "Subscription Deleted",
        description: `${subscriptionToDelete?.name} subscription plan has been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast({
        title: "Error",
        description: "Failed to delete subscription plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditClick = (subscription: Subscription) => {
    setCurrentSubscription(subscription);
    setFormData({
      name: subscription.name,
      description: subscription.description,
      price: subscription.price.toString(),
      billing_cycle: subscription.billing_cycle,
      features: subscription.features.join('\n'),
      is_active: subscription.is_active
    });
    setIsEditDialogOpen(true);
  };

  const getBillingCycleText = (cycle: string) => {
    switch (cycle) {
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      case 'semi-annually': return 'Semi-Annually';
      case 'annually': return 'Annually';
      default: return cycle;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>Manage subscription plans for customers</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Subscription Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Basic Plan"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Short description of the plan"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                
                <div className="space-y-2">
                  <Label htmlFor="billing_cycle">Billing Cycle</Label>
                  <Select
                    value={formData.billing_cycle}
                    onValueChange={(value) => handleSelectChange('billing_cycle', value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="billing_cycle">
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line)</Label>
                <textarea
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  placeholder="Enter features, one per line"
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleActiveChange(e.target.checked)}
                  className="rounded"
                  disabled={isSubmitting}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleAddSubscription}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Subscription Plan'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                <TableHead>Price</TableHead>
                <TableHead>Billing Cycle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No subscription plans found. Create your first plan.
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map(subscription => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{subscription.name}</p>
                        <p className="text-sm text-muted-foreground">{subscription.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{subscription.price.toLocaleString()} DZD</TableCell>
                    <TableCell>{getBillingCycleText(subscription.billing_cycle)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        subscription.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {subscription.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(subscription)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSubscription(subscription.id)}
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
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Subscription Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Plan Name</Label>
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
                <Input
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                
                <div className="space-y-2">
                  <Label htmlFor="edit-billing_cycle">Billing Cycle</Label>
                  <Select
                    value={formData.billing_cycle}
                    onValueChange={(value) => handleSelectChange('billing_cycle', value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="edit-billing_cycle">
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-features">Features (one per line)</Label>
                <textarea
                  id="edit-features"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleActiveChange(e.target.checked)}
                  className="rounded"
                  disabled={isSubmitting}
                />
                <Label htmlFor="edit-is_active">Active</Label>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleEditSubscription}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Subscription Plan'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminSubscriptions;
