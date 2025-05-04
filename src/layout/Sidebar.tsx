
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  UserCircle, 
  Receipt, 
  Settings, 
  CreditCard, 
  Bell,
  Folder,
  LineChart,
  Clock,
  ChevronDown,
  ChevronRight,
  DollarSign,
  FileText,
  Calendar,
  Package,
  Wallet,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePermissions } from '@/contexts/PermissionsContext';
import { settingsApi } from '@/services/settings-api';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface SidebarProps {
  collapsed: boolean;
}

interface NavItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  children?: NavItem[];
  requiredRole?: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['Sales']);
  const { userRole } = usePermissions() || { userRole: null };
  
  // Fetch company info using React Query
  const { data: systemSettings, isLoading } = useQuery({
    queryKey: ['companyInfo'],
    queryFn: () => settingsApi.getSystemSettings(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const toggleExpand = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title) 
        : [...prev, title]
    );
  };

  const navItems: NavItem[] = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { title: 'Tasks', icon: <CheckSquare size={20} />, path: '/tasks' },
    { title: 'Projects', icon: <Folder size={20} />, path: '/projects' },
    { 
      title: 'Sales', 
      icon: <DollarSign size={20} />, 
      path: '#',
      children: [
        { title: 'Invoices', icon: <Receipt size={18} />, path: '/invoices' },
        { title: 'Payments', icon: <CreditCard size={18} />, path: '/payments' },
        { title: 'Estimates', icon: <FileText size={18} />, path: '/estimates' },
        { title: 'Subscriptions', icon: <Calendar size={18} />, path: '/subscriptions' },
        { title: 'Products', icon: <Package size={18} />, path: '/products' },
        { title: 'Expenses', icon: <Wallet size={18} />, path: '/expenses' },
      ]
    },
    { 
      title: 'Team', 
      icon: <Users size={20} />, 
      path: '#',
      children: [
        { title: 'Members', icon: <Users size={18} />, path: '/team' },
        { title: 'Salary Statements', icon: <DollarSign size={18} />, path: '/salary-statements' },
      ]
    },
    { title: 'Clients', icon: <UserCircle size={20} />, path: '/clients' },
    { title: 'Reports', icon: <LineChart size={20} />, path: '/reports' },
    { title: 'Time Tracking', icon: <Clock size={20} />, path: '/time-tracking' },
    { title: 'Notifications', icon: <Bell size={20} />, path: '/notifications' },
    { title: 'Admin Panel', icon: <ShieldAlert size={20} />, path: '/admin', requiredRole: ['admin'] },
    { title: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  // Filter items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (!item.requiredRole) return true;
    return item.requiredRole.includes(userRole);
  });

  return (
    <aside 
      className={cn(
        "bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-center">
            {isLoading ? (
              <Skeleton className="h-10 w-10 rounded-md mr-2" />
            ) : systemSettings?.company_logo ? (
              <img 
                src={systemSettings.company_logo} 
                alt="Company Logo" 
                className="h-10 w-auto mr-2 object-contain"
              />
            ) : (
              <div className="h-10 w-10 bg-[#9b87f5] rounded-md flex items-center justify-center mr-2">
                <span className="font-bold text-white">
                  {systemSettings?.company_name?.charAt(0) || 'C'}
                </span>
              </div>
            )}
            {isLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <h1 className="text-lg font-bold text-white">
                {systemSettings?.company_name || "CRM System"}
              </h1>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {isLoading ? (
              <Skeleton className="h-10 w-10 rounded-md" />
            ) : systemSettings?.company_logo ? (
              <img 
                src={systemSettings.company_logo} 
                alt="Company Logo" 
                className="h-10 w-10 object-contain"
              />
            ) : (
              <div className="h-10 w-10 bg-[#9b87f5] rounded-md flex items-center justify-center">
                <span className="font-bold text-white">
                  {systemSettings?.company_name?.charAt(0) || 'C'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      <nav className="py-4">
        <ul className="space-y-1 px-2">
          {filteredNavItems.map((item, index) => (
            <li key={index}>
              {!item.children ? (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center py-2 px-3 rounded-md transition-colors",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                    collapsed ? "justify-center" : ""
                  )}
                >
                  {item.icon}
                  {!collapsed && <span className="ml-3">{item.title}</span>}
                </NavLink>
              ) : (
                <>
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={cn(
                      "w-full flex items-center py-2 px-3 rounded-md transition-colors text-sidebar-foreground hover:bg-sidebar-accent/50",
                      collapsed ? "justify-center" : "justify-between"
                    )}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </div>
                    {!collapsed && (
                      expandedItems.includes(item.title) 
                        ? <ChevronDown size={16} /> 
                        : <ChevronRight size={16} />
                    )}
                  </button>
                  
                  {/* Submenu */}
                  {expandedItems.includes(item.title) && !collapsed && (
                    <ul className="mt-1 ml-7 space-y-1">
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex}>
                          <NavLink
                            to={child.path}
                            className={({ isActive }) => cn(
                              "flex items-center py-1.5 px-3 rounded-md transition-colors text-sm",
                              isActive 
                                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                                : "text-sidebar-foreground/90 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            )}
                          >
                            {child.icon}
                            <span className="ml-2">{child.title}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
