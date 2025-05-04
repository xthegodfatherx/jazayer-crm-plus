
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/contexts/PermissionsContext";
import { Loader2 } from "lucide-react";
import { settingsApi } from "@/services/settings-api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const navigate = useNavigate();
  const { userRole } = usePermissions() || { userRole: null };
  
  // Fetch company info using React Query
  const { data: systemSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['indexSystemSettings'],
    queryFn: () => settingsApi.getSystemSettings(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
  
  // Redirect based on role
  useEffect(() => {
    if (!settingsLoading) {
      // Add a small delay for better UX
      const redirectTimeout = setTimeout(() => {
        // Redirect based on user role with fallback
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'manager' || userRole === 'employee' || userRole === 'client') {
          navigate('/dashboard'); // For manager, employee, client - redirect to main dashboard
        } else {
          // If userRole is null or undefined, default to dashboard
          navigate('/dashboard');
        }
      }, 1500);
      
      return () => clearTimeout(redirectTimeout);
    }
  }, [navigate, userRole, settingsLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
        {settingsLoading ? (
          <div className="flex flex-col items-center">
            <Skeleton className="h-16 w-16 rounded-full mb-6" />
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-32" />
          </div>
        ) : (
          <>
            {systemSettings?.company_logo ? (
              <img 
                src={systemSettings.company_logo} 
                alt={`${systemSettings.company_name} Logo`}
                className="h-16 mx-auto mb-6 object-contain" 
              />
            ) : (
              <div className="h-16 w-16 bg-[#9b87f5] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">
                  {systemSettings?.company_name?.charAt(0) || 'C'}
                </span>
              </div>
            )}
            
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
              {systemSettings?.company_name || "CRM System"}
            </h1>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin text-[#9b87f5]" />
              <span>Redirecting to dashboard...</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
