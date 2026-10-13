import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
};

// Простая валидация — падаем сразу, а не где-то в рантайме
for (const [key, value] of Object.entries(env)) {
  if (!value && key !== 'nodeEnv') {
    throw new Error(`Missing env variable: ${key}`);
  }
}
