
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useLocalStorage } from '@/hooks/use-local-storage';

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useLocalStorage<string>('language', 'ar');
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('darkMode', false);

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Change language
  const changeLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    document.documentElement.className = lang === 'ar' ? 'direction-rtl' : 'direction-ltr';
  };

  // Set initial dark mode and language direction on component mount
  useEffect(() => {
    // Set dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Set language direction
    document.documentElement.className = currentLanguage === 'ar' ? 'direction-rtl' : 'direction-ltr';
    
    // Re-apply dark mode class if needed (since the language change overwrites the class)
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, [darkMode, currentLanguage]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar 
        toggleSidebar={toggleSidebar} 
        toggleDarkMode={toggleDarkMode} 
        darkMode={darkMode}
        currentLanguage={currentLanguage}
        changeLanguage={changeLanguage}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={collapsed} />
        <main className="flex-1 overflow-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
