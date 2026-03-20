import pool from '../config/database';

export const initDatabase = async () => {
  const queries = [
    // 用户表
    `CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'viewer',
      avatar_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // 知识节点表
    `CREATE TABLE IF NOT EXISTS knowledge_nodes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(200) NOT NULL,
      content TEXT,
      content_html TEXT,
      creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
      parent_id UUID REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
      is_public BOOLEAN DEFAULT true,
      view_count INTEGER DEFAULT 0,
      version INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // 节点关系表
    `CREATE TABLE IF NOT EXISTS node_relations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      source_node_id UUID REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
      target_node_id UUID REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
      relation_type VARCHAR(50) DEFAULT 'reference',
      strength FLOAT DEFAULT 1.0,
      created_by UUID REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(source_node_id, target_node_id)
    )`,

    // 版本记录表
    `CREATE TABLE IF NOT EXISTS node_versions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      node_id UUID REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
      content_snapshot TEXT NOT NULL,
      version_number INTEGER NOT NULL,
      change_summary VARCHAR(500),
      created_by UUID REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // 标签表
    `CREATE TABLE IF NOT EXISTS tags (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(50) UNIQUE NOT NULL,
      color VARCHAR(7) DEFAULT '#1890ff',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // 节点标签关联表
    `CREATE TABLE IF NOT EXISTS node_tags (
      node_id UUID REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
      tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (node_id, tag_id)
    )`,

    // 创建索引
    `CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_title ON knowledge_nodes(title)`,
    `CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_creator ON knowledge_nodes(creator_id)`,
    `CREATE INDEX IF NOT EXISTS idx_node_relations_source ON node_relations(source_node_id)`,
    `CREATE INDEX IF NOT EXISTS idx_node_relations_target ON node_relations(target_node_id)`,
    `CREATE INDEX IF NOT EXISTS idx_node_versions_node ON node_versions(node_id)`,
    `CREATE INDEX IF NOT EXISTS idx_node_tags_node ON node_tags(node_id)`,
  ];

  let client;
  try {
    client = await pool.connect();
    for (const query of queries) {
      await client.query(query);
    }
    console.log('所有数据表创建成功');
  } catch (error: any) {
    console.error('数据库初始化错误:', error.message);
    throw error;
  } finally {
    if (client) client.release();
  }
};
