window.onload = function() {
  //HTTP/Set up Variables
  const currentQuestion = document.getElementById('current-question');
  const answerCount = document.getElementById('answer-count');
  const newQuestionField = document.getElementById('answer-input');
  const submitButton = document.getElementById('submit-button');
  const refreshButton = document.getElementById('refresh-button');
  const adminForm = document.getElementById('adminform');
  const cloudRadio = document.getElementById('cloud-radio');
  const barRadio = document.getElementById('bar-radio');
  var PORT = 3333; //Check what to use here? Currently works but not sure about live
  var HOSTNAME = '//' + window.location.host || '//localhost:3333';

  //Data Variables
  var newLocation = null;
  var newQuestion = {
    dbLocation: null,
    question: null,
    type: null
  };

  //Function to post question
  function postData() {
    var questionData = newQuestion
    console.log('questionData: ' + questionData);
    axios.post(HOSTNAME + '/question', questionData)
    .then(function (response){
      console.log(response);
      currentQuestion.innerHTML = ` "${newQuestion.question}" displayed using a ${newQuestion.type} graph`;
    })
    .catch(function (error){
      console.log(error);
    });
  }

  //Resends the database location if you need to reload the display
  function refreshData() {
    var refreshData = newQuestion
    axios.post(HOSTNAME + '/refresh', refreshData)
    .then(function (response){
      console.log(response);
    })
    .catch(function (error){
      console.log(error);
    });
  }

  //Getting new question from form
  submitButton.addEventListener('click', function(e) {
    e.preventDefault();
    if (newQuestionField.value !== "") {
      const date = new Date();
      newQuestion.dbLocation = `${date} ${newQuestionField.value}`;
      newQuestion.question = newQuestionField.value;
      newQuestion.type = document.querySelector('input[name="graph"]:checked').value;
      postData();
      newQuestionField.value = "";
    } else window.alert('Question must not be empty');
  });

  refreshButton.addEventListener('click', function(e) {
    e.preventDefault();
    if (newQuestion.dbLocation !== null) {
      refreshData();
    }
  });

} //window.onload end
