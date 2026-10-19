import { pool } from '../config/db'
import type { Todo, CreateTodoInput, UpdateTodoInput } from 'shared'

export async function findAllByUser(userId: number): Promise<Todo[]> {
  const { rows } = await pool.query<Todo>(
    'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );

  return rows
};

export async function findById(id: number, userId: number): Promise<Todo | null> {
  const { rows } = await pool.query<Todo>(
    'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
    [id, userId]
  )

  return rows[0] ?? null
};

export async function create(userId: number, input: CreateTodoInput): Promise<Todo> {
  const { rows } = await pool.query<Todo>(
    `INSERT INTO todos (user_id, title, description)
      VALUES ($1, $2, $3)
      RETURNING *`,
    [userId, input.title, input.description ?? null]
  );
  return rows[0]!;
};

export async function update(id: number, userId: number, input: UpdateTodoInput): Promise<Todo | null> {
  // Здесь надо аккуратно собрать SET-часть из разрешённых полей

  const fields: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  if(input.title !== undefined) {
    fields.push(`title = $${index++}`);
    values.push(input.title);
  }

  if(input.description !== undefined) {
    fields.push(`description = $${index++}`);
    values.push(input.description);
  }

  if(input.is_done !== undefined) {
    fields.push(`is_done = $${index++}`);
    values.push(input.is_done);
  }

  fields.push(`updated_at = NOW()`);

  if(fields.length === 1) {
    // обновляем только updated_at, возвращаем текущую запись
    return findById(id, userId);
  }

  values.push(id, userId);

  const { rows } = await pool.query<Todo>(
    `UPDATE todos
      SET ${fields.join(', ')}
      WHERE id = $${index++} AND user_id = $${index}
      RETURNING *`,
    values
  );

  return rows[0] ?? null;
};

export async function remove(id: number, userId: number): Promise<boolean> {
  const { rowCount } = await pool.query(
    'DELETE FROM todos WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return (rowCount ?? 0) > 0;
};
