import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import messageRoutes from './routes/messages';
import insightRoutes from './routes/insights';
import userRoutes from './routes/users';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);
app.use('/insights', insightRoutes);

export default app;
