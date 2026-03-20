import api from './api';

export interface KnowledgeNode {
  id: string;
  title: string;
  content?: string;
  content_html?: string;
  creator_id?: string;
  parent_id?: string;
  is_public: boolean;
  view_count: number;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface GraphData {
  nodes: Array<{
    id: string;
    title: string;
    created_at: string;
  }>;
  links: Array<{
    source: string;
    target: string;
    relation_type: string;
    strength: number;
  }>;
}

export const knowledgeService = {
  // 获取图谱数据
  getGraphData: async (): Promise<GraphData> => {
    const response = await api.get('/knowledge/graph');
    return response.data;
  },

  // 获取所有节点
  getAll: async (limit = 50, offset = 0, search?: string) => {
    const params: Record<string, any> = { limit, offset };
    if (search) params.search = search;
    const response = await api.get('/knowledge', { params });
    return response.data;
  },

  // 获取单个节点
  getById: async (id: string): Promise<KnowledgeNode> => {
    const response = await api.get(`/knowledge/${id}`);
    return response.data;
  },

  // 创建节点
  create: async (data: {
    title: string;
    content?: string;
    parent_id?: string;
    is_public?: boolean;
    tag_ids?: string[];
  }) => {
    const response = await api.post('/knowledge', data);
    return response.data;
  },

  // 更新节点
  update: async (
    id: string,
    data: {
      title?: string;
      content?: string;
      is_public?: boolean;
      tag_ids?: string[];
    }
  ) => {
    const response = await api.put(`/knowledge/${id}`, data);
    return response.data;
  },

  // 删除节点
  delete: async (id: string) => {
    const response = await api.delete(`/knowledge/${id}`);
    return response.data;
  },
};
