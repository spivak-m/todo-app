import app from './app.js';
import { env } from './config/env.js';
import { hello, type User } from 'shared';

const me: User = { id: 1, email: 'a@b.com' };
console.log(hello, me);

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
