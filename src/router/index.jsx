import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import UserManagement from '../pages/UserManagement';
import Settings from '../pages/Settings';
import Unauthorized from '../pages/Unauthorized';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 公共路由 */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* 受保护的管理系统路由 */}
          <Route path="/" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* 未匹配的路由重定向到控制台 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
} 