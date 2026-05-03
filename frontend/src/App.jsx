import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Apis from './pages/Apis';
import ApiDetail from './pages/ApiDetail';
import Keys from './pages/Keys';
import Usage from './pages/Usage';
import Settings from './pages/Settings';
import PaymentPage from './pages/PaymentPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/apis" element={<Apis />} />
              <Route path="/apis/:id" element={<ApiDetail />} />
              <Route path="/keys" element={<Keys />} />
              <Route path="/usage" element={<Usage />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route path="/payment" element={<PaymentPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111118',
              border: '1px solid #2a2a3a',
              color: '#e2e8f0',
              fontSize: '13px',
              borderRadius: '10px',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#111118' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#111118' } },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;