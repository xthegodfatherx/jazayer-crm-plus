
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { profileApi, UserProfile as UserProfileType } from '@/services/profile-api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const UserProfile: React.FC = () => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch user profile data
  const { 
    data: profile, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: profileApi.getUserProfile,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: profileApi.updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully."
      });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was an error saving your profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Avatar upload mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: profileApi.uploadAvatar,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      // Update the avatar URL in the profile
      updateProfileMutation.mutate({ avatar: data.avatar_url });
      setAvatarFile(null);
      toast({
        title: "Avatar uploaded",
        description: "Your profile photo has been updated successfully."
      });
    },
    onError: (error) => {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateProfileMutation.mutate({ [name]: value });
  };

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = () => {
    if (avatarFile) {
      uploadAvatarMutation.mutate(avatarFile);
    }
  };

  // Error state handling
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-800">Error loading profile</h2>
        <p className="text-red-600">There was a problem loading your profile. Please refresh or try again later.</p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4 md:w-1/3">
              <Avatar className="w-32 h-32">
                <AvatarImage 
                  src={profile?.avatar} 
                  alt={profile?.fullName} 
                />
                <AvatarFallback className="text-3xl">
                  {profile?.fullName?.slice(0, 2) || 'N/A'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex space-x-2 w-full">
                <Input 
                  type="file"
                  accept="image/*"
                  id="avatar-upload"
                  className="sr-only"
                  onChange={handleAvatarChange}
                />
                <Label 
                  htmlFor="avatar-upload"
                  className="w-2/3 cursor-pointer flex items-center justify-center border rounded-md px-2 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select Photo
                </Label>
                <Button 
                  size="sm"
                  variant="default"
                  className="w-1/3" 
                  onClick={handleAvatarUpload} 
                  disabled={!avatarFile || uploadAvatarMutation.isPending}
                >
                  {uploadAvatarMutation.isPending ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : 'Upload'}
                </Button>
              </div>
              
              <div className="w-full bg-muted p-4 rounded-md text-sm text-center">
                <p>Performance Rating</p>
                <p className="text-2xl font-bold mt-2">
                  {profile?.performance_rating?.toFixed(1) || 'N/A'}/5.0
                </p>
                <p className="text-xs text-muted-foreground mt-1">Based on completed tasks</p>
              </div>
            </div>
            
            <div className="md:w-2/3 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    value={profile?.fullName || ''} 
                    onChange={handleChange}
                    disabled={updateProfileMutation.isPending}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={profile?.email || ''} 
                    onChange={handleChange}
                    disabled={updateProfileMutation.isPending}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={profile?.phone || ''} 
                    onChange={handleChange}
                    disabled={updateProfileMutation.isPending}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input 
                    id="jobTitle" 
                    name="jobTitle" 
                    value={profile?.jobTitle || ''} 
                    onChange={handleChange}
                    disabled={updateProfileMutation.isPending}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Input 
                    id="department" 
                    name="department" 
                    value={profile?.department || ''} 
                    onChange={handleChange}
                    disabled={updateProfileMutation.isPending}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  rows={4} 
                  value={profile?.bio || ''} 
                  onChange={handleChange}
                  disabled={updateProfileMutation.isPending}
                />
              </div>
            </div>
          </div>
          
          {updateProfileMutation.isPending && (
            <div className="mt-4 p-2 bg-blue-50 text-blue-700 rounded flex items-center justify-center">
              <Loader className="h-4 w-4 animate-spin mr-2" />
              <span>Saving changes...</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Skills & Expertise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="skills">Skills (separate with commas)</Label>
              <Input 
                id="skills" 
                name="skills"
                value={profile?.skills?.join(', ') || ''} 
                onChange={(e) => {
                  const skillsArray = e.target.value.split(',').map(skill => skill.trim());
                  updateProfileMutation.mutate({ skills: skillsArray });
                }}
                disabled={updateProfileMutation.isPending}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="languages">Languages</Label>
              <Input 
                id="languages" 
                name="languages"
                value={profile?.languages?.join(', ') || ''} 
                onChange={(e) => {
                  const languagesArray = e.target.value.split(',').map(language => language.trim());
                  updateProfileMutation.mutate({ languages: languagesArray });
                }}
                disabled={updateProfileMutation.isPending}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
