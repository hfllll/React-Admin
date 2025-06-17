import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppRouter from './router';
import './App.css';

export default function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <AppRouter />
    </ConfigProvider>
  );
}
