
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Subscriptions = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>Manage recurring client subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Subscription management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscriptions;
