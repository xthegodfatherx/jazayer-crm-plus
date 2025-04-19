
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface Subscription {
  id: string;
  clientName: string;
  plan: string;
  amount: number;
  billingCycle: 'monthly' | 'quarterly' | 'annually';
  startDate: string;
  nextBillingDate: string;
  isActive: boolean;
}

const Subscriptions = () => {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { 
      id: '1', 
      clientName: 'TechCorp Algeria', 
      plan: 'Premium',
      amount: 1500, 
      billingCycle: 'monthly',
      startDate: '2025-01-15', 
      nextBillingDate: '2025-05-15',
      isActive: true
    },
    { 
      id: '2', 
      clientName: 'Digital Solutions', 
      plan: 'Basic',
      amount: 800, 
      billingCycle: 'quarterly',
      startDate: '2025-02-10', 
      nextBillingDate: '2025-05-10',
      isActive: true
    },
    { 
      id: '3', 
      clientName: 'Algiers Marketing', 
      plan: 'Enterprise',
      amount: 3500, 
      billingCycle: 'annually',
      startDate: '2025-03-01', 
      nextBillingDate: '2026-03-01',
      isActive: false
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [formData, setFormData] = useState({
    clientName: '',
    plan: '',
    amount: '',
    billingCycle: 'monthly' as Subscription['billingCycle'],
    startDate: '',
    nextBillingDate: '',
    isActive: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      plan: '',
      amount: '',
      billingCycle: 'monthly',
      startDate: '',
      nextBillingDate: '',
      isActive: true
    });
  };

  const handleAddSubscription = () => {
    const newSubscription: Subscription = {
      id: Date.now().toString(),
      clientName: formData.clientName,
      plan: formData.plan,
      amount: parseFloat(formData.amount),
      billingCycle: formData.billingCycle,
      startDate: formData.startDate,
      nextBillingDate: formData.nextBillingDate,
      isActive: formData.isActive
    };
    
    setSubscriptions(prev => [...prev, newSubscription]);
    resetForm();
    setIsAddDialogOpen(false);
    
    toast({
      title: "Subscription Added",
      description: `${newSubscription.clientName}'s subscription has been created.`,
    });
  };

  const handleEditClick = (subscription: Subscription) => {
    setCurrentSubscription(subscription);
    setFormData({
      clientName: subscription.clientName,
      plan: subscription.plan,
      amount: subscription.amount.toString(),
      billingCycle: subscription.billingCycle,
      startDate: subscription.startDate,
      nextBillingDate: subscription.nextBillingDate,
      isActive: subscription.isActive
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateSubscription = () => {
    if (!currentSubscription) return;
    
    const updatedSubscriptions = subscriptions.map(sub => 
      sub.id === currentSubscription.id 
        ? {
            ...sub,
            clientName: formData.clientName,
            plan: formData.plan,
            amount: parseFloat(formData.amount),
            billingCycle: formData.billingCycle,
            startDate: formData.startDate,
            nextBillingDate: formData.nextBillingDate,
            isActive: formData.isActive
          } 
        : sub
    );
    
    setSubscriptions(updatedSubscriptions);
    setIsEditDialogOpen(false);
    setCurrentSubscription(null);
    resetForm();
    
    toast({
      title: "Subscription Updated",
      description: `${formData.clientName}'s subscription has been updated.`,
    });
  };

  const handleDeleteSubscription = (id: string) => {
    const subscriptionToDelete = subscriptions.find(sub => sub.id === id);
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    
    toast({
      title: "Subscription Deleted",
      description: `${subscriptionToDelete?.clientName}'s subscription has been deleted.`,
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Subscription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subscription</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input 
                  id="clientName" 
                  name="clientName" 
                  value={formData.clientName} 
                  onChange={handleInputChange} 
                  placeholder="Client name" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan">Plan</Label>
                  <Input 
                    id="plan" 
                    name="plan" 
                    value={formData.plan} 
                    onChange={handleInputChange} 
                    placeholder="Basic, Premium, etc." 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (DZD)</Label>
                  <Input 
                    id="amount" 
                    name="amount" 
                    type="number" 
                    value={formData.amount} 
                    onChange={handleInputChange} 
                    placeholder="0.00" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billingCycle">Billing Cycle</Label>
                <Select 
                  value={formData.billingCycle} 
                  onValueChange={(value) => handleSelectChange('billingCycle', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select billing cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate" 
                    name="startDate" 
                    type="date" 
                    value={formData.startDate} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextBillingDate">Next Billing Date</Label>
                  <Input 
                    id="nextBillingDate" 
                    name="nextBillingDate" 
                    type="date" 
                    value={formData.nextBillingDate} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isActive" 
                  checked={formData.isActive} 
                  onCheckedChange={handleSwitchChange} 
                />
                <Label htmlFor="isActive">Active Subscription</Label>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={handleAddSubscription}>Create Subscription</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-primary" />
            Subscription Management
          </CardTitle>
          <CardDescription>Manage recurring client subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Billing Cycle</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No subscriptions found. Create your first subscription.
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map(subscription => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">{subscription.clientName}</TableCell>
                    <TableCell>{subscription.plan}</TableCell>
                    <TableCell>{subscription.amount.toLocaleString()} DZD</TableCell>
                    <TableCell>
                      <span className="capitalize">{subscription.billingCycle}</span>
                    </TableCell>
                    <TableCell>{new Date(subscription.nextBillingDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        subscription.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {subscription.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditClick(subscription)}
                        className="mr-1"
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
            <DialogTitle>Edit Subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-clientName">Client Name</Label>
              <Input 
                id="edit-clientName" 
                name="clientName" 
                value={formData.clientName} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-plan">Plan</Label>
                <Input 
                  id="edit-plan" 
                  name="plan" 
                  value={formData.plan} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount (DZD)</Label>
                <Input 
                  id="edit-amount" 
                  name="amount" 
                  type="number" 
                  value={formData.amount} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-billingCycle">Billing Cycle</Label>
              <Select 
                value={formData.billingCycle} 
                onValueChange={(value) => handleSelectChange('billingCycle', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input 
                  id="edit-startDate" 
                  name="startDate" 
                  type="date" 
                  value={formData.startDate} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-nextBillingDate">Next Billing Date</Label>
                <Input 
                  id="edit-nextBillingDate" 
                  name="nextBillingDate" 
                  type="date" 
                  value={formData.nextBillingDate} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="edit-isActive" 
                checked={formData.isActive} 
                onCheckedChange={handleSwitchChange} 
              />
              <Label htmlFor="edit-isActive">Active Subscription</Label>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button onClick={handleUpdateSubscription}>Update Subscription</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subscriptions;
