import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Typography } from 'antd';
import {
  BarChartOutlined,
  TeamOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Analytics from './Analytics';
import UserManagement from './UserManagement';
import Settings from './Settings';

const { Sider, Content } = AntLayout;
const { Title } = Typography;

const AdminDashboard: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/admin',
      icon: <BarChartOutlined />,
      label: <Link to="/admin">数据分析</Link>,
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: <Link to="/admin/users">用户管理</Link>,
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings">系统设置</Link>,
    },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 160px)' }}>
      <Title level={2} style={{ marginBottom: 24 }}>管理后台</Title>
      <AntLayout style={{ background: '#fff' }}>
        <Sider width={200} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
          />
        </Sider>
        <Content style={{ padding: 24 }}>
          <Routes>
            <Route index element={<Analytics />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </Content>
      </AntLayout>
    </div>
  );
};

export default AdminDashboard;
