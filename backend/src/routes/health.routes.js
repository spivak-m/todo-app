import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
  let dbStatus = 'connected';
  let dbError = null;

  try {
    const result = await pool.query('SELECT 1');
    if (result.rowCount !== 1) dbStatus = 'unexpected';
  } catch (err) {
    dbStatus = 'error';
    dbError = err.message;
  }

  res.json({
    status: 'ok',
    db: dbStatus,
    ...(dbError && { dbError }),  // показываем детали только при ошибке
  });
});

export default router;
