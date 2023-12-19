import express from 'express';
import cors from 'cors';
import app from './app/index.ts';
const port = process.env.PORT || '5005';
const server = express();
server.use(
  cors({
    origin: 'https://spark-bytes-project-team-7-git-main-spark-team-7.vercel.app/',
  })
);
server.use(app);x
app.listen(port, (err?: any) => {
  if (err) throw err;
  console.log('> Ready on https://cs392-team-7-e01a3988ee9c.herokuapp.com/');
});
