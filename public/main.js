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

  // Set HTTP variables
  const questionForm = document.getElementById('post-form');
  const answerTextbox = document.getElementById('answer-input');
  const submitButton = document.getElementById('submit-button');
  const readOut = document.getElementById('read-out');
  const questionPara = document.getElementById('question');
  //Initialises socket.io
  const socket = io();
  // Variables to store the synced DB data
  var dbObj = {};
  var words = [];

  //Variable that sets where writeUserData stores the data in the DB
  var questionRef = 'Question1'
  var dbLocation = firebase.database().ref(questionRef);

  //Function to post a new word into the DB or increment existing
  function writeUserData(input) {
    // console.log('in writeUserData', arguments);
    dbLocation.transaction(function(currentData) {
      // console.log('currentData', currentData);
      // console.log('currentData[input]', currentData[input]);
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

  //Cleans the answer into individual words and
  //Passes each word into the database via writeUserData
  questionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
    const spaceRE = /\s+/g;
    const str = answerTextbox.value;
    const userInputLong = str.replace(punctRE, '').replace(spaceRE, ' ');
    const userInputArray = userInputLong.split(" ");
    console.log(userInputArray);
    for (let word of userInputArray) {
      writeUserData(word);
    }
  });

  //Gets the database data when it changes and stores it as an array
  database.on('value', function(snap){
    dbObj = snap.child(questionRef).val();
    var tempArray = [];
    for (var key in dbObj) {
      if (dbObj.hasOwnProperty(key)) {
        // console.log('for in key result ' + dbObj[key] + ' key: ' + key);
        tempArray.push(`{text: '${key}', size: ${dbObj[key]}}`);
      }
    }
    // console.log('tempArray: '+ tempArray);
    words = tempArray.map(i => i);
    readOut.innerText = JSON.stringify(dbObj);
    // console.log('words: ' + words);
  })

  //Updates the question and DB location on admin submit
  socket.on('newQuestion', (data) => {
    console.log('data.dbLocation: ' + data.dbLocation);
    console.log('data.question: ' + data.question);
    questionRef = data.dbLocation;
    questionPara.innerText = data.question;
  });

  //Creates word cloud
  d3.wordcloud()
    .size([800, 400])
    .selector('#wordcloud')
    .fill(d3.scale.ordinal().range(["#884400", "#448800", "#888800", "#444400"]))
    // .words([{text: 'word', size: 5}, {text: 'cloud', size: 15}])
    .words(words)
    .start();

};
