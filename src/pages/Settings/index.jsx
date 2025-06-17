import { useState } from 'react';
import { Card, Tabs, Form, Switch, Select, Button, message, Typography } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Title } = Typography;

// 模拟设置数据
const initialSettings = {
  theme: 'light',
  notifications: true,
  language: 'zh-CN',
  autoLogout: false,
  autoLogoutTime: 30,
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [generalForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  
  // 提交通用设置
  const handleGeneralSubmit = (values) => {
    message.success('设置保存成功');
    console.log('通用设置:', values);
  };
  
  // 提交安全设置
  const handleSecuritySubmit = (values) => {
    message.success('安全设置保存成功');
    console.log('安全设置:', values);
  };
  
  // 标签页内容
  const tabItems = [
    {
      key: 'general',
      label: '通用设置',
      children: (
        <Form
          form={generalForm}
          layout="vertical"
          initialValues={{
            theme: initialSettings.theme,
            notifications: initialSettings.notifications,
            language: initialSettings.language,
          }}
          onFinish={handleGeneralSubmit}
        >
          <Form.Item
            name="theme"
            label="主题"
          >
            <Select>
              <Select.Option value="light">浅色</Select.Option>
              <Select.Option value="dark">深色</Select.Option>
              <Select.Option value="system">跟随系统</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="language"
            label="语言"
          >
            <Select>
              <Select.Option value="zh-CN">中文</Select.Option>
              <Select.Option value="en-US">English</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="notifications"
            label="通知"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
              保存设置
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'security',
      label: '安全设置',
      children: (
        <Form
          form={securityForm}
          layout="vertical"
          initialValues={{
            autoLogout: initialSettings.autoLogout,
            autoLogoutTime: initialSettings.autoLogoutTime,
          }}
          onFinish={handleSecuritySubmit}
        >
          <Form.Item
            name="autoLogout"
            label="自动登出"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item
            name="autoLogoutTime"
            label="自动登出时间（分钟）"
            dependencies={['autoLogout']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!getFieldValue('autoLogout') || value >= 5) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('时间应不少于5分钟'));
                },
              }),
            ]}
          >
            <Select disabled={securityForm.getFieldValue('autoLogout') === false}>
              <Select.Option value={5}>5</Select.Option>
              <Select.Option value={10}>10</Select.Option>
              <Select.Option value={15}>15</Select.Option>
              <Select.Option value={30}>30</Select.Option>
              <Select.Option value={60}>60</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
              保存设置
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];
  
  return (
    <div>
      <Title level={2}>系统设置</Title>
      
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>
    </div>
  );
} 