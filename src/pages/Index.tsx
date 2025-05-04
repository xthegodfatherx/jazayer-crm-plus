
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/contexts/PermissionsContext";
import { Loader2 } from "lucide-react";
import { settingsApi } from "@/services/settings-api";

const Index = () => {
  const navigate = useNavigate();
  const { userRole } = usePermissions() || { userRole: null };
  const [companyName, setCompanyName] = useState<string>("System");
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch company info for splash screen
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const settings = await settingsApi.getSystemSettings();
        if (settings) {
          setCompanyName(settings.company_name || "System");
          setCompanyLogo(settings.company_logo || null);
        }
      } catch (error) {
        console.error("Error loading company info:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanyInfo();
  }, []);
  
  // Redirect based on role
  useEffect(() => {
    if (!loading) {
      // Redirect based on user role with fallback
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'manager' || userRole === 'employee' || userRole === 'client') {
        navigate('/dashboard'); // For manager, employee, client - redirect to main dashboard
      } else {
        // If userRole is null or undefined, default to dashboard
        navigate('/dashboard');
      }
    }
  }, [navigate, userRole, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
        {companyLogo ? (
          <img 
            src={companyLogo} 
            alt={`${companyName} Logo`}
            className="h-16 mx-auto mb-6" 
          />
        ) : (
          <div className="h-16 w-16 bg-[#9b87f5] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl font-bold text-white">
              {companyName.charAt(0)}
            </span>
          </div>
        )}
        
        <h1 className="text-3xl font-bold mb-2 text-gray-800">{companyName}</h1>
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin text-[#9b87f5]" />
          <span>Redirecting to dashboard...</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
