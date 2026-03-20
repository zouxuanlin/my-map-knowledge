import pool from '../config/database';

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
  created_at: Date;
  updated_at: Date;
}

export interface CreateNodeDTO {
  title: string;
  content?: string;
  content_html?: string;
  creator_id?: string;
  parent_id?: string;
  is_public?: boolean;
  tag_ids?: string[];
}

export interface UpdateNodeDTO {
  title?: string;
  content?: string;
  content_html?: string;
  is_public?: boolean;
  tag_ids?: string[];
}

export class KnowledgeNodeModel {
  static async findById(id: string): Promise<KnowledgeNode | null> {
    const result = await pool.query('SELECT * FROM knowledge_nodes WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findAll(limit: number = 100, offset: number = 0): Promise<KnowledgeNode[]> {
    const result = await pool.query(
      'SELECT * FROM knowledge_nodes ORDER BY updated_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  static async search(query: string): Promise<KnowledgeNode[]> {
    const result = await pool.query(
      `SELECT * FROM knowledge_nodes
       WHERE title ILIKE $1 OR content ILIKE $1
       ORDER BY updated_at DESC`,
      [`%${query}%`]
    );
    return result.rows;
  }

  static async create(data: CreateNodeDTO): Promise<KnowledgeNode> {
    const { title, content, content_html, creator_id, parent_id, is_public = true } = data;
    const result = await pool.query(
      `INSERT INTO knowledge_nodes (title, content, content_html, creator_id, parent_id, is_public)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, content || null, content_html || null, creator_id || null, parent_id || null, is_public]
    );
    return result.rows[0];
  }

  static async update(id: string, data: UpdateNodeDTO): Promise<KnowledgeNode | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(data.title);
    }
    if (data.content !== undefined) {
      fields.push(`content = $${paramIndex++}`);
      values.push(data.content);
    }
    if (data.content_html !== undefined) {
      fields.push(`content_html = $${paramIndex++}`);
      values.push(data.content_html);
    }
    if (data.is_public !== undefined) {
      fields.push(`is_public = $${paramIndex++}`);
      values.push(data.is_public);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`version = version + 1`);
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE knowledge_nodes SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM knowledge_nodes WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  static async incrementViewCount(id: string): Promise<void> {
    await pool.query('UPDATE knowledge_nodes SET view_count = view_count + 1 WHERE id = $1', [id]);
  }

  static async findByCreator(creatorId: string): Promise<KnowledgeNode[]> {
    const result = await pool.query(
      'SELECT * FROM knowledge_nodes WHERE creator_id = $1 ORDER BY created_at DESC',
      [creatorId]
    );
    return result.rows;
  }

  static async getGraphData(): Promise<{ nodes: any[]; links: any[] }> {
    // 获取所有公开节点
    const nodesResult = await pool.query(
      `SELECT id, title, created_at FROM knowledge_nodes WHERE is_public = true LIMIT 100`
    );

    // 获取所有关系
    const linksResult = await pool.query(
      `SELECT source_node_id, target_node_id, relation_type, strength
       FROM node_relations`
    );

    return {
      nodes: nodesResult.rows.map((n: any) => ({
        id: n.id,
        title: n.title,
        created_at: n.created_at,
      })),
      links: linksResult.rows.map((r: any) => ({
        source: r.source_node_id,
        target: r.target_node_id,
        relation_type: r.relation_type,
        strength: r.strength,
      })),
    };
  }
}
