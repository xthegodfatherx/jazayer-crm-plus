
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
import { Upload } from 'lucide-react';

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState({
    fullName: 'Ahmed Khalifi',
    email: 'ahmed@jazayer-crm.dz',
    phone: '+213 123 456 789',
    jobTitle: 'UI Designer',
    department: 'Design',
    bio: 'Experienced UI Designer with a passion for creating user-friendly interfaces.',
    avatar: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

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
                <AvatarImage src={userData.avatar} alt={userData.fullName} />
                <AvatarFallback className="text-3xl">{userData.fullName.slice(0, 2)}</AvatarFallback>
              </Avatar>
              
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
              
              <div className="w-full bg-muted p-4 rounded-md text-sm text-center">
                <p>Performance Rating</p>
                <p className="text-2xl font-bold mt-2">4.8/5.0</p>
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
                    value={userData.fullName} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={userData.email} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={userData.phone} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input 
                    id="jobTitle" 
                    name="jobTitle" 
                    value={userData.jobTitle} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Input 
                    id="department" 
                    name="department" 
                    value={userData.department} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  rows={4} 
                  value={userData.bio} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>
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
              <Input id="skills" defaultValue="UI Design, UX Research, Figma, Adobe XD, Prototyping" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="languages">Languages</Label>
              <Input id="languages" defaultValue="Arabic (Native), French (Fluent), English (Intermediate)" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
