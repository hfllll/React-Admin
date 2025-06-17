import { useState, useEffect } from 'react';
import { Button, Card, Input, Space, Typography } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { getUsers } from '../../api/userApi';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';

const { Title } = Typography;

export default function UserManagement() {
  // 状态定义
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [sortInfo, setSortInfo] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // 加载用户数据
  const loadUsers = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getUsers({
        page: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        search: searchText,
        sortField: sortInfo?.field,
        sortOrder: sortInfo?.order
      });
      
      setUsers(response.data);
      setPagination({
        current: response.pagination.page,
        pageSize: response.pagination.pageSize,
        total: response.pagination.total
      });
    } catch (error) {
      console.error('加载用户失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadUsers();
  }, []);

  // 表格变化处理
  const handleTableChange = (newPagination, _, sorter) => {
    setSortInfo(sorter.field ? { field: sorter.field, order: sorter.order } : null);
    loadUsers({
      current: newPagination.current,
      pageSize: newPagination.pageSize
    });
  };

  // 搜索处理
  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    loadUsers({ current: 1 });
  };

  // 处理搜索框回车
  const handleSearchInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 打开用户表单
  const showUserForm = (user = null) => {
    setCurrentUser(user);
    setFormVisible(true);
  };

  // 关闭用户表单
  const closeUserForm = (shouldRefresh = false) => {
    setFormVisible(false);
    setCurrentUser(null);
    if (shouldRefresh) {
      loadUsers();
    }
  };

  return (
    <div>
      <Title level={2}>用户管理</Title>
      
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Input
            placeholder="搜索用户名或邮箱"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onKeyDown={handleSearchInputKeyDown}
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
          <Space>
            <Button type="primary" onClick={handleSearch}>
              搜索
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => showUserForm()}
            >
              新增用户
            </Button>
          </Space>
        </Space>
        
        <UserTable 
          users={users}
          loading={loading}
          pagination={pagination}
          onEdit={showUserForm}
          onChange={handleTableChange}
          onRefresh={loadUsers}
        />
      </Card>

      {formVisible && (
        <UserForm
          user={currentUser}
          visible={formVisible}
          onClose={closeUserForm}
        />
      )}
    </div>
  );
} 