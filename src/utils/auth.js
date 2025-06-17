import { defaultUsers, routePermissions } from '../mock';

// 用户本地存储键
const USER_KEY = 'admin_user';

// 登录函数
export const login = (username, password) => {
  const user = defaultUsers.find(
    u => u.username === username && u.password === password
  );
  
  if (user) {
    // 不存储密码
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }
  
  return null;
};

// 登出函数
export const logout = () => {
  localStorage.removeItem(USER_KEY);
};

// 获取当前用户
export const getCurrentUser = () => {
  const userJson = localStorage.getItem(USER_KEY);
  if (userJson) {
    return JSON.parse(userJson);
  }
  return null;
};

// 检查用户是否已登录
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// 检查用户是否有权限访问特定路由
export const hasPermission = (path) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  const userPermissions = routePermissions[user.role] || [];
  return userPermissions.some(route => path.includes(route));
}; 