import React from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Typography } from 'antd';
import {
  NodeIndexOutlined,
  UsergroupAddOutlined,
  EyeOutlined,
  LinkOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const Analytics: React.FC = () => {
  // 模拟数据
  const statistics = {
    totalNodes: 156,
    totalUsers: 48,
    totalViews: 12340,
    totalRelations: 89,
  };

  const userData = [
    { key: '1', username: 'admin', email: 'admin@example.com', role: 'admin', status: 'active' },
    { key: '2', username: 'editor1', email: 'editor1@example.com', role: 'editor', status: 'active' },
    { key: '3', username: 'viewer1', email: 'viewer1@example.com', role: 'viewer', status: 'active' },
  ];

  const userColumns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '角色', dataIndex: 'role', key: 'role' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ color: status === 'active' ? '#52c41a' : '#999' }}>
          {status === 'active' ? '活跃' : '离线'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>数据概览</Title>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 32 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="知识节点"
              value={statistics.totalNodes}
              prefix={<NodeIndexOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="注册用户"
              value={statistics.totalUsers}
              prefix={<UsergroupAddOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总浏览量"
              value={statistics.totalViews}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="关联关系"
              value={statistics.totalRelations}
              prefix={<LinkOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 活跃度分析 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="用户活跃度">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>今日活跃</span>
                <span>75%</span>
              </div>
              <Progress percent={75} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>本周活跃</span>
                <span>85%</span>
              </div>
              <Progress percent={85} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>本月活跃</span>
                <span>92%</span>
              </div>
              <Progress percent={92} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="最近用户" size="small">
            <Table
              columns={userColumns}
              dataSource={userData}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
