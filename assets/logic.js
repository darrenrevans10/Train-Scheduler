
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBew8RXRuog9y1Uq-iRIq83cIkLRP6O_qw",
    authDomain: "train-scheduler-b24b9.firebaseapp.com",
    databaseURL: "https://train-scheduler-b24b9.firebaseio.com",
    projectId: "train-scheduler-b24b9",
    storageBucket: "train-scheduler-b24b9.appspot.com",
    messagingSenderId: "346523546317"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // Button for adding Trains
  $("#add-train-btn").on("click", function(event) {
  	event.preventDefault();

  	var trainName = $("#train-name-input").val().trim();
  	var destination = $("#destination-input").val().trim();
  	var trainTime = moment($("#time-input").val().trim(), "HH:mm A").format("X");
  	var frequency = $("#frequency-input").val().trim();

  	var newTrain = {
  		trainName: trainName,
  		destination: destination,
  		trainTime: trainTime,
  		frequency: frequency
  	};

  	database.ref().push(newTrain);

  	$("#train-name-input").val("");
  	$("#destination-input").val("");
  	$("#time-input").val("");
  	$("#frequency-input").val("");


  });

  database.ref().on("child_added", function(childSnapshot , prevChildKey) {

  	var trainName = childSnapshot.val().trainName;
  	var destination = childSnapshot.val().destination;
  	var trainTime = childSnapshot.val().trainTime;
  	var frequency = childSnapshot.val().frequency;

  	var diffTime = moment().diff(moment.unix(trainTime), "minutes");
  	var timeRemainder = moment().diff(moment.unix(trainTime), "minutes") % frequency;
  	var tMinutesTillTrain = frequency - timeRemainder;

  	var nextTrain = moment().add(tMinutesTillTrain, "m").format("HH:mm A");

    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" +
  	nextTrain + "</td><td>" + tMinutesTillTrain + "</td><tr>");

   }, function(errorObject) {
   		console.log("errors handled: " + errorObject.code);
  });