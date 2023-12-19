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

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const allowedOrigins = [
    'https://spark-bytes-project-team-7-git-main-spark-team-7.vercel.app',
    'https://spark-bytes-project-team-7-hl82eo404-spark-team-7-frontend.vercel.app/login',
    'https://spark-bytes-project-team-7-git-main-spark-team-7.vercel.app/signup',
    'spark-bytes-project-team-7-git-dep-0c896f-spark-team-7-frontend.vercel.app',
    'https://cs392-team-7-e01a3988ee9c.herokuapp.com' /* add other origins as needed */,
  ];
  const origin: string | undefined = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


  
    
//app.use('/api/', helloRouter);
app.use('/api/user', userRouter);
app.use('/api', helloRouter);
app.use('/api/events', eventsRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/auth', authRouter);

export default app;