import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import Users from './pages/Users';
import Forbidden from './pages/Forbidden';
import NotFound from './pages/NotFound';
import './App.css';
import './theme/dark-theme.css';

function App() {
  // Layout for protected routes: shows Navbar and renders nested routes via Outlet
  const ProtectedLayout = () => (
    <>
      <Navbar />
      <div className="App">
        <Outlet />
      </div>
    </>
  );

  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes grouped under PrivateRoute + layout */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <ProtectedLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="items" element={<Items />} />
              <Route path="users" element={<Users />} />
              <Route path="forbidden" element={<Forbidden />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Fallback for any other unmatched public routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;