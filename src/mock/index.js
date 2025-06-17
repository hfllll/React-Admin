import Mock from 'mockjs';

// 用户角色类型
export const ROLE_TYPES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
};

// 用户状态
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  LOCKED: 'locked',
};

// 随机生成100个用户数据
const users = Mock.mock({
  'list|100': [{
    'id|+1': 1,
    'username': '@name',
    'email': '@email',
    'role|1': Object.values(ROLE_TYPES),
    'status|1': Object.values(USER_STATUS),
    'createdAt': '@datetime',
    'avatar': 'https://api.dicebear.com/7.x/avataaars/svg?seed=@natural'
  }]
}).list;

// 默认用户信息 (用于登录)
export const defaultUsers = [
  { 
    id: 0, 
    username: 'admin', 
    password: 'admin123', 
    email: 'admin@example.com', 
    role: ROLE_TYPES.ADMIN,
    status: USER_STATUS.ACTIVE,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  { 
    id: -1, 
    username: 'user', 
    password: 'user123', 
    email: 'user@example.com', 
    role: ROLE_TYPES.USER,
    status: USER_STATUS.ACTIVE,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
  }
];

// 合并默认用户和随机生成的用户
export const allUsers = [...defaultUsers, ...users];

// 路由权限配置
export const routePermissions = {
  [ROLE_TYPES.ADMIN]: ['dashboard', 'users', 'settings'],
  [ROLE_TYPES.USER]: ['dashboard'],
  [ROLE_TYPES.GUEST]: [],
}; 