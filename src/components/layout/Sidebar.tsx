
import React from 'react';
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
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
}

interface NavItem {
  title: string;
  icon: React.ReactNode;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navItems: NavItem[] = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { title: 'Tasks', icon: <CheckSquare size={20} />, path: '/tasks' },
    { title: 'Projects', icon: <Folder size={20} />, path: '/projects' },
    { title: 'Team', icon: <Users size={20} />, path: '/team' },
    { title: 'Clients', icon: <UserCircle size={20} />, path: '/clients' },
    { title: 'Invoices', icon: <Receipt size={20} />, path: '/invoices' },
    { title: 'Payments', icon: <CreditCard size={20} />, path: '/payments' },
    { title: 'Reports', icon: <LineChart size={20} />, path: '/reports' },
    { title: 'Time Tracking', icon: <Clock size={20} />, path: '/time-tracking' },
    { title: 'Notifications', icon: <Bell size={20} />, path: '/notifications' },
    { title: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <aside 
      className={cn(
        "bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
        {!collapsed ? (
          <h1 className="text-lg font-bold text-white">Jazayer CRM</h1>
        ) : (
          <h1 className="text-xl font-bold text-white">J</h1>
        )}
      </div>
      <nav className="py-4">
        <ul className="space-y-2 px-2">
          {navItems.map((item, index) => (
            <li key={index}>
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
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
