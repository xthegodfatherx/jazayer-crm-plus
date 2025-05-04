
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { teamApi } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';

interface SalaryCalculatorProps {
  memberId: string;
}

interface SalarySettings {
  base_salary: number;
  hourly_rate: number;
  tax_rate: number;
  bonus_rate: number;
}

interface CalculatedSalary {
  base_salary: number;
  hourly_earnings: number;
  task_bonus: number;
  performance_bonus: number;
  deductions: number;
  net_salary: number;
}

const SalaryCalculator: React.FC<SalaryCalculatorProps> = ({ memberId }) => {
  const [settings, setSettings] = useState<SalarySettings>({
    base_salary: 0,
    hourly_rate: 0,
    tax_rate: 0,
    bonus_rate: 0
  });
  const [calculatedSalary, setCalculatedSalary] = useState<CalculatedSalary | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memberName, setMemberName] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch team member details
        const memberResponse = await teamApi.getMember(memberId);
        setMemberName(memberResponse.data.name);
        
        // Fetch salary settings
        const settingsResponse = await teamApi.getSalarySettings(memberId);
        setSettings(settingsResponse.data);
        
        // Calculate initial salary
        handleCalculate();
      } catch (err) {
        console.error('Failed to fetch salary settings:', err);
        setError('Failed to load salary settings. Please try again later.');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch salary data'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [memberId]);
  
  const handleSettingsChange = (field: keyof SalarySettings, value: number) => {
    setSettings({ ...settings, [field]: value });
  };
  
  const handleUpdateSettings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await teamApi.updateSalarySettings(memberId, settings);
      toast({
        title: 'Settings Updated',
        description: 'Salary settings have been updated successfully.'
      });
    } catch (err) {
      console.error('Failed to update salary settings:', err);
      setError('Failed to update salary settings. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update salary settings'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCalculate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await teamApi.calculateSalary(memberId, selectedMonth);
      setCalculatedSalary(response.data);
    } catch (err) {
      console.error('Failed to calculate salary:', err);
      setError('Failed to calculate salary. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to calculate salary'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !calculatedSalary) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-md">
        {error}
        <Button 
          variant="outline" 
          onClick={() => {
            setIsLoading(true);
            window.location.reload();
          }}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Salary Calculator for {memberName}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Salary Settings</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="base-salary">Base Salary</Label>
              <Input
                id="base-salary"
                type="number"
                value={settings.base_salary}
                onChange={(e) => handleSettingsChange('base_salary', Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hourly-rate">Hourly Rate</Label>
              <Input
                id="hourly-rate"
                type="number"
                value={settings.hourly_rate}
                onChange={(e) => handleSettingsChange('hourly_rate', Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Tax Rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                value={settings.tax_rate}
                onChange={(e) => handleSettingsChange('tax_rate', Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bonus-rate">Bonus Rate (%)</Label>
              <Input
                id="bonus-rate"
                type="number"
                value={settings.bonus_rate}
                onChange={(e) => handleSettingsChange('bonus_rate', Number(e.target.value))}
              />
            </div>
          </div>
          
          <Button onClick={handleUpdateSettings}>
            Save Settings
          </Button>
          
          <div className="pt-4 border-t">
            <div className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="month-select">Select Month</Label>
                  <Input
                    id="month-select"
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  />
                </div>
                <Button onClick={handleCalculate}>
                  Calculate
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Calculated Salary</h3>
          
          {calculatedSalary ? (
            <div className="bg-card border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Base Salary:</span>
                <span className="font-medium">${calculatedSalary.base_salary.toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Hourly Earnings:</span>
                <span className="font-medium">${calculatedSalary.hourly_earnings.toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Task Bonus:</span>
                <span className="font-medium">${calculatedSalary.task_bonus.toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Performance Bonus:</span>
                <span className="font-medium">${calculatedSalary.performance_bonus.toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 border-t pt-2">
                <span className="text-muted-foreground">Gross Salary:</span>
                <span className="font-medium">
                  ${(calculatedSalary.base_salary + 
                      calculatedSalary.hourly_earnings + 
                      calculatedSalary.task_bonus + 
                      calculatedSalary.performance_bonus).toFixed(2)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Deductions:</span>
                <span className="font-medium text-red-500">-${calculatedSalary.deductions.toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 border-t pt-2">
                <span className="font-medium">Net Salary:</span>
                <span className="font-medium text-lg">${calculatedSalary.net_salary.toFixed(2)}</span>
              </div>
              
              <div className="text-xs text-muted-foreground mt-4">
                Calculation based on performance data for {new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          ) : (
            <div className="bg-card border rounded-lg p-8 text-center flex flex-col items-center justify-center h-64">
              <p className="text-muted-foreground mb-4">Click 'Calculate' to see salary breakdown</p>
              <Button onClick={handleCalculate}>Calculate Now</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;
