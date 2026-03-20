import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Space, Switch, Row, Col } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { knowledgeService } from '../services/knowledge.service';
import MarkdownEditor from '../components/Editor/MarkdownEditor';

const { TextArea } = Input;

const NodeEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(!!id);

  useEffect(() => {
    if (id) {
      loadNode();
    }
  }, [id]);

  const loadNode = async () => {
    try {
      setLoading(true);
      const node = await knowledgeService.getById(id);
      form.setFieldsValue({
        title: node.title,
        content: node.content,
        is_public: node.is_public,
      });
    } catch (error) {
      message.error('加载节点失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      if (id) {
        await knowledgeService.update(id, values);
        message.success('更新成功');
      } else {
        const newNode = await knowledgeService.create(values);
        message.success('创建成功');
        navigate(`/node/${newNode.id}`);
      }
    } catch (error: any) {
      message.error(error.response?.data?.error || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          返回
        </Button>
        <span style={{ fontSize: 18, fontWeight: 600 }}>
          {isEdit ? '编辑节点' : '新建节点'}
        </span>
      </Space>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="输入节点标题" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Markdown 内容" name="content">
                <MarkdownEditor />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="预览">
                <Card
                  size="small"
                  style={{ minHeight: 400, maxHeight: 600, overflow: 'auto' }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: form.getFieldValue('content')
                        ? marked.parse(form.getFieldValue('content'))
                        : '<p style="color: #999">预览区域</p>',
                    }}
                  />
                </Card>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="公开可见"
            name="is_public"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="公开" unCheckedChildren="私有" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                {isEdit ? '保存' : '创建'}
              </Button>
              <Button onClick={() => navigate(-1)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

// 简单的 Markdown 解析
const marked = {
  parse: (text: string) => {
    if (!text) return '';
    // 简单的 Markdown 转 HTML
    return text
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
      .replace(/\*(.*)\*/gim, '<i>$1</i>')
      .replace(/\n/gim, '<br />');
  },
};

export default NodeEditor;
