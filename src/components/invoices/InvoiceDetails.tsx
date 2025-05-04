
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Invoice } from '@/services/invoices-api';
import { Separator } from '@/components/ui/separator';
import {
  Download,
  Mail,
  Printer,
  FileText,
  CreditCard,
  Calendar,
  Building,
  User
} from 'lucide-react';

interface InvoiceDetailsProps {
  invoice: Invoice;
  onUpdateInvoice?: (updatedInvoice: Invoice) => Promise<void>;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, onUpdateInvoice }) => {
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'outline';
      case 'pending':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const handleMarkAsPaid = async () => {
    if (!onUpdateInvoice) return;

    setLoading(true);
    try {
      await onUpdateInvoice({
        ...invoice,
        status: 'paid',
        payment_date: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to mark invoice as paid:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold">Invoice #{invoice.invoice_number}</h3>
          <p className="text-muted-foreground">
            Created: {formatDate(invoice.issued_date)}
          </p>
        </div>
        <Badge variant={getStatusBadgeVariant(invoice.status)}>
          {invoice.status.toUpperCase()}
        </Badge>
      </div>

      <Separator />

      {/* Invoice Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">From</h4>
            <p className="font-medium">Your Company</p>
            <p>123 Business Road</p>
            <p>Business City, ST 12345</p>
            <p>contact@yourcompany.com</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">To</h4>
            <p className="font-medium">{invoice.client?.name || 'Client Name'}</p>
            <p>{invoice.client?.address || 'Client Address'}</p>
            <p>{invoice.client?.email || 'client@example.com'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
              <p>{formatDate(invoice.issued_date)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Due Date</p>
              <p>{formatDate(invoice.due_date)}</p>
            </div>
          </div>

          {invoice.payment_date && (
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payment Date</p>
                <p>{formatDate(invoice.payment_date)}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Invoice Reference</p>
              <p>{invoice.reference || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Invoice Items */}
      <div>
        <h4 className="font-medium mb-2">Invoice Items</h4>
        <div className="border rounded-md">
          <div className="grid grid-cols-12 gap-2 p-2 bg-muted/50 text-sm font-medium">
            <div className="col-span-6">Item</div>
            <div className="col-span-2 text-right">Quantity</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          {invoice.items && invoice.items.length > 0 ? (
            invoice.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 p-2 text-sm border-t">
                <div className="col-span-6">{item.name}</div>
                <div className="col-span-2 text-right">{item.quantity}</div>
                <div className="col-span-2 text-right">${item.price?.toFixed(2)}</div>
                <div className="col-span-2 text-right">${(item.quantity * (item.price || 0)).toFixed(2)}</div>
              </div>
            ))
          ) : (
            <div className="p-2 text-sm text-muted-foreground">No items</div>
          )}
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-full max-w-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${invoice.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax ({invoice.tax_rate || 0}%)</span>
            <span>${invoice.tax_amount?.toFixed(2) || '0.00'}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${invoice.amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 justify-end">
        <Button variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="outline" size="sm">
          <Mail className="h-4 w-4 mr-2" />
          Email Invoice
        </Button>
        {invoice.status !== 'paid' && onUpdateInvoice && (
          <Button onClick={handleMarkAsPaid} disabled={loading} size="sm">
            <CreditCard className="h-4 w-4 mr-2" />
            {loading ? 'Processing...' : 'Mark as Paid'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetails;
