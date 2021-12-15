/*
** Base of the backend application
** Opens express and sends calls to API and user interface
*/

const express = require('express');
const app = express();
const api = require('./routers/api');
const bodyParser = require('body-parser');
const path = require('path');
const https = require('https');
const fs = require('fs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '/map-app/build')));
app.use('/', express.static('public'));

app.use('/api/', api);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/map-app/build/index.html'));
});

console.log("Listening to port 3000");
app.listen(3000);

var options = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
};

console.log("Listening to port 443");
https.createServer(options, app).listen(443);
