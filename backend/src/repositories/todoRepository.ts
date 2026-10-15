import { pool } from '../config/db'
import type { Todo } from 'shared'

export const todoRepository = {
  async findAllByUser(userId: number): Promise<Todo[]> {
    const { rows } = await pool.query<Todo>(
      'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    return rows
  },

  async findById(id: number, userId: number): Promise<Todo | null> {
    const { rows } = await pool.query<Todo>(
      'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
      [id, userId]
    )

    return rows[0] ?? null
  },

  // async create({ userId, title, description }) {
  //   const { rows } = await pool.query(
  //     `INSERT INTO todos (user_id, title, description)
  //     VALUES ($1, $2, $3) RETURNING *`,
  //     [userId, title, description ?? null]
  //   );
  //   return rows[0];
  // },

  // async update(id, userId, fields) {
  //   // Здесь надо аккуратно собрать SET-часть из разрешённых полей
  //   // ...
  // },

  // async remove(id, userId) {
  //   const { rowCount } = await pool.query(
  //     'DELETE FROM todos WHERE id = $1 AND user_id = $2',
  //     [id, userId]
  //   );
  //   return rowCount > 0;
  // },
}
