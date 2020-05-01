var express = require('express');
var topojson = require('topojson-client')
app = express();
var path = require('path');

app.use(express.static('public'));

app.listen(3000);

console.log('Running at porto 3000');
