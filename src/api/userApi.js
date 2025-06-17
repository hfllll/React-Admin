import { allUsers } from '../mock';

// 模拟数据库
let users = [...allUsers];

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 获取用户列表（支持分页、搜索和排序）
export const getUsers = async (params) => {
  await delay(500); // 模拟网络延迟
  
  const { page = 1, pageSize = 10, search = '', sortField, sortOrder } = params;
  
  // 筛选
  let filteredUsers = [...users];
  if (search) {
    const searchLower = search.toLowerCase();
    filteredUsers = filteredUsers.filter(user => 
      user.username.toLowerCase().includes(searchLower) || 
      user.email.toLowerCase().includes(searchLower)
    );
  }
  
  // 排序
  if (sortField && sortOrder) {
    filteredUsers.sort((a, b) => {
      let comparison = 0;
      
      if (a[sortField] < b[sortField]) {
        comparison = -1;
      } else if (a[sortField] > b[sortField]) {
        comparison = 1;
      }
      
      return sortOrder === 'ascend' ? comparison : -comparison;
    });
  }
  
  // 计算总记录数
  const total = filteredUsers.length;
  
  // 分页
  const startIndex = (page - 1) * pageSize;
  const pagedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);
  
  return {
    data: pagedUsers,
    pagination: {
      total,
      page,
      pageSize
    }
  };
};

// 获取单个用户
export const getUserById = async (id) => {
  await delay(300);
  return users.find(user => user.id === id);
};

// 创建用户
export const createUser = async (userData) => {
  await delay(500);
  
  // 生成新ID
  const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  
  const newUser = {
    id: newId,
    createdAt: new Date().toISOString(),
    ...userData
  };
  
  users.push(newUser);
  return newUser;
};

// 更新用户
export const updateUser = async (id, userData) => {
  await delay(500);
  
  const index = users.findIndex(user => user.id === id);
  if (index === -1) {
    throw new Error('用户不存在');
  }
  
  // 更新用户，保留id和createdAt
  const updatedUser = {
    ...users[index],
    ...userData,
    id: users[index].id,
    createdAt: users[index].createdAt
  };
  
  users[index] = updatedUser;
  return updatedUser;
};

// 删除用户
export const deleteUser = async (id) => {
  await delay(500);
  
  const index = users.findIndex(user => user.id === id);
  if (index === -1) {
    throw new Error('用户不存在');
  }
  
  // 删除用户
  users.splice(index, 1);
  return { success: true };
}; 