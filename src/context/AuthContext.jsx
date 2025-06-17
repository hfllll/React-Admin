import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as authLogin, logout as authLogout, getCurrentUser, hasPermission } from '../utils/auth';

// 创建认证上下文
const AuthContext = createContext(null);

// 认证上下文提供者组件
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 初始化用户状态
  useEffect(() => {
    const user = getCurrentUser();
    setUser(user);
    setLoading(false);
  }, []);

  // 登录函数
  const login = async (username, password) => {
    const user = authLogin(username, password);
    if (user) {
      setUser(user);
      return { success: true, user };
    }
    return { success: false, message: '用户名或密码错误' };
  };

  // 登出函数
  const logout = () => {
    authLogout();
    setUser(null);
    navigate('/login');
  };

  // 检查是否有权限访问某个路由
  const checkPermission = (path) => {
    return hasPermission(path);
  };

  // 上下文值
  const value = {
    user,
    loading,
    login,
    logout,
    checkPermission,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义钩子，用于在组件中访问认证上下文
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 