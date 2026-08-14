import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from '@/routes/auth.routes';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

app.listen(port, () => {
  console.log(`Ruta API listening on http://localhost:${port}`);
});

export default app;
