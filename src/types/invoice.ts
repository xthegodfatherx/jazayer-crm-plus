
export type SectionType = 
  | 'header'
  | 'clientInfo'
  | 'invoiceInfo'
  | 'items'
  | 'summary'
  | 'notes'
  | 'terms'
  | 'payment'
  | 'footer';

export interface InvoiceSection {
  id: string;
  type: SectionType;
  title: string;
  content?: string;
  required: boolean;
  order: number;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  sections: InvoiceSection[];
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  showLogo: boolean;
}

export interface InvoiceStyle {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  showLogo: boolean;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  tax?: number;
  discount?: number;
  total: number;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  isActive: boolean;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  vatId?: string;
  logo?: string;
}

export interface Project {
  id: string;
  name: string;
  tasks?: {
    id: string;
    name: string;
    hours: number;
    rate: number;
  }[];
}

export interface Invoice {
  id: string;
  number: string;
  client: Client;
  project?: Project;
  issueDate: string;
  dueDate: string;
  items: LineItem[];
  notes?: string;
  terms?: string;
  paymentInstructions?: string;
  currency: Currency;
  status: InvoiceStatus;
  template: string;
  style?: InvoiceStyle;
  tax?: number;
  discount?: number;
  shipping?: number;
  total: number;
  paymentMethod?: string;
  recurringPeriod?: string;
}
