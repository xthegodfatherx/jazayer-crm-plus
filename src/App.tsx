
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import Estimates from './pages/Estimates';
import Subscriptions from './pages/Subscriptions';
import Products from './pages/Products';
import Expenses from './pages/Expenses';
import Team from './pages/Team';
import SalaryStatements from './pages/SalaryStatements';
import Clients from './pages/Clients';
import Reports from './pages/Reports';
import TimeTracking from './pages/TimeTracking';
import Notifications from './pages/Notifications';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthGuard } from './components/auth/AuthGuard';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="projects" element={<Projects />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="payments" element={<Payments />} />
              <Route path="estimates" element={<Estimates />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="products" element={<Products />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="team" element={<Team />} />
              
              {/* Protected routes with specific permissions */}
              <Route element={<AuthGuard requiredPermission="salary.manage" />}>
                <Route path="salary-statements" element={<SalaryStatements />} />
              </Route>
              
              <Route path="clients" element={<Clients />} />
              
              <Route element={<AuthGuard requiredPermission="reports.access" />}>
                <Route path="reports" element={<Reports />} />
              </Route>
              
              <Route path="time-tracking" element={<TimeTracking />} />
              <Route path="notifications" element={<Notifications />} />
              
              <Route element={<AuthGuard requiredPermission="admin.access" />}>
                <Route path="admin" element={<Admin />} />
              </Route>
              
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
