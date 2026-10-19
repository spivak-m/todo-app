import express from 'express';
import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.js';
import healthRoutes from './routes/health.routes.js';
import todoRoutes from './routes/todo.routes.js';

const app = express();

// app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
// app.use(morgan('dev'));
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/todos', todoRoutes);

app.use(errorHandler); // ВСЕГДА последним

export default app;
