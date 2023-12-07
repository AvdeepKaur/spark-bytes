import app from './app/index.ts';
const port = process.env.PORT || '5005';
app.listen(port, (err?: any) => {
  if (err) throw err;
  console.log('> Ready on https://cs392-team-7-e01a3988ee9c.herokuapp.com/');
});
