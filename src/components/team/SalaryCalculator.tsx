import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { teamApi } from '@/services/team-api';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

interface SalaryData {
  gross_salary: number;
  tax_deductions: number;
  net_salary: number;
  hourly_rate?: number;
  hours_worked?: number;
  overtime_hours?: number;
  overtime_rate?: number;
  bonus?: number;
  deductions?: number;
}

const SalaryCalculator = ({ memberId }) => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const calculateSalary = async () => {
    if (!month || !year) {
      toast({
        title: "Missing Information",
        description: "Please select both month and year",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await teamApi.calculateSalary(memberId, `${year}-${month}`);
      setSalaryData(data);
    } catch (error) {
      console.error('Error calculating salary:', error);
      toast({
        title: "Error",
        description: "Failed to calculate salary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="month">Month</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger id="month">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="year">Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger id="year">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={calculateSalary} disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate Salary'}
        </Button>

        {salaryData && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Salary Details</h3>
            <div className="space-y-2">
              <p>Gross Salary: {formatCurrency(salaryData.gross_salary)}</p>
              <p>Tax Deductions: {formatCurrency(salaryData.tax_deductions)}</p>
              <p>Net Salary: {formatCurrency(salaryData.net_salary)}</p>
              {salaryData.hourly_rate !== undefined && (
                <p>Hourly Rate: {formatCurrency(salaryData.hourly_rate)}</p>
              )}
              {salaryData.hours_worked !== undefined && (
                <p>Hours Worked: {salaryData.hours_worked}</p>
              )}
               {salaryData.overtime_hours !== undefined && (
                <p>Overtime Hours: {salaryData.overtime_hours}</p>
              )}
              {salaryData.overtime_rate !== undefined && (
                <p>Overtime Rate: {formatCurrency(salaryData.overtime_rate)}</p>
              )}
              {salaryData.bonus !== undefined && (
                <p>Bonus: {formatCurrency(salaryData.bonus)}</p>
              )}
               {salaryData.deductions !== undefined && (
                <p>Deductions: {formatCurrency(salaryData.deductions)}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalaryCalculator;
