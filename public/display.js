$(function(){

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBgyCuwZ_k5JgCvF08rf75XJtZSQlzDVOY",
    authDomain: "word-cloud-poc.firebaseapp.com",
    databaseURL: "https://word-cloud-poc.firebaseio.com",
    projectId: "word-cloud-poc",
    storageBucket: "",
    messagingSenderId: "873961534305"
  };
  firebase.initializeApp(config);
  const database = firebase.database().ref();

  //Variable that sets where writeUserData stores the data in the DB
  var questionRef = 'Default';
  var dbLocation = firebase.database().ref(questionRef);
  var $keywords = $('#keywords');
  var questionTitle = document.getElementById('question-title');

  //Initialize socket
  const socket = io();

  // Variable to store the synced DB data
  var words = [{text: "Jon", weight: 10}, {text: "is", weight: 8}, {text: "badass", weight: 15},];

  //Gets the database data when it changes and stores it as an array
  database.on('value', function(snap){
    dbObj = snap.child(questionRef).val();
    var tempArray = [];
    for (var key in dbObj) {
      if (dbObj.hasOwnProperty(key)) {
        tempArray.push({text: `${key}`, weight: dbObj[key]});
      }
    }

    words = tempArray.map(i => i);
    $('#keywords').jQCloud('update', words);
  });

  $('#keywords').jQCloud(words, {
    width: 1000,
    height: 500
  });

  //Updates the question and DB location on admin submit
  socket.on('newQuestion', (data) => {
    console.log('data.dbLocation: ' + data.dbLocation);
    questionRef = data.dbLocation;
    console.log('questionRef: ' +  questionRef);
    questionTitle.innerText = data.question;
  });

  socket.on('refreshData', (data) => {
    questionRef = data.dbLocation;
    questionTitle.innerText = data.question;
    database.once('value', function(snap){
      dbObj = snap.child(questionRef).val();
      var tempArray = [];
      for (var key in dbObj) {
        if (dbObj.hasOwnProperty(key)) {
          tempArray.push({text: `${key}`, weight: dbObj[key]});
        }
      }

      words = tempArray.map(i => i);
      $('#keywords').jQCloud('update', words);
    });
  });

}); //onload function end
