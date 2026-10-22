import { pool } from '../config/db.js';

export interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
}

export async function findByEmail(email: string): Promise<UserRow | null> {
  const { rows } = await pool.query<UserRow>(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return rows[0] || null;
}

export async function findById(id: number): Promise<UserRow | null> {
  const { rows } = await pool.query<UserRow>(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

export async function create(email: string, passwordHash: string): Promise<UserRow> {
  const { rows } = await pool.query<UserRow>(
    `INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING *`,
    [email, passwordHash]
  );
  return rows[0]!;
}
