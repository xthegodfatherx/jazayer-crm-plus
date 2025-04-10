
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Estimates = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Estimates</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Estimate Management</CardTitle>
          <CardDescription>Create and manage client estimates</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Estimate management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Estimates;
