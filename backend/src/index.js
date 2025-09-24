import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createDbAndRunMigrations } from './migrate.js';
import vehiclesRouter from './routes/vehicles.js';
import usersRouter from './routes/users.js';
import salesRouter from './routes/sales.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/vehicles', vehiclesRouter);
app.use('/api/users', usersRouter);
app.use('/api/sales', salesRouter);

const port = process.env.PORT || 4000;

await createDbAndRunMigrations();

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});


