import pool from '../config/database';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
}

export class UserModel {
  static async findById(id: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByUsername(username: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  static async create(data: CreateUserDTO, passwordHash: string): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, role, avatar_url, created_at, updated_at`,
      [data.username, data.email, passwordHash]
    );
    return result.rows[0];
  }

  static async updateRole(id: string, role: string): Promise<User | null> {
    const result = await pool.query(
      `UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [role, id]
    );
    return result.rows[0];
  }

  static async findAll(limit: number = 50, offset: number = 0): Promise<{ users: User[]; total: number }> {
    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count);

    const result = await pool.query(
      'SELECT id, username, email, role, avatar_url, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return { users: result.rows, total };
  }
}
