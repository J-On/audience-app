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

  //Flag for chart selection (cloud, bar)
  var chartSelect = "empty";

  // Variable to store the synced DB data
  var words = [{text: "Blah", weight: 10}, {text: "Bloody", weight: 8}, {text: "Blaah", weight: 15},];
  historicalBarChart = [ //This might need to be declared as a var. If so give better name
        {
            key: "Cumulative Return",
            values: [
                {
                    label : "A" ,
                    value : 29
                } ,
                {
                    label : "B" ,
                    value : 0
                } ,
                {
                    label : "C" ,
                    value : 32
                } ,
                {
                    label : "D" ,
                    value : 200
                }
            ]
        }
    ];

  //Gets the database data when it changes and stores it as an array
  database.on('value', function(snap){
    if (chartSelect === "cloud") {
      let dbObj = snap.child(questionRef).val();
      let tempArray = [];
      for (var key in dbObj) {
        if (dbObj.hasOwnProperty(key)) {
          tempArray.push({text: `${key}`, weight: dbObj[key]});
        }
      }

      words = tempArray.map(i => i);
      $('#keywords').jQCloud('update', words);
      $('#keywords').show();
      $('#barchart').hide();
    }

    else if (chartSelect === "bar") {
      let dbObj = snap.child(questionRef).val();
      let tempArray = [];
      for (var key in dbObj) {
        if (dbObj.hasOwnProperty(key)) {
          tempArray.push({label: `${key}`, value: dbObj[key]});
        }
      }

      valuesArray = tempArray.map(i => i);
      historicalBarChart[0].values = valuesArray;
      console.log("HBC values ", historicalBarChart[0].values);

      nv.addGraph(function() {
        let chart = nv.models.discreteBarChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .staggerLabels(true)
        //.staggerLabels(historicalBarChart[0].values.length > 8)
        .showValues(true)
        .duration(250);
        d3.select('#barchart svg')
        .datum(historicalBarChart)
        .call(chart);
        nv.utils.windowResize(chart.update);
        return chart;
      });
      $('#keywords').hide();
      $('#barchart').show();
    }
  });

  $('#keywords').jQCloud(words, {
    width: 1000,
    height: 500
  });

  //Draws the graph when the page loads
  if (chartSelect === "cloud") {
    $('#keywords').show();
    $('#barchart').hide();
  }

  else if (chartSelect === "bar") {
    $('#keywords').hide();
    $('#barchart').show();
    nv.addGraph(function() {
      let chart = nv.models.discreteBarChart()
      .x(function(d) { return d.label })
      .y(function(d) { return d.value })
      .staggerLabels(true)
      //.staggerLabels(historicalBarChart[0].values.length > 8)
      .showValues(true)
      .duration(250);
      d3.select('#barchart svg')
      .datum(historicalBarChart)
      .call(chart);
      nv.utils.windowResize(chart.update);
      return chart;
    });
  }

  else if (chartSelect === "empty") {
    $('#keywords').hide();
    $('#barchart').hide();
  }

  //Updates the question and DB location on admin submit
  socket.on('newQuestion', (data) => {
    console.log('data.dbLocation: ' + data.dbLocation);
    questionRef = data.dbLocation;
    console.log('questionRef: ' +  questionRef);
    chartSelect = data.type;
    console.log('chartSelect: ' + chartSelect);
    questionTitle.innerText = data.question;
  });

  //Updates the DB location and loads graph when admin refreshes
  socket.on('refreshData', (data) => {
    questionRef = data.dbLocation;
    chartSelect = data.type;
    questionTitle.innerText = data.question;
    database.once('value', function(snap){
      if (chartSelect === "cloud") {
        let dbObj = snap.child(questionRef).val();
        let tempArray = [];
        for (var key in dbObj) {
          if (dbObj.hasOwnProperty(key)) {
            tempArray.push({text: `${key}`, weight: dbObj[key]});
          }
        }

        words = tempArray.map(i => i);
        $('#keywords').jQCloud('update', words);
        $('#keywords').show();
        $('#barchart').hide();
      }

      else if (chartSelect === "bar") {
        $('#keywords').hide();
        $('#barchart').show();
        nv.addGraph(function() {
        let chart = nv.models.discreteBarChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .staggerLabels(true)
        //.staggerLabels(historicalBarChart[0].values.length > 8)
        .showValues(true)
        .duration(250);
        d3.select('#barchart svg')
        .datum(historicalBarChart)
        .call(chart);
        nv.utils.windowResize(chart.update);
        return chart;

        });
      }

      else if (chartSelect === "empty") {
        $('#keywords').hide();
        $('#barchart').hide();
      }

    });
  });

}); //onload function end
