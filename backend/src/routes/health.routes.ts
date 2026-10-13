import { Router, type Request, type Response } from 'express';
import { pool } from '../config/db.js';

type DbStatus = 'connected' | 'unexpected' | 'error'

interface HealthResponce {
    status: 'ok';
    db: DbStatus;
    dbError?: string;
}

const router = Router();

router.get('/', async (_req: Request, res: Response<HealthResponce>) => {
  let dbStatus: DbStatus = 'connected';
  let dbError: string | null = null;

  try {
    const result = await pool.query('SELECT 1');
    if (result.rowCount !== 1) dbStatus = 'unexpected';
  } catch (err) {
    dbStatus = 'error';
    dbError = err instanceof Error ? err.message : null;
  }

  const body: HealthResponce = {
    status: 'ok',
    db: dbStatus,
    ...(dbError && { dbError }),  // показываем детали только при ошибке
  }

  res.json(body);
});

export default router;
