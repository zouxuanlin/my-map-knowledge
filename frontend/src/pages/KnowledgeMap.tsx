import React, { useState, useCallback } from 'react';
import { Input, Button, Space, Modal, Tag, message, Spin } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { knowledgeService, KnowledgeNode } from '../services/knowledge.service';
import GraphView from '../components/Graph/GraphView';
import { useQuery } from '@tanstack/react-query';

const KnowledgeMap: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['knowledge'],
    queryFn: () => knowledgeService.getAll(100, 0),
  });

  const handleNodeClick = useCallback(async (nodeId: string) => {
    try {
      const node = await knowledgeService.getById(nodeId);
      setSelectedNode(node);
      setIsModalOpen(true);
    } catch (error) {
      message.error('获取节点详情失败');
    }
  }, []);

  const handleDelete = async () => {
    if (!selectedNode) return;

    try {
      await knowledgeService.delete(selectedNode.id);
      message.success('删除成功');
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      message.error('删除失败');
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 160px)', position: 'relative' }}>
      {/* 顶部搜索栏 */}
      <div style={{
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        zIndex: 1000,
        display: 'flex',
        gap: 12,
      }}>
        <Input
          placeholder="搜索知识点..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onPressEnter={() => refetch()}
          style={{ maxWidth: 400 }}
          size="large"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => window.location.href = '/node/new'}
        >
          新建
        </Button>
      </div>

      {/* 图谱视图 */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin size="large" tip="加载知识图谱..." />
        </div>
      ) : (
        <GraphView
          nodes={data?.nodes || []}
          onNodeClick={handleNodeClick}
        />
      )}

      {/* 节点详情弹窗 */}
      <Modal
        title={selectedNode?.title}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="edit" icon={<EditOutlined />} onClick={() => {
            window.location.href = `/node/${selectedNode?.id}`;
          }}>
            编辑
          </Button>,
          <Button key="delete" danger icon={<DeleteOutlined />} onClick={handleDelete}>
            删除
          </Button>,
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        {selectedNode && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Tag color="blue">ID: {selectedNode.id.slice(0, 8)}</Tag>
              <Tag color="green">浏览：{selectedNode.view_count}</Tag>
              <Tag color="purple">版本：{selectedNode.version}</Tag>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: selectedNode.content_html || '<p>暂无内容</p>' }}
              style={{ maxHeight: 400, overflow: 'auto' }}
            />
            <div style={{ marginTop: 16, fontSize: 12, color: '#999' }}>
              创建于：{new Date(selectedNode.created_at).toLocaleString()}
              <br />
              更新于：{new Date(selectedNode.updated_at).toLocaleString()}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default KnowledgeMap;
