import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 受保护的路由组件
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, checkPermission, loading } = useAuth();
  const location = useLocation();
  
  // 处理加载状态
  if (loading) {
    return <div>加载中...</div>;
  }
  
  // 如果用户未认证，重定向到登录页面
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // 检查用户是否有权限访问当前路由
  if (!checkPermission(location.pathname)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // 用户已认证且有权限访问
  return children;
} 