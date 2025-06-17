import { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  DashboardOutlined, 
  UserOutlined, 
  SettingOutlined, 
  LogoutOutlined 
} from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_TYPES } from '../mock';

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // 处理菜单折叠
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  
  // 获取当前选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return ['dashboard'];
    if (path.includes('users')) return ['users'];
    if (path.includes('settings')) return ['settings'];
    return ['dashboard'];
  };
  
  // 用户菜单项
  const userMenu = [
    {
      key: 'profile',
      label: '个人资料',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile')
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: logout
    }
  ];
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ color: 'white', fontWeight: 'bold' }}>
            {collapsed ? 'AD' : 'Admin Dashboard'}
          </span>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={getSelectedKey()}
          style={{ borderRight: 0 }}
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: <Link to="/dashboard">控制台</Link>,
            },
            user?.role === ROLE_TYPES.ADMIN && {
              key: 'users',
              icon: <UserOutlined />,
              label: <Link to="/users">用户管理</Link>,
            },
            user?.role === ROLE_TYPES.ADMIN && {
              key: 'settings',
              icon: <SettingOutlined />,
              label: <Link to="/settings">系统设置</Link>,
            }
          ].filter(Boolean)}
        />
      </Sider>
      
      <Layout>
        <Header style={{ padding: 0, background: '#fff', display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            type="text" 
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
            onClick={toggleCollapsed} 
            style={{ fontSize: '16px', width: 64, height: 64 }} 
          />
          
          <div style={{ marginRight: 20 }}>
            <Dropdown
              menu={{ items: userMenu }}
              placement="bottomRight"
              arrow
            >
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar src={user?.avatar} icon={<UserOutlined />} />
                <span style={{ marginLeft: 8 }}>{user?.username}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
} 