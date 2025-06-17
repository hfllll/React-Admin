import { useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { createUser, updateUser } from '../../../api/userApi';
import { ROLE_TYPES, USER_STATUS } from '../../../mock';

export default function UserForm({ user, visible, onClose }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!user;
  
  // 表单提交处理
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      if (isEditMode) {
        // 编辑模式 - 更新用户
        await updateUser(user.id, values);
        message.success('用户更新成功');
      } else {
        // 新增模式 - 创建用户
        await createUser(values);
        message.success('用户创建成功');
      }
      
      // 关闭表单并刷新列表
      onClose(true);
    } catch (error) {
      if (error.errorFields) {
        // 表单验证错误
        return;
      }
      message.error(isEditMode ? '更新用户失败' : '创建用户失败');
      console.error('表单提交错误:', error);
    } finally {
      setLoading(false);
    }
  };

  // 表单取消处理
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  // 当表单显示时初始化数据
  useState(() => {
    if (visible && isEditMode) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status
      });
    } else {
      form.resetFields();
    }
  }, [visible, user, form]);

  return (
    <Modal
      title={isEditMode ? '编辑用户' : '新增用户'}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: USER_STATUS.ACTIVE,
          role: ROLE_TYPES.USER
        }}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 3, message: '用户名至少3个字符' }
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        
        {!isEditMode && (
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}
        
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        
        <Form.Item
          name="role"
          label="角色"
          rules={[{ required: true, message: '请选择角色' }]}
        >
          <Select placeholder="请选择角色">
            <Select.Option value={ROLE_TYPES.ADMIN}>管理员</Select.Option>
            <Select.Option value={ROLE_TYPES.USER}>普通用户</Select.Option>
            <Select.Option value={ROLE_TYPES.GUEST}>访客</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select placeholder="请选择状态">
            <Select.Option value={USER_STATUS.ACTIVE}>激活</Select.Option>
            <Select.Option value={USER_STATUS.INACTIVE}>未激活</Select.Option>
            <Select.Option value={USER_STATUS.LOCKED}>锁定</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
} 