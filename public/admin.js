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
  const date = new Date();
  console.log('Date: ', date)
  var newQuestion = {
    dbLocation: null,
    question: null
  };

  //Function to post question
  function postData() {
    var questionData = newQuestion
    console.log('questionData: ' + questionData);
    axios.post(HOSTNAME + '/question', questionData)
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
      newQuestionField.value = "";
    } else window.alert('Question must not be empty');
  });


} //window.onload end
