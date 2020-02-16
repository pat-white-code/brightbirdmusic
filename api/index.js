const express = require('express');
const app = express();
const port = process.env.port || 4001;
const teachersRouter = require('./routes/teachers');
const schedulesRouter = require('./routes/schedules');

app.get('/api', (req, res) => {
  res.send('Welcome to our server!')
})

app.use('/api/teachers', teachersRouter);
app.use('/api/schedules', schedulesRouter);


app.listen(port, ()=> {
  console.log(`Listening on ${port}!`)
});