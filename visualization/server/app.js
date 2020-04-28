var express = require('express');
var app = express();
var path = require('path');

const bodyParser = require('body-parser');

var api = require('./routes/api');

app.use(bodyParser.json());

app.use('/api', api);

app.use(express.static('public'));

app.use((req, res, next) => {
	res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

app.listen(3000);

console.log('Running at porto 3000');
