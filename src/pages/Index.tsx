
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/contexts/PermissionsContext";

const Index = () => {
  const navigate = useNavigate();
  const { userRole } = usePermissions();
  
  useEffect(() => {
    // Redirect based on user role
    if (userRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/'); // For manager, employee, client - redirect to main dashboard
    }
  }, [navigate, userRole]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Redirecting to Dashboard...</h1>
      </div>
    </div>
  );
};

export default Index;
