
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/services/settings-api';
import { Loader2, Upload } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CompanySettings: React.FC = () => {
  // Get toast
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form state
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Fetch company settings
  const { 
    data: settings, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['companySettings'],
    queryFn: () => settingsApi.getSystemSettings(),
  });

  // Update company settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (updatedSettings: Partial<typeof settings>) => 
      settingsApi.updateSystemSettings(updatedSettings),
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Company settings have been successfully updated.",
      });
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['companySettings'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update company settings. Please try again."
      });
      console.error("Update error:", error);
    }
  });

  // Upload logo mutation
  const uploadLogoMutation = useMutation({
    mutationFn: (file: File) => settingsApi.uploadCompanyLogo(file),
    onSuccess: (data) => {
      toast({
        title: "Logo updated",
        description: "Company logo has been successfully updated.",
      });
      
      // Update settings with new logo URL
      updateSettingsMutation.mutate({ 
        company_logo: data.logo_url 
      });
      
      // Reset file input
      setCompanyLogo(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload logo. Please try again."
      });
      console.error("Upload error:", error);
    }
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file (type, size)
    if (!file.type.match('image.*')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file."
      });
      return;
    }

    if (file.size > 1024 * 1024 * 2) { // 2MB
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Logo should be less than 2MB."
      });
      return;
    }

    setCompanyLogo(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = () => {
    if (companyLogo) {
      uploadLogoMutation.mutate(companyLogo);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const updatedSettings = {
      company_name: formData.get('companyName') as string,
      company_email: formData.get('companyEmail') as string,
      company_phone: formData.get('companyPhone') as string,
      company_address: formData.get('companyAddress') as string,
      company_website: formData.get('companyWebsite') as string,
      default_currency: formData.get('defaultCurrency') as string,
      default_language: formData.get('defaultLanguage') as 'en' | 'ar' | 'fr',
    };
    
    updateSettingsMutation.mutate(updatedSettings);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>Failed to load company settings. Please try again.</p>
            <Button 
              variant="outline" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['companySettings'] })}
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
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Manage your company information and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="companyName">Company Name</Label>
              <Input 
                id="companyName" 
                name="companyName"
                defaultValue={settings?.company_name || ""}
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input 
                id="companyEmail" 
                name="companyEmail" 
                type="email"
                defaultValue={settings?.company_email || ""}
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="companyPhone">Company Phone</Label>
              <Input 
                id="companyPhone" 
                name="companyPhone"
                defaultValue={settings?.company_phone || ""}
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="companyWebsite">Company Website</Label>
              <Input 
                id="companyWebsite" 
                name="companyWebsite"
                defaultValue={settings?.company_website || ""}
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Textarea 
                id="companyAddress" 
                name="companyAddress"
                defaultValue={settings?.company_address || ""}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Logo</CardTitle>
              <CardDescription>
                Upload your company logo for branding across the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                {(settings?.company_logo || logoPreview) ? (
                  <div className="relative w-full h-40 flex items-center justify-center">
                    <img 
                      src={logoPreview || settings?.company_logo} 
                      alt="Company Logo Preview" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">No logo uploaded</p>
                  </div>
                )}
                
                <div className="mt-4 flex flex-col items-center w-full">
                  <Label htmlFor="logo" className="w-full">
                    <div className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded text-center cursor-pointer w-full">
                      Choose Logo
                    </div>
                    <Input 
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </Label>
                  
                  {companyLogo && (
                    <Button 
                      type="button"
                      onClick={handleLogoUpload} 
                      className="mt-2 w-full"
                      disabled={uploadLogoMutation.isPending}
                    >
                      {uploadLogoMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : "Upload Logo"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>
                Configure regional preferences for your company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                <Select name="defaultCurrency" defaultValue={settings?.default_currency || "USD"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                    <SelectItem value="DZD">Algerian Dinar (DZD)</SelectItem>
                    <SelectItem value="SAR">Saudi Riyal (SAR)</SelectItem>
                    <SelectItem value="AED">UAE Dirham (AED)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="defaultLanguage">Default Language</Label>
                <Select name="defaultLanguage" defaultValue={settings?.default_language || "en"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button 
          type="submit" 
          size="lg"
          disabled={updateSettingsMutation.isPending}
        >
          {updateSettingsMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default CompanySettings;
