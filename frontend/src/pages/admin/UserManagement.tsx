import React, { useState } from 'react';
import { Table, Button, Tag, Space, Modal, message, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface User {
  key: string;
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // 模拟数据
  const dataSource: User[] = [
    {
      key: '1',
      id: 'uuid-1',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      created_at: '2024-01-01 10:00:00',
    },
    {
      key: '2',
      id: 'uuid-2',
      username: 'editor1',
      email: 'editor1@example.com',
      role: 'editor',
      status: 'active',
      created_at: '2024-01-02 11:00:00',
    },
    {
      key: '3',
      id: 'uuid-3',
      username: 'viewer1',
      email: 'viewer1@example.com',
      role: 'viewer',
      status: 'active',
      created_at: '2024-01-03 12:00:00',
    },
  ];

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
      render: (role: string) => {
        const colorMap: Record<string, string> = {
          admin: 'red',
          editor: 'blue',
          viewer: 'green',
        };
        return <Tag color={colorMap[role] || 'default'}>{role}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '活跃' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => message.info(`编辑用户：${record.username}`)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => message.warning(`删除用户：${record.username}`)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Title level={4}>用户管理</Title>
        <Button type="primary" icon={<UserAddOutlined />}>
          添加用户
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default UserManagement;
