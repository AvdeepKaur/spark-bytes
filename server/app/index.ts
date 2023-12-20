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
const allowedOrigins = [
  'https://spark-bytes-project-team-7-eight.vercel.app',
  'https://spark-bytes-project-team-7-git-main-spark-team-7.vercel.app',
  'https://spark-bytes-project-team-7-git-main-spark-team-7-frontend.vercel.app',
  'https://spark-bytes-project-team-7-spark-team-7-frontend.vercel.app',

  // Add any other domains you want to allow requests from
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);

//app.use('/api/', helloRouter);
app.use('/api/user', userRouter);
app.use('/api', helloRouter);
app.use('/api/events', eventsRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/auth', authRouter);

export default app;