
// Requires and variables
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var axios = require('axios');
var PORT = process.env.PORT || 3333;

app.use(bodyParser.json());

//Making pages and static files available
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/public/admin.html');
});

app.use(express.static(__dirname + '/public'));

//Open web socket with users
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on("disconnect", () => console.log("a user disconnected"));
});

//Post data ** WHAT VALIDATION CHECKS SHOULD I INCLUDE HERE?
app.post('/question', function(req, res){
  console.log('req.body: ' + req.body);
  const newQuestion = req.body;
  console.log('newQuestion: ' + newQuestion)
  io.emit('newQuestion', newQuestion);
  res.sendStatus(201);
});

http.listen(PORT, function(){
    console.log('Server is listening on: ' + PORT);
});
