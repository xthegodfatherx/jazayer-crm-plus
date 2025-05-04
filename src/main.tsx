
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Check for saved dark mode preference
const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// Check for saved language preference and set direction
const currentLanguage = localStorage.getItem('language') || 'ar';
document.documentElement.className = currentLanguage === 'ar' 
  ? 'direction-rtl' 
  : 'direction-ltr';

// Re-apply dark mode if needed
if (isDarkMode) {
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById("root")!).render(<App />);
