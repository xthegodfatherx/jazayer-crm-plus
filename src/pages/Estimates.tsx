
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Calculator, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/services/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Estimate {
  id: string;
  number: string;
  clientName: string;
  amount: number;
  date: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

const Estimates = () => {
  const { toast } = useToast();
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEstimate, setCurrentEstimate] = useState<Estimate | null>(null);
  const [formData, setFormData] = useState({
    number: '',
    clientName: '',
    amount: '',
    date: '',
    status: 'draft' as Estimate['status']
  });

  useEffect(() => {
    const fetchEstimates = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.get(`${API_URL}/estimates`);
        setEstimates(response.data.data);
      } catch (error) {
        console.error('Error fetching estimates:', error);
        setError('Failed to load estimates. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEstimates();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as Estimate['status'] }));
  };

  const resetForm = () => {
    setFormData({
      number: '',
      clientName: '',
      amount: '',
      date: '',
      status: 'draft'
    });
  };

  const handleAddEstimate = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await apiClient.post(`${API_URL}/estimates`, {
        number: formData.number,
        client_name: formData.clientName,
        amount: parseFloat(formData.amount),
        date: formData.date,
        status: formData.status
      });
      
      const newEstimate = response.data.data;
      setEstimates(prev => [...prev, newEstimate]);
      
      resetForm();
      setIsAddDialogOpen(false);
      
      toast({
        title: "Estimate Added",
        description: `Estimate ${newEstimate.number} has been created.`,
      });
    } catch (error) {
      console.error('Error creating estimate:', error);
      toast({
        title: "Error",
        description: "Failed to create estimate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (estimate: Estimate) => {
    setCurrentEstimate(estimate);
    setFormData({
      number: estimate.number,
      clientName: estimate.clientName,
      amount: estimate.amount.toString(),
      date: estimate.date,
      status: estimate.status
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateEstimate = async () => {
    if (!currentEstimate) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await apiClient.put(`${API_URL}/estimates/${currentEstimate.id}`, {
        number: formData.number,
        client_name: formData.clientName,
        amount: parseFloat(formData.amount),
        date: formData.date,
        status: formData.status
      });
      
      const updatedEstimate = response.data.data;
      
      setEstimates(prevEstimates => 
        prevEstimates.map(est => 
          est.id === currentEstimate.id ? updatedEstimate : est
        )
      );
      
      setIsEditDialogOpen(false);
      setCurrentEstimate(null);
      resetForm();
      
      toast({
        title: "Estimate Updated",
        description: `Estimate ${updatedEstimate.number} has been updated.`,
      });
    } catch (error) {
      console.error('Error updating estimate:', error);
      toast({
        title: "Error",
        description: "Failed to update estimate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEstimate = async (id: string) => {
    const estimateToDelete = estimates.find(est => est.id === id);
    
    try {
      await apiClient.delete(`${API_URL}/estimates/${id}`);
      
      setEstimates(estimates.filter(est => est.id !== id));
      
      toast({
        title: "Estimate Deleted",
        description: `Estimate ${estimateToDelete?.number} has been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting estimate:', error);
      toast({
        title: "Error",
        description: "Failed to delete estimate. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Estimates</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Estimate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Estimate</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Estimate Number</Label>
                  <Input 
                    id="number" 
                    name="number" 
                    value={formData.number} 
                    onChange={handleInputChange} 
                    placeholder="EST-001" 
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    name="date" 
                    type="date" 
                    value={formData.date} 
                    onChange={handleInputChange} 
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input 
                  id="clientName" 
                  name="clientName" 
                  value={formData.clientName} 
                  onChange={handleInputChange} 
                  placeholder="Client name" 
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select disabled={isSubmitting} value={formData.status} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={handleAddEstimate} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Estimate'
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
            <Calculator className="h-5 w-5 mr-2 text-primary" />
            Estimate Management
          </CardTitle>
          <CardDescription>Create and manage client estimates</CardDescription>
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
                  <TableHead>Estimate #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount (DZD)</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estimates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No estimates found. Create your first estimate.
                    </TableCell>
                  </TableRow>
                ) : (
                  estimates.map(estimate => (
                    <TableRow key={estimate.id}>
                      <TableCell className="font-medium">{estimate.number}</TableCell>
                      <TableCell>{estimate.clientName}</TableCell>
                      <TableCell>{estimate.amount.toLocaleString()} DZD</TableCell>
                      <TableCell>{new Date(estimate.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          estimate.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                          estimate.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          estimate.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditClick(estimate)}
                          className="mr-1"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteEstimate(estimate.id)}
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
            <DialogTitle>Edit Estimate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-number">Estimate Number</Label>
                <Input 
                  id="edit-number" 
                  name="number" 
                  value={formData.number} 
                  onChange={handleInputChange} 
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input 
                  id="edit-date" 
                  name="date" 
                  type="date" 
                  value={formData.date} 
                  onChange={handleInputChange} 
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-clientName">Client Name</Label>
              <Input 
                id="edit-clientName" 
                name="clientName" 
                value={formData.clientName} 
                onChange={handleInputChange} 
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select disabled={isSubmitting} value={formData.status} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button onClick={handleUpdateEstimate} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Estimate'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Estimates;
