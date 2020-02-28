let fetch = require('node-fetch');

fetch(`http://127.0.0.1:4001/api/driveTimes?origin=Bay+Hill+Dr,+Austin,+TX+78746&destination=Dogwood creek+Drive,+Austin,+TX+78746`)
.then(res=> res.json()).then(json=> console.log(json));