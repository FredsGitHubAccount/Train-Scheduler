var firebaseConfig = {
    apiKey: "AIzaSyCwL2TSPMldGyB2ARMTqdJudOeIDRKEr7s",
    authDomain: "freds-train-scheduler.firebaseapp.com",
    databaseURL: "https://freds-train-scheduler.firebaseio.com",
    projectId: "freds-train-scheduler",
    storageBucket: "https://freds-train-scheduler.firebaseio.com/",
    messagingSenderId: "220739189313",
    appId: "1:220739189313:web:61a529296070c656"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // created a shortcut for firebase.database()
  let database = firebase.database()

  // declared variables that are empty & will be given values upon the click functions
  let name = ""
  let destination = ""
  let firstTrainTime = ""
  let frequency = ""

  // will extract the values from the form and check to see if they are valid
  $("#submit-train").on("click",function(event){

    event.preventDefault();
    name = $("#train-name-input").val().trim()
    destination = $("#destination-input").val().trim()
    firstTrainTime = $("#first-train-input").val().trim()
    frequency = $("#frequency-input").val().trim()
    
    
  if (name.length < 1 || destination.length < 1 || firstTrainTime.length !== 5 || frequency.length < 1)

  {
   $(".error").empty()
   $(".error").append("**You Must Insert Valid Fields**")
    return;
  }
    else {
          // push my created object into the database
        firstTrainTime = moment($("#first-train-input").val().trim(),"HH:mm").subtract(1,"years").format("X")
        database.ref().push({
        name,
        destination,
        firstTrainTime,
        frequency
    })

    $("#train-name-input").val("")
    $("#destination-input").val("")
    $("#first-train-input").val("")
    $("#frequency-input").val("")
    $(".error").empty()
  }

  })
    // whenever page is loaded or another object is added, run the calculations
    
  database.ref().on("child_added",function(snapshot){

    let name = snapshot.val().name
    let destination = snapshot.val().destination    
    let frequency = snapshot.val().frequency
    let firstTrainTime = snapshot.val().firstTrainTime


    let remainder = moment().diff(moment(firstTrainTime,"X"), "minutes") % frequency;  
    let minutes = frequency - remainder;
    let arrival = moment().add(minutes, "minutes").format("hh:mm A");



// dynamically generate content based on what is in firebase & after calculations
    let newTr = $("<tr>")
    newTr.html(`<td>${name}</td><td>${destination}</td><td>${frequency}</td><td>${arrival}</td><td>${minutes}</td>`)

    $("#main-holder").append(newTr)

  })

  