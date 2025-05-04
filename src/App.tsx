
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
import { PermissionsProvider } from './contexts/PermissionsContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
      <PermissionsProvider>
        <BrowserRouter>
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
              <Route path="salary-statements" element={<SalaryStatements />} />
              <Route path="clients" element={<Clients />} />
              <Route path="reports" element={<Reports />} />
              <Route path="time-tracking" element={<TimeTracking />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="admin" element={<Admin />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PermissionsProvider>
    </QueryClientProvider>
  );
}

export default App;
