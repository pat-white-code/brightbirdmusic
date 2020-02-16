const express = require('express');
const app = express();
const port = process.env.port || 4001;

app.get('/', (req, res) => {
  res.send('Welcome to our server!')
})


app.listen(port, ()=> {
  `Listening on ${port}`
})