import { useState } from 'react';
import { Card, Form, Input, Button, Checkbox, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Title } = Typography;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 获取用户想要访问的页面
  const from = location.state?.from?.pathname || '/dashboard';
  
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { username, password } = values;
      
      const result = await login(username, password);
      
      if (result.success) {
        message.success('登录成功');
        navigate(from, { replace: true });
      } else {
        message.error(result.message || '登录失败');
      }
    } catch (error) {
      message.error('登录过程中发生错误');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>管理系统登录</Title>
        </div>
        
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名 (admin / user)" 
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码 (admin123 / user123)" 
            />
          </Form.Item>
          
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            
            <a style={{ float: 'right' }} href="#">
              忘记密码?
            </a>
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ width: '100%' }}
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 