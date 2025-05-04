
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { settingsApi, SecuritySettings as SecuritySettingsType } from '@/services/settings-api';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleError } from '@/services/api';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  two_factor_enabled: z.boolean(),
  session_timeout: z.number().min(5).max(1440),
  password_policy: z.enum(['basic', 'standard', 'strong', 'very-strong']),
  ip_restriction_enabled: z.boolean(),
  allowed_ips: z.array(z.string()),
  rate_limiting_enabled: z.boolean(),
  rate_limit_attempts: z.number().min(1).max(1000),
  rate_limit_duration: z.number().min(1).max(1440),
});

const SecuritySettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newIp, setNewIp] = useState('');
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      two_factor_enabled: false,
      session_timeout: 60,
      password_policy: 'standard',
      ip_restriction_enabled: false,
      allowed_ips: [],
      rate_limiting_enabled: true,
      rate_limit_attempts: 5,
      rate_limit_duration: 15,
    },
  });

  useEffect(() => {
    const fetchSecuritySettings = async () => {
      try {
        setLoading(true);
        const response = await settingsApi.getSecuritySettings();
        
        if (response) {
          form.reset({
            two_factor_enabled: response.two_factor_enabled,
            session_timeout: response.session_timeout,
            password_policy: response.password_policy,
            ip_restriction_enabled: response.ip_restriction_enabled,
            allowed_ips: response.allowed_ips || [],
            rate_limiting_enabled: response.rate_limiting_enabled,
            rate_limit_attempts: response.rate_limit_attempts,
            rate_limit_duration: response.rate_limit_duration,
          });
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSecuritySettings();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSaving(true);
      await settingsApi.updateSecuritySettings(values);
      toast({
        title: "Settings saved",
        description: "Security settings have been updated successfully.",
      });
    } catch (error) {
      handleError(error);
    } finally {
      setSaving(false);
    }
  };

  const addIpAddress = () => {
    if (!newIp || !form.getValues().allowed_ips) return;
    const currentIps = form.getValues().allowed_ips || [];
    form.setValue('allowed_ips', [...currentIps, newIp]);
    setNewIp('');
  };

  const removeIpAddress = (index: number) => {
    const currentIps = form.getValues().allowed_ips || [];
    form.setValue('allowed_ips', currentIps.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Configure authentication and security options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading security settings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Configure authentication and security options</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Authentication</h3>
              
              <FormField
                control={form.control}
                name="two_factor_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                      <FormDescription>
                        Require 2FA for all users
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="session_timeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Timeout (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={5} 
                        max={1440} 
                        {...form.register("session_timeout", { valueAsNumber: true })}
                      />
                    </FormControl>
                    <FormDescription>
                      How long before inactive users are logged out
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password_policy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Policy</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select password policy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basic">Basic (minimum 6 characters)</SelectItem>
                        <SelectItem value="standard">Standard (minimum 8 characters, 1 number)</SelectItem>
                        <SelectItem value="strong">Strong (minimum 10 characters, mixed case, numbers)</SelectItem>
                        <SelectItem value="very-strong">Very Strong (minimum 12 characters, mixed case, numbers, symbols)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Enforced password requirements for all users
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">IP Restrictions</h3>
              
              <FormField
                control={form.control}
                name="ip_restriction_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable IP Restrictions</FormLabel>
                      <FormDescription>
                        Restrict access to specific IP addresses
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {form.watch("ip_restriction_enabled") && (
                <FormField
                  control={form.control}
                  name="allowed_ips"
                  render={() => (
                    <FormItem>
                      <FormLabel>Allowed IP Addresses</FormLabel>
                      <div className="flex gap-2 mb-2">
                        <Input 
                          placeholder="Enter IP address" 
                          value={newIp} 
                          onChange={(e) => setNewIp(e.target.value)}
                        />
                        <Button type="button" onClick={addIpAddress}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.watch("allowed_ips")?.map((ip, index) => (
                          <Badge key={index} variant="outline" className="px-2 py-1">
                            {ip}
                            <X 
                              className="ml-2 h-3 w-3 cursor-pointer" 
                              onClick={() => removeIpAddress(index)} 
                            />
                          </Badge>
                        ))}
                        {(!form.watch("allowed_ips") || form.watch("allowed_ips").length === 0) && (
                          <div className="text-sm text-muted-foreground">No IP addresses added</div>
                        )}
                      </div>
                      <FormDescription>
                        Only these IP addresses will be allowed to access the system
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Rate Limiting</h3>
              
              <FormField
                control={form.control}
                name="rate_limiting_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Rate Limiting</FormLabel>
                      <FormDescription>
                        Protect against brute force attacks
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {form.watch("rate_limiting_enabled") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rate_limit_attempts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Attempts</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            max={1000} 
                            {...form.register("rate_limit_attempts", { valueAsNumber: true })}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum login attempts before lockout
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rate_limit_duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lockout Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            max={1440} 
                            {...form.register("rate_limit_duration", { valueAsNumber: true })}
                          />
                        </FormControl>
                        <FormDescription>
                          How long accounts remain locked
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
            
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save Security Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
