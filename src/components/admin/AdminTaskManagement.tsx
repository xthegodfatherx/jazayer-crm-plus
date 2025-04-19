
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StarIcon, Trophy, Award } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TopPerformer {
  name: string;
  role: string;
  completedTasks: number;
  trackingHours: number;
  rating: number;
  isVIP: boolean;
}

const AdminTaskManagement = () => {
  const [vipThreshold, setVipThreshold] = useState(25);
  
  // Mock data for top performers
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([
    { 
      name: 'Ahmed Khalifi', 
      role: 'UI Designer', 
      completedTasks: 32, 
      trackingHours: 156, 
      rating: 4.8, 
      isVIP: true 
    },
    { 
      name: 'Selma Bouaziz', 
      role: 'Frontend Developer', 
      completedTasks: 28, 
      trackingHours: 165, 
      rating: 4.5, 
      isVIP: true 
    },
    { 
      name: 'Karim Mansouri', 
      role: 'Project Manager', 
      completedTasks: 22, 
      trackingHours: 148, 
      rating: 4.2, 
      isVIP: false 
    },
    { 
      name: 'Leila Benzema', 
      role: 'Backend Developer', 
      completedTasks: 19, 
      trackingHours: 172, 
      rating: 3.9, 
      isVIP: false 
    },
  ]);

  // Calculate performance score based on weighted factors
  const calculateScore = (performer: TopPerformer) => {
    return (
      (performer.completedTasks * 0.5) + 
      (performer.trackingHours / 40 * 0.3) + 
      (performer.rating * 0.2) * 5
    ).toFixed(1);
  };

  const toggleVIPStatus = (index: number) => {
    const updatedPerformers = [...topPerformers];
    updatedPerformers[index].isVIP = !updatedPerformers[index].isVIP;
    setTopPerformers(updatedPerformers);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Management</CardTitle>
        <CardDescription>Configure task settings and manage top performers</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vip" className="space-y-4">
          <TabsList>
            <TabsTrigger value="vip">VIP Program</TabsTrigger>
            <TabsTrigger value="settings">Task Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vip" className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
              <h3 className="text-lg font-semibold text-amber-900 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                VIP Performance Recognition
              </h3>
              <p className="text-sm text-amber-800 mt-1">
                VIP status is awarded to team members with exceptional performance. 
                The scoring system is based on:
              </p>
              <ul className="text-sm text-amber-800 mt-2 list-disc list-inside">
                <li>50% - Tasks completed</li>
                <li>30% - Time tracked</li>
                <li>20% - Task quality (star ratings)</li>
              </ul>
              
              <div className="flex items-center mt-4 gap-2">
                <Label htmlFor="threshold" className="text-sm text-amber-800">
                  VIP Threshold Score:
                </Label>
                <Input 
                  id="threshold" 
                  type="number" 
                  className="w-24 bg-white"
                  value={vipThreshold}
                  onChange={(e) => setVipThreshold(Number(e.target.value))}
                />
                <span className="text-sm text-amber-800">points</span>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Member</TableHead>
                  <TableHead>Completed Tasks</TableHead>
                  <TableHead>Time Tracked</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>VIP Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPerformers.map((performer, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback>{performer.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{performer.name}</p>
                          <p className="text-sm text-muted-foreground">{performer.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{performer.completedTasks}</TableCell>
                    <TableCell>{performer.trackingHours}h</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-amber-400 fill-amber-400 mr-1" />
                        {performer.rating.toFixed(1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={Number(calculateScore(performer)) >= vipThreshold ? "default" : "outline"}
                        className={Number(calculateScore(performer)) >= vipThreshold ? "bg-amber-100 text-amber-900 hover:bg-amber-200" : ""}
                      >
                        {calculateScore(performer)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={performer.isVIP} 
                          onCheckedChange={() => toggleVIPStatus(index)}
                          className={performer.isVIP ? "bg-amber-400" : ""}
                        />
                        {performer.isVIP && (
                          <Award className="h-4 w-4 text-amber-400 fill-amber-400" />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="settings">
            <p>Task settings will be implemented here.</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminTaskManagement;
