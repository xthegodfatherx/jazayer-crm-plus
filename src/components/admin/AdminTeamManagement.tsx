import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { 
  MoreVertical, 
  PlusCircle, 
  Loader2, 
  Search,
  Edit,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  Shield
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { teamsApi, Team } from '@/services/teams-api';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ColorOption {
  name: string;
  value: string;
  textColor: string;
}

const colorOptions: ColorOption[] = [
  { name: 'Default', value: 'bg-gray-100 border-gray-200', textColor: 'text-gray-800' },
  { name: 'Blue', value: 'bg-blue-100 border-blue-200', textColor: 'text-blue-800' },
  { name: 'Green', value: 'bg-green-100 border-green-200', textColor: 'text-green-800' },
  { name: 'Red', value: 'bg-red-100 border-red-200', textColor: 'text-red-800' },
  { name: 'Yellow', value: 'bg-yellow-100 border-yellow-200', textColor: 'text-yellow-800' },
  { name: 'Purple', value: 'bg-purple-100 border-purple-200', textColor: 'text-purple-800' },
  { name: 'Indigo', value: 'bg-indigo-100 border-indigo-200', textColor: 'text-indigo-800' },
  { name: 'Pink', value: 'bg-pink-100 border-pink-200', textColor: 'text-pink-800' },
  { name: 'Teal', value: 'bg-teal-100 border-teal-200', textColor: 'text-teal-800' },
  { name: 'Orange', value: 'bg-orange-100 border-orange-200', textColor: 'text-orange-800' },
];

const AdminTeamManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    badge_color: 'bg-gray-100 border-gray-200',
  });
  const [activeTab, setActiveTab] = useState('active');

  // Fetch teams using React Query
  const { 
    data: teams = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamsApi.getAll(),
  });

  // Create team mutation
  const createTeamMutation = useMutation({
    mutationFn: (data: Omit<Team, 'id' | 'created_at' | 'updated_at' | 'member_count' | 'leader_id' | 'leader_name'>) => 
      teamsApi.create(data),
    onSuccess: () => {
      toast({
        title: "Team created",
        description: "New team has been created successfully.",
      });
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      resetForm();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create team. Please try again."
      });
      console.error("Create team error:", error);
    }
  });

  // Update team mutation
  const updateTeamMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<Team, 'id' | 'created_at' | 'updated_at'>> }) => 
      teamsApi.update(id, data),
    onSuccess: () => {
      toast({
        title: "Team updated",
        description: "Team has been updated successfully.",
      });
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update team. Please try again."
      });
      console.error("Update team error:", error);
    }
  });

  // Delete team mutation
  const deleteTeamMutation = useMutation({
    mutationFn: (id: string) => teamsApi.delete(id),
    onSuccess: () => {
      toast({
        title: "Team deleted",
        description: "Team has been deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete team. Please try again."
      });
      console.error("Delete team error:", error);
    }
  });

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTeam = () => {
    createTeamMutation.mutate(formData);
  };

  const handleEditTeam = () => {
    if (!currentTeam) return;
    
    updateTeamMutation.mutate({ 
      id: currentTeam.id, 
      data: formData 
    });
  };

  const handleDeleteTeam = () => {
    if (!currentTeam) return;
    
    deleteTeamMutation.mutate(currentTeam.id);
  };

  const openEditDialog = (team: Team) => {
    setCurrentTeam(team);
    setFormData({
      name: team.name,
      description: team.description || '',
      badge_color: team.badge_color || 'bg-gray-100 border-gray-200',
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (team: Team) => {
    setCurrentTeam(team);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      badge_color: 'bg-gray-100 border-gray-200',
    });
    setCurrentTeam(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (value: string) => {
    setFormData(prev => ({ ...prev, badge_color: value }));
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>Failed to load team data. Please try again.</p>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Create, edit, or remove teams and manage team members</CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teams..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="active">Active Teams</TabsTrigger>
                  <TabsTrigger value="all">All Teams</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : filteredTeams.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No teams found matching your search.
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team</TableHead>
                      <TableHead>Leader</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeams.map(team => (
                      <TableRow key={team.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className={team.badge_color || 'bg-gray-100 text-gray-800 border-gray-200'}>
                              {team.name.charAt(0).toUpperCase()}
                            </Badge>
                            <div>
                              <div className="font-medium">{team.name}</div>
                              {team.description && (
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {team.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {team.leader_name ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{team.leader_name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{team.leader_name}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No leader assigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{team.member_count}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => openEditDialog(team)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Team
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Manage Members
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Shield className="h-4 w-4 mr-2" />
                                Assign Leader
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600" 
                                onSelect={() => openDeleteDialog(team)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Team
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Team Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Add a new team to organize your team members
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                name="name"
                placeholder="e.g. Design Team"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description"
                placeholder="Brief description of this team"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Badge Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <div 
                    key={color.name} 
                    className={`h-8 rounded-md cursor-pointer flex items-center justify-center border-2 ${
                      formData.badge_color === color.value 
                        ? 'border-primary' 
                        : 'border-transparent'
                    }`}
                    onClick={() => handleColorChange(color.value)}
                  >
                    <div className={`w-full h-full rounded ${color.value} flex items-center justify-center ${color.textColor}`}>
                      {formData.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={createTeamMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleCreateTeam} 
              disabled={!formData.name || createTeamMutation.isPending}
            >
              {createTeamMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : "Create Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>
              Update team information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Team Name <span className="text-red-500">*</span></Label>
              <Input 
                id="edit-name" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Badge Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <div 
                    key={color.name} 
                    className={`h-8 rounded-md cursor-pointer flex items-center justify-center border-2 ${
                      formData.badge_color === color.value 
                        ? 'border-primary' 
                        : 'border-transparent'
                    }`}
                    onClick={() => handleColorChange(color.value)}
                  >
                    <div className={`w-full h-full rounded ${color.value} flex items-center justify-center ${color.textColor}`}>
                      {formData.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={updateTeamMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleEditTeam} 
              disabled={!formData.name || updateTeamMutation.isPending}
            >
              {updateTeamMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : "Update Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the team "{currentTeam?.name}" and remove all member associations.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteTeamMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTeam}
              disabled={deleteTeamMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteTeamMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : "Delete Team"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminTeamManagement;
