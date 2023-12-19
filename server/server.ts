import express from 'express';
import cors from 'cors';
import app from './app/index.ts';
const port = process.env.PORT || '5005';
const server = express();
server.use(cors());
server.use(app);
app.listen(port, (err?: any) => {
  if (err) throw err;
  console.log('> Ready on https://cs392-team-7-e01a3988ee9c.herokuapp.com/');
});
