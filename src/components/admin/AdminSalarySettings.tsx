
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save } from 'lucide-react';
import { SalarySettings, settingsApi } from '@/services/settings-api';

// Form schema
const formSchema = z.object({
  calculation_method: z.enum(['task_based', 'fixed', 'hourly']),
  default_hourly_rate: z.coerce.number().min(0).optional(),
  overtime_multiplier: z.coerce.number().min(1).optional(),
  bonus_calculation_method: z.enum(['percentage', 'fixed']),
  bonus_percentage: z.coerce.number().min(0).max(100).optional(),
  bonus_fixed_amount: z.coerce.number().min(0).optional(),
});

const AdminSalarySettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      calculation_method: 'task_based',
      default_hourly_rate: 0,
      overtime_multiplier: 1.5,
      bonus_calculation_method: 'percentage',
      bonus_percentage: 0,
      bonus_fixed_amount: 0,
    },
  });

  // Fetch current settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await settingsApi.getSalarySettings();
        form.reset({
          calculation_method: data.calculation_method,
          default_hourly_rate: data.default_hourly_rate,
          overtime_multiplier: data.overtime_multiplier,
          bonus_calculation_method: data.bonus_calculation_method,
          bonus_percentage: data.bonus_percentage || 0,
          bonus_fixed_amount: data.bonus_fixed_amount || 0,
        });
      } catch (error) {
        console.error('Failed to fetch salary settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load salary settings',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [toast, form]);

  // Save settings
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true);
      await settingsApi.updateSalarySettings(values as SalarySettings);
      toast({
        title: 'Success',
        description: 'Salary settings updated successfully',
      });
    } catch (error) {
      console.error('Failed to update salary settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update salary settings',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary Settings</CardTitle>
        <CardDescription>Configure how salaries are calculated for team members</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="calculation_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Calculation Method</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isSaving}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select calculation method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="task_based">Task Based</SelectItem>
                        <SelectItem value="fixed">Fixed Salary</SelectItem>
                        <SelectItem value="hourly">Hourly Rate</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How salary is calculated for team members
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('calculation_method') === 'hourly' && (
                <>
                  <FormField
                    control={form.control}
                    name="default_hourly_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Hourly Rate</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            disabled={isSaving}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The default hourly rate for team members
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="overtime_multiplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overtime Multiplier</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min="1"
                            disabled={isSaving}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Multiplier for overtime hours (e.g., 1.5 means 50% extra)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="bonus_calculation_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bonus Calculation Method</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isSaving}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bonus calculation method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage of Salary</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How bonuses are calculated
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('bonus_calculation_method') === 'percentage' ? (
                <FormField
                  control={form.control}
                  name="bonus_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bonus Percentage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          disabled={isSaving}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Percentage of salary to award as bonus
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="bonus_fixed_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fixed Bonus Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          disabled={isSaving}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Fixed amount to award as bonus
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminSalarySettings;
