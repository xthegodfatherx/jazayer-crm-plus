
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle, 
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Check, Download, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { teamApi } from '@/services/api';
import { format } from 'date-fns';

interface SalaryStatement {
  id: string;
  employee_name: string;
  period: string;
  base_salary: number;
  bonus: number;
  deductions: number;
  net_salary: number;
  status: 'pending' | 'approved' | 'paid';
  generated_at: string;
  tax_rate?: number;
}

interface SalarySettings {
  id: string;
  member_id: string;
  base_salary: number;
  hourly_rate: number;
  tax_rate: number;
  bonus_rate: number;
}

const SalaryStatements = () => {
  const [statements, setStatements] = useState<SalaryStatement[]>([]);
  const [settings, setSalarySettings] = useState<SalarySettings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch team members
        const membersResponse = await teamApi.getMembers();
        setTeamMembers(membersResponse.data);
        
        if (membersResponse.data.length > 0 && !selectedMember) {
          setSelectedMember(membersResponse.data[0].id);
        }
        
        // For demo purposes, we'd fetch statements from an API
        // In a real app, you would call something like:
        // const response = await api.getSalaryStatements({ month: selectedMonth });
        // setStatements(response.data);
        
        // This would be replaced with real API data
        if (selectedMember) {
          const calculatedResponse = await teamApi.calculateSalary(
            selectedMember,
            selectedMonth
          );
          
          if (calculatedResponse.data) {
            setStatements([calculatedResponse.data]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch salary data:', err);
        setError('Failed to load salary statements. Please try again later.');
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
  }, [selectedMonth, selectedMember]);
  
  const handleDownload = (id: string) => {
    // In a real app, this would trigger a download from the API
    toast({
      title: 'Download started',
      description: `Salary statement ${id} is being downloaded.`
    });
  };
  
  const handleApprove = (id: string) => {
    // In a real app, this would call an API to update the status
    setStatements(statements.map(statement => 
      statement.id === id ? { ...statement, status: 'approved' as const } : statement
    ));
    
    toast({
      title: 'Statement Approved',
      description: `Salary statement ${id} has been approved.`
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-5 w-72" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-32" />
              </div>
              <Skeleton className="h-[400px] w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Salary Statements</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Salary Statements</CardTitle>
          <CardDescription>View, generate and approve salary statements.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="month-select">Select Period</Label>
                <Input
                  id="month-select"
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="employee-select">Select Employee</Label>
                <Select 
                  value={selectedMember} 
                  onValueChange={setSelectedMember}
                >
                  <SelectTrigger id="employee-select">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full md:w-auto">Generate Statement</Button>
              </div>
            </div>
            
            {error ? (
              <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            ) : statements.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Base Salary</TableHead>
                      <TableHead>Bonus</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statements.map((statement) => (
                      <TableRow key={statement.id}>
                        <TableCell>{statement.employee_name}</TableCell>
                        <TableCell>{statement.period}</TableCell>
                        <TableCell>${statement.base_salary.toFixed(2)}</TableCell>
                        <TableCell>${statement.bonus.toFixed(2)}</TableCell>
                        <TableCell>${statement.deductions.toFixed(2)}</TableCell>
                        <TableCell className="font-medium">${statement.net_salary.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block
                            ${statement.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                              statement.status === 'approved' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`
                          }>
                            {statement.status.charAt(0).toUpperCase() + statement.status.slice(1)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDownload(statement.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            
                            {statement.status === 'pending' && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Approve Salary Statement</DialogTitle>
                                    <DialogDescription>
                                      This will mark the statement as approved for payment. This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="py-4">
                                    <h3 className="font-medium">Statement Details</h3>
                                    <div className="mt-2 space-y-2">
                                      <div className="grid grid-cols-2">
                                        <span className="text-muted-foreground">Employee:</span>
                                        <span>{statement.employee_name}</span>
                                      </div>
                                      <div className="grid grid-cols-2">
                                        <span className="text-muted-foreground">Period:</span>
                                        <span>{statement.period}</span>
                                      </div>
                                      <div className="grid grid-cols-2">
                                        <span className="text-muted-foreground">Base Salary:</span>
                                        <span>${statement.base_salary.toFixed(2)}</span>
                                      </div>
                                      <div className="grid grid-cols-2">
                                        <span className="text-muted-foreground">Net Salary:</span>
                                        <span>${statement.net_salary.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <DialogFooter>
                                    <Button variant="outline" type="button">
                                      Cancel
                                    </Button>
                                    <Button onClick={() => handleApprove(statement.id)}>
                                      Approve Statement
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Salary Statement Details</DialogTitle>
                                  <DialogDescription>
                                    Complete breakdown of salary calculations.
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="py-4 space-y-4">
                                  <div>
                                    <h3 className="font-medium mb-2">Basic Information</h3>
                                    <div className="space-y-2 text-sm">
                                      <div className="grid grid-cols-2 gap-2">
                                        <span className="text-muted-foreground">Employee:</span>
                                        <span>{statement.employee_name}</span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <span className="text-muted-foreground">Period:</span>
                                        <span>{statement.period}</span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <span className="text-muted-foreground">Generated:</span>
                                        <span>{statement.generated_at}</span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <span className="text-muted-foreground">Status:</span>
                                        <span className="capitalize">{statement.status}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h3 className="font-medium mb-2">Earnings</h3>
                                    <div className="space-y-2 text-sm">
                                      <div className="grid grid-cols-2 gap-2">
                                        <span className="text-muted-foreground">Base Salary:</span>
                                        <span>${statement.base_salary.toFixed(2)}</span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <span className="text-muted-foreground">Performance Bonus:</span>
                                        <span>${statement.bonus.toFixed(2)}</span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 font-medium border-t pt-1 mt-1">
                                        <span>Total Earnings:</span>
                                        <span>${(statement.base_salary + statement.bonus).toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h3 className="font-medium mb-2">Deductions</h3>
                                    <div className="space-y-2 text-sm">
                                      <div className="grid grid-cols-2 gap-2">
                                        <span className="text-muted-foreground">Income Tax ({statement.tax_rate}%):</span>
                                        <span>${statement.deductions.toFixed(2)}</span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 font-medium border-t pt-1 mt-1">
                                        <span>Total Deductions:</span>
                                        <span>${statement.deductions.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="pt-2 border-t">
                                    <div className="grid grid-cols-2 gap-2 font-medium text-base">
                                      <span>Net Salary:</span>
                                      <span>${statement.net_salary.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                                
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-8 text-center border rounded-md">
                <p className="text-muted-foreground">No salary statements found for the selected period.</p>
                <Button className="mt-4">Generate Statement</Button>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            All salary data is calculated based on current rates and performance.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SalaryStatements;
