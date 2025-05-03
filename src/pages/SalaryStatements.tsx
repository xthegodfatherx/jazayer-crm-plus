
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Printer, FileText, Calendar, ChevronDown, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { teamApi, TeamMember, TeamPerformance, SalarySettings } from '@/services/team-api';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/services/api';
import SalaryStatementDetails from '@/components/team/SalaryStatementDetails';

const SalaryStatements: React.FC = () => {
  const [period, setPeriod] = useState('current-month');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [performance, setPerformance] = useState<TeamPerformance[]>([]);
  const [isGeneratingStatement, setIsGeneratingStatement] = useState(false);
  const [salarySettings, setSalarySettings] = useState<SalarySettings[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch team members and performance data
        const [membersRes, performanceRes, settingsRes] = await Promise.all([
          teamApi.getMembers(),
          teamApi.getPerformance(period),
          teamApi.getSalarySettings()
        ]);
        
        setMembers(membersRes.data);
        setPerformance(performanceRes.data);
        setSalarySettings(settingsRes.data);
        
        // Set default selected member if none is selected
        if (!selectedMemberId && membersRes.data.length > 0) {
          setSelectedMemberId(membersRes.data[0].id);
        }
      } catch (error) {
        handleError(error);
        toast({
          title: "Error loading team data",
          description: "Failed to load team member data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [period, toast]);
  
  const handleGenerateStatement = async (memberId: string) => {
    try {
      setIsGeneratingStatement(true);
      
      // Get current date components for period calculation
      const now = new Date();
      const month = now.getMonth() + 1; // JavaScript months are 0-indexed
      const year = now.getFullYear();
      
      // Calculate salaries for all members or selected member
      if (memberId) {
        await teamApi.calculateSalary(memberId, month.toString(), year.toString());
      } else {
        // If no specific member selected, calculate for all
        await Promise.all(members.map(member => 
          teamApi.calculateSalary(member.id, month.toString(), year.toString())
        ));
      }
      
      // Refresh performance data after calculation
      const { data: refreshedPerformance } = await teamApi.getPerformance(period);
      setPerformance(refreshedPerformance);
      
      toast({
        title: "Salary Statement Generated",
        description: "The salary statement has been generated successfully.",
      });
    } catch (error) {
      handleError(error);
      toast({
        title: "Error Generating Statement",
        description: "Failed to generate salary statement. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingStatement(false);
    }
  };
  
  const handlePrintStatement = (memberId: string) => {
    window.print();
  };
  
  const handleExportStatement = (memberId: string, format: 'pdf' | 'excel') => {
    toast({
      title: "Export Started",
      description: `Exporting salary statement as ${format.toUpperCase()}...`,
    });
    
    // In a real implementation, this would make an API call to generate and download the file
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Salary statement has been exported as ${format.toUpperCase()}.`,
      });
    }, 1500);
  };
  
  const getMemberPerformance = (memberId: string) => {
    return performance.find(p => p.member_id === memberId);
  };
  
  const renderPeriodLabel = () => {
    switch (period) {
      case 'current-week':
        return 'This Week';
      case 'current-month':
        return 'This Month';
      case 'last-quarter':
        return 'Last 3 Months';
      case 'current-year':
        return 'This Year';
      default:
        return 'Custom Period';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Salary Statements</h1>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                {renderPeriodLabel()}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setPeriod('current-week')}>
                This Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPeriod('current-month')}>
                This Month
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPeriod('last-quarter')}>
                Last 3 Months
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPeriod('current-year')}>
                This Year
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={() => handleGenerateStatement(selectedMemberId || '')}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Statement
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Select a team member to view their salary statement</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-4 text-center">Loading team members...</div>
            ) : members.length === 0 ? (
              <div className="py-4 text-center">No team members found</div>
            ) : (
              <div className="space-y-2">
                {members.map(member => (
                  <div 
                    key={member.id}
                    onClick={() => setSelectedMemberId(member.id)}
                    className={`flex items-center p-3 rounded-md cursor-pointer ${
                      selectedMemberId === member.id ? 'bg-primary/10' : 'hover:bg-muted'
                    }`}
                  >
                    <User className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Salary Statement</CardTitle>
              <CardDescription>
                {selectedMemberId ? 
                  `${members.find(m => m.id === selectedMemberId)?.name || 'Selected Member'}'s salary details` : 
                  'Select a team member to view their salary statement'
                }
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePrintStatement(selectedMemberId || '')}
                disabled={!selectedMemberId}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={!selectedMemberId}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExportStatement(selectedMemberId || '', 'pdf')}>
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportStatement(selectedMemberId || '', 'excel')}>
                    Export as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center">Loading salary data...</div>
            ) : !selectedMemberId ? (
              <div className="py-12 text-center text-muted-foreground">
                Please select a team member from the list
              </div>
            ) : (
              <SalaryStatementDetails 
                member={members.find(m => m.id === selectedMemberId)!}
                performance={getMemberPerformance(selectedMemberId)!}
                period={period}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalaryStatements;
