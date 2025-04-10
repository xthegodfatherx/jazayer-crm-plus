
import React from 'react';
import { InvoiceSection, InvoiceStyle } from '@/types/invoice';
import { format, parse } from 'date-fns';

interface InvoicePreviewProps {
  template: string;
  sections: InvoiceSection[];
  style: InvoiceStyle;
  client?: { id: string; name: string; };
  issueDate: string;
  dueDate: string;
  currency?: { code: string; name: string; symbol: string; };
  paymentMethod?: { id: string; name: string; isActive: boolean; };
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  template,
  sections,
  style,
  client,
  issueDate,
  dueDate,
  currency,
  paymentMethod,
}) => {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return format(parse(dateStr, 'yyyy-MM-dd', new Date()), 'PPP');
    } catch (error) {
      return dateStr;
    }
  };

  const renderSection = (section: InvoiceSection) => {
    switch (section.type) {
      case 'header':
        return (
          <div 
            className="p-4 rounded-t-md" 
            style={{ backgroundColor: `${style.secondaryColor}30` }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">INVOICE</h1>
                <p className="text-lg">#INV-2025-001</p>
              </div>
              {style.showLogo && (
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-400">LOGO</span>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'clientInfo':
        return (
          <div className="p-4 border-b">
            <h2 className="font-medium mb-2">Client Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-bold">{client?.name || 'Client Name'}</p>
                <p>Client Address Line 1</p>
                <p>Client Address Line 2</p>
              </div>
              <div>
                <p><span className="text-muted-foreground">Email:</span> client@example.com</p>
                <p><span className="text-muted-foreground">Phone:</span> +213 123 456 789</p>
                <p><span className="text-muted-foreground">VAT ID:</span> DZ123456789</p>
              </div>
            </div>
          </div>
        );
      
      case 'invoiceInfo':
        return (
          <div className="p-4 border-b">
            <h2 className="font-medium mb-2">Invoice Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><span className="text-muted-foreground">Issue Date:</span> {formatDate(issueDate)}</p>
                <p><span className="text-muted-foreground">Due Date:</span> {formatDate(dueDate)}</p>
              </div>
              <div>
                <p><span className="text-muted-foreground">Currency:</span> {currency?.name || 'Algerian Dinar'}</p>
                <p><span className="text-muted-foreground">Payment Method:</span> {paymentMethod?.name || 'Bank Transfer'}</p>
              </div>
            </div>
          </div>
        );
      
      case 'items':
        return (
          <div className="p-4 border-b">
            <h2 className="font-medium mb-2">{section.title}</h2>
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Description</th>
                  <th className="text-right py-2">Quantity</th>
                  <th className="text-right py-2">Unit Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Web Application Development</td>
                  <td className="text-right py-2">1</td>
                  <td className="text-right py-2">{currency?.symbol || 'DZD'} 50,000</td>
                  <td className="text-right py-2">{currency?.symbol || 'DZD'} 50,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">UI/UX Design</td>
                  <td className="text-right py-2">1</td>
                  <td className="text-right py-2">{currency?.symbol || 'DZD'} 25,000</td>
                  <td className="text-right py-2">{currency?.symbol || 'DZD'} 25,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      
      case 'summary':
        return (
          <div className="p-4 border-b">
            <div className="flex justify-end">
              <div className="w-1/2">
                <div className="flex justify-between py-1">
                  <span>Subtotal:</span>
                  <span>{currency?.symbol || 'DZD'} 75,000</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Tax (19%):</span>
                  <span>{currency?.symbol || 'DZD'} 14,250</span>
                </div>
                <div className="flex justify-between py-1 border-t font-bold mt-2 pt-2">
                  <span>Total:</span>
                  <span>{currency?.symbol || 'DZD'} 89,250</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'notes':
        return (
          <div className="p-4 border-b">
            <h2 className="font-medium mb-2">Notes</h2>
            <p className="text-muted-foreground">{section.content || 'No notes provided.'}</p>
          </div>
        );
      
      case 'terms':
        return (
          <div className="p-4 border-b">
            <h2 className="font-medium mb-2">Terms & Conditions</h2>
            <p className="text-muted-foreground">{section.content || 'Standard terms and conditions apply.'}</p>
          </div>
        );
      
      case 'payment':
        return (
          <div className="p-4 border-b">
            <h2 className="font-medium mb-2">Payment Instructions</h2>
            <div>
              <p><span className="font-medium">Bank Transfer:</span> Account #123456789</p>
              <p><span className="font-medium">CIB/EDAHABIA:</span> Card #4111 XXXX XXXX 1111</p>
              <p><span className="font-medium">CCP/BaridiMob:</span> Account #0123456</p>
            </div>
          </div>
        );
      
      case 'footer':
        return (
          <div 
            className="p-4 rounded-b-md text-center text-sm text-muted-foreground"
            style={{ backgroundColor: `${style.secondaryColor}30` }}
          >
            <p>Thank you for your business!</p>
            <p>Company Name • Address • Phone • Email</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      className={`border rounded-md shadow-sm max-w-4xl mx-auto ${style.fontFamily}`}
      style={{ borderColor: style.primaryColor }}
    >
      {sortedSections.map(section => (
        <div key={section.id}>{renderSection(section)}</div>
      ))}
    </div>
  );
};
