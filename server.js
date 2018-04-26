var express = require('express');
var bodyParser = require('body-parser');
// var http = require('http').Server(app); //think this should be express
// var io = require('socket.io')(http);
var PORT = process.env.PORT || '3333';
var app = express();

app.use(bodyParser.json());

app.use(express.static('public'));

app.listen(PORT, function(){
    console.log('Server is listening');
});
