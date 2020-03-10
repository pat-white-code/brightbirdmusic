const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const port = process.env.port || 4001;
const teachersRouter = require('./routes/teachers');
const schedulesRouter = require('./routes/schedules');
const studentsRouter = require('./routes/students');
const subscriptionsRouter = require('./routes/subsciptions');
const driveTimesRouter = require('./routes/driveTimes');
const requestsRouter = require('./routes/requests');
const lessonsRouter = require('./routes/lessons');

// const exphbs = require('express-handlebars');
// app.engine('handlebars', exphbs());
// app.set('view engine', 'handlebars');
// app.use('/public', express.static(path.join(__dirname, 'public')));



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use('/api/teachers', teachersRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/students', studentsRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/driveTimes', driveTimesRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/lessons', lessonsRouter);

app.listen(port, ()=> {
  console.log(`Listening on ${port}!`)
});