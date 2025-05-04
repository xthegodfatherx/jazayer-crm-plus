
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamApi } from '@/services/team-api';
import { settingsApi } from '@/services/settings-api';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, DollarSign, Calculator, RefreshCw, Save } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const AdminSalarySettings: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch global salary settings
  const { 
    data: salarySettings, 
    isLoading: isSettingsLoading, 
    error: settingsError 
  } = useQuery({
    queryKey: ['salarySettings'],
    queryFn: () => settingsApi.getSalarySettings(),
  });

  // Fetch team members
  const {
    data: teamMembers,
    isLoading: isTeamLoading,
    error: teamError
  } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      const response = await teamApi.getMembers();
      return response.data;
    },
  });

  // Fetch performance data
  const {
    data: teamPerformance,
    isLoading: isPerformanceLoading,
    error: performanceError
  } = useQuery({
    queryKey: ['teamPerformance'],
    queryFn: () => teamApi.getPerformance('current_month'),
  });

  // Update salary settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (updatedSettings: any) => 
      settingsApi.updateSalarySettings(updatedSettings),
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Salary settings have been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['salarySettings'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update salary settings. Please try again."
      });
      console.error("Update error:", error);
    }
  });

  // Update member salary settings mutation
  const updateMemberSalaryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => 
      teamApi.updateSalarySettings(id, data),
    onSuccess: () => {
      toast({
        title: "Member salary updated",
        description: "Team member salary settings have been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update member salary settings. Please try again."
      });
      console.error("Update error:", error);
    }
  });

  // Calculate salary mutation
  const calculateSalaryMutation = useMutation({
    mutationFn: ({ memberId, month }: { memberId: string, month: string }) => 
      teamApi.calculateSalary(memberId, month),
    onSuccess: () => {
      toast({
        title: "Salary calculated",
        description: "Salary has been calculated successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to calculate salary. Please try again."
      });
      console.error("Calculation error:", error);
    }
  });

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    const updatedSettings = {
      calculation_method: form.calculation_method.value,
      default_hourly_rate: parseFloat(form.default_hourly_rate.value),
      overtime_multiplier: parseFloat(form.overtime_multiplier.value),
      bonus_calculation_method: form.bonus_calculation_method.value,
      bonus_percentage: parseFloat(form.bonus_percentage?.value || "0"),
      bonus_fixed_amount: parseFloat(form.bonus_fixed_amount?.value || "0"),
    };
    
    updateSettingsMutation.mutate(updatedSettings);
  };

  const isLoading = isSettingsLoading || isTeamLoading || isPerformanceLoading;
  const hasError = settingsError || teamError || performanceError;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full md:col-span-2" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (hasError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>Failed to load salary data. Please try again.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['salarySettings'] });
                queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
                queryClient.invalidateQueries({ queryKey: ['teamPerformance'] });
              }}
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="settings">
        <TabsList className="mb-4 w-full max-w-md">
          <TabsTrigger value="settings" className="flex-1">Global Settings</TabsTrigger>
          <TabsTrigger value="members" className="flex-1">Team Members</TabsTrigger>
          <TabsTrigger value="reports" className="flex-1">Salary Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Salary Calculation Settings</CardTitle>
              <CardDescription>Configure global salary settings for all team members</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateSettings} className="space-y-6">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="calculation_method">Calculation Method</Label>
                    <Select 
                      name="calculation_method" 
                      defaultValue={salarySettings?.calculation_method || "fixed"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Salary</SelectItem>
                        <SelectItem value="hourly">Hourly Rate</SelectItem>
                        <SelectItem value="task_based">Task Based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="default_hourly_rate">Default Hourly Rate</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input 
                        id="default_hourly_rate" 
                        name="default_hourly_rate" 
                        type="number" 
                        step="0.01"
                        className="pl-10" 
                        defaultValue={salarySettings?.default_hourly_rate || 0}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="overtime_multiplier">Overtime Multiplier</Label>
                    <Input 
                      id="overtime_multiplier" 
                      name="overtime_multiplier" 
                      type="number" 
                      step="0.1" 
                      min="1"
                      defaultValue={salarySettings?.overtime_multiplier || 1.5}
                    />
                    <p className="text-xs text-muted-foreground">Factor to multiply hourly rate for overtime hours</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bonus_calculation_method">Bonus Calculation</Label>
                    <Select 
                      name="bonus_calculation_method" 
                      defaultValue={salarySettings?.bonus_calculation_method || "percentage"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage of Salary</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {(salarySettings?.bonus_calculation_method === 'percentage' || !salarySettings?.bonus_calculation_method) && (
                    <div className="space-y-2">
                      <Label htmlFor="bonus_percentage">Bonus Percentage</Label>
                      <div className="relative">
                        <Input 
                          id="bonus_percentage" 
                          name="bonus_percentage" 
                          type="number" 
                          step="0.1" 
                          min="0"
                          className="pr-8"
                          defaultValue={salarySettings?.bonus_percentage || 0}
                        />
                        <span className="absolute right-3 top-2.5 text-gray-500">%</span>
                      </div>
                    </div>
                  )}
                  
                  {salarySettings?.bonus_calculation_method === 'fixed' && (
                    <div className="space-y-2">
                      <Label htmlFor="bonus_fixed_amount">Fixed Bonus Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input 
                          id="bonus_fixed_amount" 
                          name="bonus_fixed_amount" 
                          type="number" 
                          step="0.01" 
                          min="0"
                          className="pl-10"
                          defaultValue={salarySettings?.bonus_fixed_amount || 0}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={updateSettingsMutation.isPending}
                  >
                    {updateSettingsMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Team Members Salary Settings</CardTitle>
              <CardDescription>
                Configure individual salary settings for each team member
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Base Salary</TableHead>
                      <TableHead>Hourly Rate</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers && teamMembers.length > 0 ? (
                      teamMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                {member.avatar_url ? (
                                  <img src={member.avatar_url} alt={member.name} />
                                ) : (
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">{member.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={
                                member.role === 'admin' 
                                  ? 'bg-red-100 text-red-800 border-red-200' 
                                  : member.role === 'manager' 
                                  ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                  : 'bg-gray-100'
                              }
                            >
                              {member.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="relative w-36">
                              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input 
                                className="pl-10" 
                                type="number" 
                                step="0.01"
                                min="0"
                                defaultValue={member.base_salary || 0}
                                onChange={(e) => {
                                  // Debounced update
                                  const timeoutId = setTimeout(() => {
                                    updateMemberSalaryMutation.mutate({
                                      id: member.id,
                                      data: { base_salary: parseFloat(e.target.value) }
                                    });
                                  }, 1000);
                                  
                                  return () => clearTimeout(timeoutId);
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="relative w-36">
                              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input 
                                className="pl-10" 
                                type="number" 
                                step="0.01"
                                min="0"
                                defaultValue={member.hourly_rate || 0}
                                onChange={(e) => {
                                  // Debounced update
                                  const timeoutId = setTimeout(() => {
                                    updateMemberSalaryMutation.mutate({
                                      id: member.id,
                                      data: { hourly_rate: parseFloat(e.target.value) }
                                    });
                                  }, 1000);
                                  
                                  return () => clearTimeout(timeoutId);
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline"
                                    size="icon"
                                    onClick={() => calculateSalaryMutation.mutate({ 
                                      memberId: member.id, 
                                      month: new Date().toISOString().slice(0, 7) 
                                    })}
                                    disabled={calculateSalaryMutation.isPending}
                                  >
                                    {calculateSalaryMutation.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Calculator className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Calculate this month's salary</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                          No team members found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Salary Performance Reports</CardTitle>
              <CardDescription>
                Track salary data and performance metrics across team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teamPerformance && teamPerformance.data?.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Tasks Completed</TableHead>
                        <TableHead>Hours Logged</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Calculated Salary</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamPerformance.data.map((performance) => (
                        <TableRow key={performance.id}>
                          <TableCell>
                            <div className="font-medium">{performance.member_name}</div>
                          </TableCell>
                          <TableCell>{performance.completed_tasks} / {performance.total_tasks}</TableCell>
                          <TableCell>{performance.total_hours}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="text-yellow-500 mr-1">★</span>
                              {performance.average_rating?.toFixed(1) || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              ${performance.calculated_salary?.toFixed(2) || "0.00"}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <p>No salary performance data available for the current period</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['teamPerformance'] })}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSalarySettings;
