import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Theme
import theme from './theme/theme';

// Context Providers
import { AuthProvider } from './constants/AuthContext';
import { NotificationProvider } from './constants/NotificationContext';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login/Login';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import IncidentManagement from './pages/IncidentManagement/IncidentManagement';
import AuditManagement from './pages/AuditManagement/AuditManagement';
import PermitManagement from './pages/PermitManagement/PermitManagement';
//import InvestigationManagement from './pages/InvestigationManagement/InvestigationManagement';
import UserManagement from './pages/UserManagement/UserManagement';
import Analytics from './pages/Analytics/Analytics';
import Settings from './pages/Settings/Settings';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="observations/*" element={<IncidentManagement />} />
                  <Route path="incidents/*" element={<IncidentManagement />} />
                  <Route path="audits/*" element={<AuditManagement />} />
                  <Route path="permits/*" element={<PermitManagement />} />
                  <Route path="users/*" element={<UserManagement />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;