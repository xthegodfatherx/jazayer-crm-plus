
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Payments = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment Management</CardTitle>
          <CardDescription>View and manage all payments</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Payment management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
