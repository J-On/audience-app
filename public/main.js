window.onload = function() {

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

  // Set HTML Variables
  const questionForm = document.getElementById('post-form');
  const answerTextbox = document.getElementById('answer-input');
  const submitButton = document.getElementById('submit-button');
  const readOut = document.getElementById('read-out');
  // Variable to store the synced DB data
  var dbObj = {};
  var words = [];

  //Variable that sets where writeUserData stores the data in the DB
  var wordRef = firebase.database().ref('words');

  //Function to post a new word into the DB or increment existing
  function writeUserData(input) {
    console.log('in writeUserData', arguments);
    wordRef.transaction(function(currentData) {
      console.log('currentData', currentData);
      console.log('currentData[input]', currentData[input]);
      const val = currentData[input];
      if (!val && typeof val !== 'number') {
        return {
          ...currentData,  //PROBABLY NEED TO FIX THIS AS IT INTRODUCES A RACE CONDITION
          [input]: 1
        };
      } else {
        console.log(input + ' already exists.');
        return {
          ...currentData,
          [input]: val + 1
        };
      }
    }, function(error, committed, snapshot) {
      if (error) {
        console.log('Transaction failed abnormally!', error);
      } else if (!committed) {
        console.log('We aborted the transaction (because ada already exists).');
      } else {
        console.log('Word added..');
      }
      console.log("The data: ", snapshot.val());
    });
  }

  //Passes the question field data into the database via writeUserData
  questionForm.addEventListener('submit', function(e) {
    // writeUserData(answerForm.value);
    e.preventDefault();
    let userInput = answerTextbox.value;
    writeUserData(userInput);
  });

  //Gets the database data when it changes and stores it as an array
  database.on('value', function(snap){
    dbObj = snap.child('words').val();
    var tempArray = [];
    for (var key in dbObj) {
      if (dbObj.hasOwnProperty(key)) {
        console.log('for in key result ' + dbObj[key] + ' key: ' + key);
        tempArray.push(`{text: '${key}', size: ${dbObj[key]}}`);
      }
    }
    console.log('tempArray: '+ tempArray);
    words = tempArray.map(i => i);
    readOut.innerText = JSON.stringify(dbObj);
    console.log('words: ' + words);
    d3.wordcloud()
      .size([800, 400])
      .selector('#wordcloud')
      .fill(d3.scale.ordinal().range(["#884400", "#448800", "#888800", "#444400"]))
      // .words([{text: 'word', size: 5}, {text: 'cloud', size: 15}])
      .words(words)
      .start();
  })


  // d3.wordcloud()
  //   .size([800, 400])
  //   .selector('#wordcloud')
  //   .fill(d3.scale.ordinal().range(["#884400", "#448800", "#888800", "#444400"]))
  //   // .words([{text: 'word', size: 5}, {text: 'cloud', size: 15}])
  //   .words(words)
  //   .start();

};
