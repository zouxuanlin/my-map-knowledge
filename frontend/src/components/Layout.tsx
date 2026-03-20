import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Avatar, Dropdown, theme } from 'antd';
import {
  HomeOutlined,
  PlusOutlined,
  SettingOutlined,
  UserOutlined,
  BarChartOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import useAuthStore from '../stores/authStore';

const { Header, Sider, Content } = AntLayout;

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">知识地图</Link>,
    },
    {
      key: '/node/new',
      icon: <PlusOutlined />,
      label: <Link to="/node/new">新建节点</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'admin',
      icon: <SettingOutlined />,
      label: '管理后台',
      children: [
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
      ],
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      label: '退出登录',
      onClick: () => {
        clearAuth();
        navigate('/login');
      },
    },
  ];

  // 仅管理员显示管理菜单
  const finalMenuItems =
    user?.role === 'admin'
      ? menuItems
      : menuItems.filter((item) => item.key !== 'admin' && item.type !== 'divider');

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="80"
        onBreakpoint={(broken) => setCollapsed(broken)}
      >
        <div className="h-16 flex items-center justify-center text-white text-lg font-bold">
          {collapsed ? '地图' : '知识地图'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={finalMenuItems}
        />
      </Sider>
      <AntLayout>
        <Header style={{ padding: '0 16px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: 18, cursor: 'pointer', marginRight: 16 }
            })}
          </div>
          {user && (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <span className="hidden sm:inline">{user.username}</span>
              </div>
            </Dropdown>
          )}
        </Header>
        <Content
          style={{
            margin: '16px',
            padding: 16,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 'calc(100vh - 112px)',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
