import express from 'express';
import cors from 'cors';
import userRouter from './user/user.router.ts';
import helloRouter from './hello/hello.router.ts';
import eventsRouter from './event/event.router.ts';
import tagsRouter from './tags/tags.router.ts';
import authRouter from './auth/auth.router.ts';

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        'https://spark-bytes-project-team-7-eight.vercel.app',
        'https://spark-bytes-project-team-7-eight.vercel.app/api/auth/login',
        'https://spark-bytes-project-team-7-eight.vercel.app/api/auth/signup',
        'https://spark-bytes-project-team-7-eight.vercel.app/api/events',
        'https://spark-bytes-project-team-7-eight.vercel.app/api/events/user/:userId',
        'https://spark-bytes-project-team-7-eight.vercel.app/api/events/:event_id',
        'https://spark-bytes-project-team-7-eight.vercel.app/api/events/create',
        'https://spark-bytes-project-team-7-eight.vercel.app/api/tags/create',
        'https://spark-bytes-project-team-7-eight.vercel.app/api/tags',
        'https://spark-bytes-project-team-7-eight.vercel.app/api/tags/type/create',
        'https://spark-bytes-project-team-7-eight.vercel.app/api/tags/type',
        'https://spark-bytes-project-team-7-eight.vercel.app/api/tags/type/all',
        'https://spark-bytes-project-team-7-eight.vercel.app/api/user/update/:userId'
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('not allowed by cors'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }));

app.use((req, res, next) => {
  console.log('Incoming Request Headers:', req.headers);
  next();
});

app.use(express.json());

//app.use('/api/', helloRouter);
app.use('/api/user', userRouter);
app.use('/api', helloRouter);
app.use('/api/events', eventsRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/auth', authRouter);

export default app;