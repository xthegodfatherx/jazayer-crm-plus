import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from '@/services/invoice-api';
import { formatCurrency } from '@/lib/utils';
import { Euro } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface InvoiceSummaryProps {
  invoices: Invoice[];
  loading?: boolean; // Added loading prop as optional
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ invoices, loading = false }) => {
  // Skip calculations if loading
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }
  
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(invoice => invoice.status === 'paid').length;
  const unpaidInvoices = invoices.filter(invoice => invoice.status === 'unpaid').length;
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInvoices}</div>
          <p className="text-sm text-muted-foreground">
            Total number of invoices
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-sm text-muted-foreground">
            Total revenue from all invoices
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paid Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{paidInvoices}</div>
          <p className="text-sm text-muted-foreground">
            Number of invoices that have been paid
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unpaid Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unpaidInvoices}</div>
          <p className="text-sm text-muted-foreground">
            Number of invoices that are still unpaid
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceSummary;
