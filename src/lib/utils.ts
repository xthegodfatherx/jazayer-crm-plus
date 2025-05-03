
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'DZD'): string {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateTime(dateString: string, format: 'date' | 'time' | 'datetime' = 'datetime'): string {
  const date = new Date(dateString);
  
  switch (format) {
    case 'date':
      return date.toLocaleDateString();
    case 'time':
      return date.toLocaleTimeString();
    default:
      return date.toLocaleString();
  }
}

export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength 
    ? text.slice(0, maxLength) + '...' 
    : text;
}
