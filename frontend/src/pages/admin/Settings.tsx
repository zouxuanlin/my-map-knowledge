import React from 'react';
import { Form, Input, Button, Card, message, Space, Switch, Divider, Typography } from 'antd';
import { SaveOutlined, SyncOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Settings: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    message.success('设置保存成功');
  };

  const handleBackup = () => {
    message.success('备份已创建');
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>系统设置</Title>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 站点配置 */}
        <Card title="站点配置" size="small">
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="站点名称"
              name="siteName"
              initialValue="知识地图"
              rules={[{ required: true, message: '请输入站点名称' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="站点描述" name="siteDescription" initialValue="个人知识管理平台">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item label="公告内容" name="announcement" initialValue="">
              <Input.TextArea rows={2} placeholder="在首页显示的公告内容" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
                保存配置
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* 功能开关 */}
        <Card title="功能开关" size="small">
          <Form layout="vertical">
            <Form.Item label="允许用户注册">
              <Switch defaultChecked />
              <Text type="secondary" style={{ marginLeft: 12 }}>关闭后新用户无法注册</Text>
            </Form.Item>
            <Form.Item label="公开节点无需登录">
              <Switch defaultChecked={false} />
              <Text type="secondary" style={{ marginLeft: 12 }}>允许访客查看公开节点</Text>
            </Form.Item>
            <Form.Item label="AI 智能推荐">
              <Switch defaultChecked />
              <Text type="secondary" style={{ marginLeft: 12 }}>自动推荐相关知识节点</Text>
            </Form.Item>
          </Form>
        </Card>

        {/* 数据管理 */}
        <Card title="数据管理" size="small">
          <Space>
            <Button icon={<SyncOutlined />} onClick={handleBackup}>
              创建备份
            </Button>
            <Button danger>清空缓存</Button>
            <Button danger>重置系统</Button>
          </Space>
          <Divider />
          <Text type="secondary">
            最后备份时间：2024-01-15 10:30:00
          </Text>
        </Card>
      </Space>
    </div>
  );
};

export default Settings;
