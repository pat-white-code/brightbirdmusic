const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.port || 4001;
const teachersRouter = require('./routes/teachers');
const schedulesRouter = require('./routes/schedules');
const studentsRouter = require('./routes/students');
const subscriptionsRouter = require('./routes/subsciptions');
const driveTimesRouter = require('./routes/driveTimes');

app.get('/api', (req, res) => {
  res.send('Welcome to our server!')
})

app.use(cors());
app.use(bodyParser.json());

app.use('/api/teachers', teachersRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/students', studentsRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/driveTimes', driveTimesRouter);


app.listen(port, ()=> {
  console.log(`Listening on ${port}!`)
});