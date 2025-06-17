import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Typography } from 'antd';
import { UserOutlined, TeamOutlined, FileOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { allUsers } from '../../mock';
import { useAuth } from '../../context/AuthContext';

const { Title } = Typography;

export default function Dashboard() {
  const { user } = useAuth();
  const [recentUsers, setRecentUsers] = useState([]);
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    regularUsers: 0
  });
  
  useEffect(() => {
    // 计算统计数据
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter(u => u.status === 'active').length;
    const adminUsers = allUsers.filter(u => u.role === 'admin').length;
    const regularUsers = allUsers.filter(u => u.role === 'user').length;
    
    setStatistics({
      totalUsers,
      activeUsers,
      adminUsers,
      regularUsers
    });
    
    // 获取最近注册的10个用户
    const sortedUsers = [...allUsers]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
    
    setRecentUsers(sortedUsers);
  }, []);
  
  // 用户表格列定义
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: role => <span style={{ textTransform: 'capitalize' }}>{role}</span>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <span style={{ 
          color: status === 'active' ? 'green' : status === 'inactive' ? 'orange' : 'red',
          textTransform: 'capitalize'
        }}>
          {status}
        </span>
      )
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => new Date(date).toLocaleDateString()
    }
  ];
  
  return (
    <div>
      <Title level={2}>欢迎回来, {user?.username}</Title>
      <p>这是您的管理控制台概览</p>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="总用户数" 
              value={statistics.totalUsers} 
              prefix={<UserOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="活跃用户" 
              value={statistics.activeUsers} 
              prefix={<TeamOutlined />} 
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="管理员" 
              value={statistics.adminUsers} 
              prefix={<FileOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="普通用户" 
              value={statistics.regularUsers} 
              prefix={<ClockCircleOutlined />} 
            />
          </Card>
        </Col>
      </Row>
      
      <Card title="最近注册用户" style={{ marginBottom: 24 }}>
        <Table 
          dataSource={recentUsers} 
          columns={columns} 
          rowKey="id" 
          pagination={false}
        />
      </Card>
    </div>
  );
} 