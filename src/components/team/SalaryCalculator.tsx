
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DollarSign, Calculator, Loader2 } from 'lucide-react';
import { teamApi, TeamMember } from '@/services/team-api';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/services/api';

interface SalaryCalculatorProps {
  memberId?: string;
}

const SalaryCalculator: React.FC<SalaryCalculatorProps> = ({ memberId }) => {
  const [member, setMember] = useState<TeamMember | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(memberId || '');
  const [month, setMonth] = useState<string>(new Date().getMonth() + 1 + '');
  const [year, setYear] = useState<string>(new Date().getFullYear() + '');
  const [salary, setSalary] = useState<{
    salary: number,
    details: {
      base_salary: number,
      task_bonus: number,
      hourly_earnings: number,
      overtime_earnings: number
    }
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [calculating, setCalculating] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const { data } = await teamApi.getMembers();
        setMembers(data);
        
        if (selectedMemberId && !memberId) {
          const memberData = data.find(m => m.id === selectedMemberId);
          if (memberData) {
            setMember(memberData);
          }
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [memberId, selectedMemberId]);

  useEffect(() => {
    if (memberId && !selectedMemberId) {
      setSelectedMemberId(memberId);
    }
  }, [memberId, selectedMemberId]);

  const handleMemberChange = (value: string) => {
    setSelectedMemberId(value);
    const memberData = members.find(m => m.id === value);
    if (memberData) {
      setMember(memberData);
    }
  };

  const calculateSalary = async () => {
    if (!selectedMemberId) {
      toast({
        title: "No member selected",
        description: "Please select a team member to calculate salary.",
        variant: "destructive"
      });
      return;
    }

    try {
      setCalculating(true);
      const response = await teamApi.calculateSalary(selectedMemberId, month, year);
      setSalary(response.data);

      toast({
        title: "Salary calculated",
        description: `The salary for ${member?.name} has been calculated successfully.`,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setCalculating(false);
    }
  };

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Salary Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!memberId && (
            <div className="space-y-2">
              <Label htmlFor="member">Team Member</Label>
              <Select value={selectedMemberId} onValueChange={handleMemberChange}>
                <SelectTrigger id="member">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map(member => (
                    <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger id="month">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={calculateSalary} 
            disabled={calculating || !selectedMemberId} 
            className="w-full"
          >
            {calculating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Salary
              </>
            )}
          </Button>

          {salary && (
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(salary.salary)}
                </div>
                <div className="text-sm text-muted-foreground">Total Salary</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Base Salary</Label>
                  <Input 
                    value={new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(salary.details.base_salary)} 
                    readOnly 
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Task Rating Bonus</Label>
                  <Input 
                    value={new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(salary.details.task_bonus)} 
                    readOnly 
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Hourly Earnings</Label>
                  <Input 
                    value={new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(salary.details.hourly_earnings)} 
                    readOnly 
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Overtime Earnings</Label>
                  <Input 
                    value={new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(salary.details.overtime_earnings)} 
                    readOnly 
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalaryCalculator;
