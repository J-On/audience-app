
// Requires and variables
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var axios = require('axios');
var PORT = process.env.PORT || 3333;
var firebase = require('firebase');
var config = {
  apiKey: "AIzaSyBgyCuwZ_k5JgCvF08rf75XJtZSQlzDVOY",
  authDomain: "word-cloud-poc.firebaseapp.com",
  databaseURL: "https://word-cloud-poc.firebaseio.com",
  projectId: "word-cloud-poc",
  storageBucket: "word-cloud-poc.appspot.com",
  messagingSenderId: "873961534305"
};

var userCount = null

//Initialize Firebase for DB updates and bodyParser for express routing
firebase.initializeApp(config);
app.use(bodyParser.json());

//Making pages and static files available
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/public/admin.html');
});
app.get('/display', function(req, res){
  res.sendFile(__dirname + '/public/display.html');
});
app.use(express.static(__dirname + '/public'));

//Open web socket with users and updates user count
io.on('connection', function(socket){
  userCount +=1;
  console.log('a user connected. user count: ' + userCount);
  socket.on("disconnect", function() {
    userCount -=1;
    console.log('a user disconnected. user count: ' + userCount);
  });
});

//Receives post data from admin panel
app.post('/question', function(req, res){
  const newQuestion = req.body;

  //Creates a new child node in Firebase with a dummy entry
  firebase.database().ref(newQuestion.dbLocation).set({
      " ": "0",
  })

  //Emits the new question data to users
  io.emit('newQuestion', newQuestion);
  res.sendStatus(201);
});

//Gets server listening for connections on the port
http.listen(PORT, function(){
    console.log('Server is listening on: ' + PORT);
});
