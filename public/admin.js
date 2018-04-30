window.onload = function() {
  //HTTP/Set up Variables
  const currentQuestion = document.getElementById('current-question');
  const answerCount = document.getElementById('answer-count');
  const newQuestionField = document.getElementById('answer-input');
  const submitButton = document.getElementById('submit-button');
  var PORT = 3333; //Check what to use here? Currently works but not sure about live
  var HOSTNAME = '//' + window.location.host || '//localhost:3333';

  //Data Variables
  var questionCount = 1;
  var newLocation = null;
  var newQuestion = {
    dbLocation: null,
    question: null
  };

  //Function to post question -> NOT WORKING
  function postData() {
    var questionString = newQuestion
    console.log('QuestionString: ' + questionString);
    axios.post(HOSTNAME + '/question', questionString)
    .then(function (response){
      console.log(response);
      currentQuestion.innerHTML = newQuestion.question;
    })
    .catch(function (error){
      console.log(error);
    });
  }

  //Getting new question from form
  submitButton.addEventListener('click', function(e) {
    e.preventDefault();
    if (newQuestionField.value !== "") {
      newQuestion.dbLocation = 'Question' + questionCount;
      newQuestion.question = newQuestionField.value;
      questionCount += 1;
      postData();
      console.log(newQuestion.dbLocation);
      console.log(newQuestion.question);
    } else window.alert('Question must not be empty');
  });


} //window.onload end

//First: Update the question text using emit
// Get the question on button submit
// Put into a JSON object and pass to server using axios?
// Use socket emit to update the question text in the user panel

//Second: Include a new location for the database data (addChild?)
// User panel updates the location in its firebase references

//Third: Word cloud moves onto the new data
