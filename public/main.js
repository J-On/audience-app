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
  // let databaseRef = database.ref()

  // Set HTML Variables
  const questionForm = document.getElementById('post-form');
  const answerTextbox = document.getElementById('answer-input');
  const submitButton = document.getElementById('submit-button');
  const readOut = document.getElementById('read-out');
  // Variable to store the synced DB data
  let dbObj = {};

  //Gets the database data when it changes and stores it
  database.on('value', function(snap){
    dbObj = snap;
    readOut.innerText = JSON.stringify(snap);
    console.log(JSON.stringify(snap));
  });

  //Function to post a new word into the DB

  // function writeUserData(formWord, wordCount) {
  //   entry = `{${formWord}: ${wordCount}}`;
  //   database.set(entry);
  // }

//Concern that it will come out of sync -> Check thinking.
// function writeUserData(formWord) {
//   let newWordCount = null;
//   console.log(dbObj)
//   if (dbObj.hasOwnProperty(formWord)) {
//     newWordCount = dbObj[formWord].value  + 1;
//   } else {
//     newWordCount = 1;
//   }
//   firebase.database().ref(formWord).set(newWordCount);
// }

var wordRef = firebase.database().ref('words');
function writeUserData(input) {
  console.log('in writeUserData', arguments);
  wordRef.transaction(function(currentData) {
    console.log('currentData', currentData);
    console.log('currentData[input]', currentData[input]);
    const val = currentData[input];
    if (!val && typeof val !== 'number') { //might need to hasOwnProperty this
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
    console.log('User ada added!');
  }
  console.log("Ada's data: ", snapshot.val());
});
}

questionForm.addEventListener('submit', function(e) {
    // writeUserData(answerForm.value);
    e.preventDefault();
    let theWord = answerTextbox.value;
    writeUserData(theWord);
});
}
