import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import messageRoutes from './routes/messages';
import insightRoutes from './routes/insights';
import userRoutes from './routes/users';
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
    origin: "https://smart-communication-vconnect.vercel.app/", 
    credentials: true,
  }));
app.use(express.json());
app.use(cookieParser()); 

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);
app.use('/insights', insightRoutes);

export default app;
