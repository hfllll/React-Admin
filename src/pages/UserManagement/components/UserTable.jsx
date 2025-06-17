import { Table, Space, Button, Popconfirm, Tag, message, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { deleteUser } from '../../../api/userApi';
import { ROLE_TYPES, USER_STATUS } from '../../../mock';

// 角色标签样式配置
const roleColors = {
  [ROLE_TYPES.ADMIN]: 'red',
  [ROLE_TYPES.USER]: 'blue',
  [ROLE_TYPES.GUEST]: 'gray'
};

// 状态标签样式配置
const statusColors = {
  [USER_STATUS.ACTIVE]: 'green',
  [USER_STATUS.INACTIVE]: 'orange',
  [USER_STATUS.LOCKED]: 'red'
};

export default function UserTable({ users, loading, pagination, onChange, onEdit, onRefresh }) {
  // 处理用户删除
  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      message.success('用户删除成功');
      onRefresh();
    } catch (error) {
      message.error('删除用户失败');
      console.error('删除用户失败:', error);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar) => <Avatar src={avatar} icon={<UserOutlined />} />
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      sorter: true
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      sorter: true
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      sorter: true,
      render: (role) => (
        <Tag color={roleColors[role] || 'default'}>
          {role.toUpperCase()}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status) => (
        <Tag color={statusColors[status] || 'default'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (date) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="确定要删除此用户吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              size="small" 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      dataSource={users}
      columns={columns}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条记录`
      }}
      loading={loading}
      onChange={onChange}
    />
  );
} 