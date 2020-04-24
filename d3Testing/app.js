var express = require('express')
var app = express()
var path = require('path')


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/main.html'))
})

app.use(express.static(path.join(__dirname, 'public')));


app.listen(3000);
console.log('Running at porto 3000');