import { Router } from 'express';
import { KnowledgeNodeModel, CreateNodeDTO, UpdateNodeDTO } from '../models/knowledge-node.model';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { marked } from 'marked';

const router = Router();

// 获取知识图谱数据
router.get('/graph', async (req, res, next) => {
  try {
    const graphData = await KnowledgeNodeModel.getGraphData();
    res.json(graphData);
  } catch (error) {
    next(error);
  }
});

// 获取所有节点（分页）
router.get('/', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const search = req.query.search as string;

    let nodes;
    if (search) {
      nodes = await KnowledgeNodeModel.search(search);
    } else {
      nodes = await KnowledgeNodeModel.findAll(limit, offset);
    }

    res.json({ nodes, total: nodes.length });
  } catch (error) {
    next(error);
  }
});

// 获取单个节点
router.get('/:id', async (req, res, next) => {
  try {
    const node = await KnowledgeNodeModel.findById(req.params.id);
    if (!node) {
      throw new AppError('节点不存在', 404);
    }

    // 增加浏览次数
    await KnowledgeNodeModel.incrementViewCount(node.id);

    res.json(node);
  } catch (error) {
    next(error);
  }
});

// 创建节点（需要认证）
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { title, content, parent_id, is_public, tag_ids } = req.body;

    if (!title) {
      throw new AppError('标题不能为空', 400);
    }

    // 自动生成 HTML
    const content_html = content ? marked.parse(content) as string : undefined;

    const nodeData: CreateNodeDTO = {
      title,
      content,
      content_html,
      creator_id: req.user?.id,
      parent_id,
      is_public,
    };

    const node = await KnowledgeNodeModel.create(nodeData);

    // 关联标签
    if (tag_ids && tag_ids.length > 0) {
      const pool = (await import('../config/database')).default;
      for (const tagId of tag_ids) {
        await pool.query(
          'INSERT INTO node_tags (node_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [node.id, tagId]
        );
      }
    }

    res.status(201).json(node);
  } catch (error) {
    next(error);
  }
});

// 更新节点（需要认证）
router.put('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const node = await KnowledgeNodeModel.findById(req.params.id);
    if (!node) {
      throw new AppError('节点不存在', 404);
    }

    // 检查权限：只有创建者或管理员可以编辑
    if (node.creator_id !== req.user?.id && req.user?.role !== 'admin') {
      throw new AppError('无权限编辑', 403);
    }

    const updateData: UpdateNodeDTO = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.content !== undefined) {
      updateData.content = req.body.content;
      updateData.content_html = req.body.content ? marked.parse(req.body.content) as string : undefined;
    }
    if (req.body.is_public !== undefined) updateData.is_public = req.body.is_public;

    const updatedNode = await KnowledgeNodeModel.update(req.params.id, updateData);

    // 更新标签
    if (req.body.tag_ids !== undefined) {
      const pool = (await import('../config/database')).default;
      await pool.query('DELETE FROM node_tags WHERE node_id = $1', [req.params.id]);
      for (const tagId of req.body.tag_ids) {
        await pool.query(
          'INSERT INTO node_tags (node_id, tag_id) VALUES ($1, $2)',
          [req.params.id, tagId]
        );
      }
    }

    res.json(updatedNode);
  } catch (error) {
    next(error);
  }
});

// 删除节点（需要认证）
router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const node = await KnowledgeNodeModel.findById(req.params.id);
    if (!node) {
      throw new AppError('节点不存在', 404);
    }

    // 检查权限：只有创建者或管理员可以删除
    if (node.creator_id !== req.user?.id && req.user?.role !== 'admin') {
      throw new AppError('无权限删除', 403);
    }

    const deleted = await KnowledgeNodeModel.delete(req.params.id);
    if (!deleted) {
      throw new AppError('删除失败', 500);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
