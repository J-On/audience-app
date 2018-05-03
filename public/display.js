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
  var questionRef = 'Question1';
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
        // console.log('for in key result ' + dbObj[key] + ' key: ' + key);
        tempArray.push({text: `${key}`, weight: dbObj[key]});
        // console.log('TempArray:' + `{text: "${key}", weight: ${dbObj[key]}}`);
    }

    console.log('tempArray with delete me: ',tempArray)

    // for (var key in tempArray) {
    //   if (tempArray[key].text === "___admin")
    //   console.log('tempArray key: ', tempArray[key].text)
    //   tempArray.splice(key, 1);
    // }

    console.log('tempArray minus delete me: ',tempArray)
    console.log('questionRef: '+ questionRef)
    }

    // console.log('tempArray: ', tempArray);
    words = tempArray.map(i => i);
    // console.log('words ',words);
    $('#keywords').jQCloud('update', words);
  });

  $('#keywords').jQCloud(words, {
    width: 500,
    height: 300
  });

  //Updates the question and DB location on admin submit
  socket.on('newQuestion', (data) => {
    // console.log('data.dbLocation: ' + data.dbLocation);
    // console.log('data.question: ' + data.question);
    questionRef = data.dbLocation;
    questionTitle.innerText = data.question;
  });

}); //onload function end
