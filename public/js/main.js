let selectedElementId = "";
let currentUN = "";
let currentCM = "";
let currentAge = "";
let playing = false;
let inCinemaMode = false;
let scoreSubmitted = false;
let highscoresVisible = false;
let highscoreArray;


/* To detect window size TODO: Use this to determine whether to disable the game or not.
function windowsSize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    console.log( "Width: " + w + " Height: " + h);
}
*/

//Removes potential characters that might break the page. Also done server-side.
function sanitizeString(str){
  str = str.replace(/([/\\<>"'])+/g,"");
  return str.trim();
  };

function showMessage(msgType, info){
  /*msgType can be: 
  "alert" Red
  "alert success" Green
  "alert info" Blue
  "alert warning" Yellow.
  info can be any string*/
  let infoMsg = "<div class=\""+ msgType +"\"><span class=\"closebtn\" \
  onclick=\"this.parentElement.style.display='none';\">&times;</span>"+ info +"</div>";
  $(".messageBox").css("visibility", "visible");
  $("#messageBox").append(infoMsg);
};


function confirmBox(msgType, info,yes,no){
  /*Type can be same as showMessage*/
  let infoMsg = "<div class=\""+ msgType +"\"><span class=\"closebtn\" \
  onclick=\"this.parentElement.style.display='none';\">&times;</span>"+ info +"\
  <button id=\"BTNyes\" class=\"button\">Yes</button> <button id=\"BTNno\" class=\"button\">No</button></div>";
  $(".messageBox").css("visibility", "visible");
  $("#messageBox").append(infoMsg);
  $("#BTNyes").click(function(){
    yes();
    $(this.parentElement).remove();
    });
  $("#BTNno").click(function(){
    no();
    $(this.parentElement).remove();
    });
};

function emptyFields(){
  $("#username").val("");
  $("#comment").val("");
  $("#score").val(0);
};

function updateEntry(name,lname,score){
  let entryToUpdate = document.getElementById(selectedElementId);
  entryToUpdate.innerHTML = "<tr class=\"entry\" id=\"0\"><td>" + name + "</td><td>" + lname + "</td><td>" + score + "</td></tr>";
}

let app = angular.module("Crawler", []);
app.controller("ctrl", function($scope, $http) {
  //Get the database entries form the server
  $http.get("/entries").then(function (response) {
    $scope.entrylist = response.data;
    highscoreArray = $scope.entrylist;
    });

/*
  //Get id of clicked entry TODO: comment out for now, no longer necessary.
  //Puts entry's data into text fields
  $scope.testID = function (event) {
    let thisE = event.currentTarget;
    let thisId = thisE.attributes.id.value;

    selectedElementId = thisId;
    if (thisId === 0 || thisId === null || thisId === ""){
      return;
    };
    $("#entriesTable tr").removeClass("selected");
    $(thisE).addClass( "selected" );
    $("#username").val( sanitizeString(thisE.cells[0].innerHTML) );
    $("#comment").val( sanitizeString(thisE.cells[1].innerHTML) );
    $("#score").val( parseInt( thisE.cells[2].innerHTML ) );
    currentUN = sanitizeString( document.getElementById("username").value );
    currentCM = sanitizeString( document.getElementById("comment").value );
    currentAge = parseInt( document.getElementById("score").value );
    };
*/

});


$(document).ready(function() {

  //Gets id of clicked entry  
  //Puts entry's data into text fields
  /*Replaced with Angular. Also removed angular version.
  $(".entry").click(function(event){
    selectedElementId = this.id;
    if (this.id === 0 || this.id === null || this.id === "") {return;};
    $("#entriesTable tr").removeClass("selected");
    $(this).addClass( "selected" );
    $("#username").val(this.cells[0].innerHTML);
    $("#comment").val(this.cells[1].innerHTML);
    $("#score").val(this.cells[2].innerHTML);
    currentUN = document.getElementById("username").value;
    currentCM = document.getElementById("comment").value;
    currentAge = document.getElementById("score").value;
  });
  */

$("#sketch-holder").click(function(){
  if (!playing) {
    $( "body" ).addClass( "stop-scrolling" );
    if (!highscoresVisible) {
      $("#scoreTable").css({"visibility":"hidden","display":"block"});
    };
    $('#sketch-holder').cinema();
    inCinemaMode = true;
    playing = true;
  }else{
    if (!win && !settings && !gameOver) {
      $('#sketch-holder').uncinema();
      inCinemaMode = false;
      $( "body" ).removeClass( "stop-scrolling" );
      if (!highscoresVisible) {
        $("#scoreTable").css({"visibility":"hidden","display":"none"});
      };
      playing = false;
    }else if(mouseOverPlayAgain){
      //Play again
      emptyFields();
      //If win or lose, and play again is clicked, stay in cinematic mode.
      //Return in cinema mode if it was off
      if (!inCinemaMode) {
        $( "body" ).addClass( "stop-scrolling" );
        if (!highscoresVisible) {
          $("#scoreTable").css({"visibility":"hidden","display":"none"});
        };
        $('#sketch-holder').cinema();
        inCinemaMode = true;
        playing = true;
      }
    }else if (mouseOverYes) {
      //If win or lose, and yes is clicked
      if (scoreSubmitted) {
        showMessage("alert info","Your current score was already submitted.<br>Play another game to get a better score.");
      }else{
        $("#score").val( score );
        $("#addBTN").prop("disabled", false);
        $("#sketch-holder").uncinema();
        inCinemaMode = false;
        $("body").removeClass( "stop-scrolling" );
        if (!highscoresVisible) {
          $("#scoreTable").css({"visibility":"hidden","display":"none"});
        };
        playing = false;
        showMessage("alert info","Enter your name above,<br>a comment (optional), and then click \"Submit Score\"");
      };

    }else if(settings){
      //Settings menu
    };
  };
});

  //About
  $("#about").click(function(){
    showMessage("alert info", "I made this page to demonstrate how MongoDB, Express, AngularJS, and NodeJs\
     work together to create a MEAN web app.<br>\
     At first it was just a database, but to make it more useful I made this clone of the game Snake\
     that at the end lets you send your score to a database.");
  });

  //About the game //TODO: Not sure about the stars
  $("#aboutGame").click(function(){
    showMessage("alert info","\
      <span style=\"color: black;\">★</span>Use the arrow keys to move<br>\
      <span style=\"color: black;\">★</span>Eat the food (the white dots)<br>\
      <span style=\"color: black;\">★</span>When the Crawler gets long enough to cover the entire playing field, you win<br>\
      <span style=\"color: black;\">★</span>Get a higher score by eating the bonus food (the green dots)<br>\
      <span style=\"color: black;\">★</span>Click the game frame again to pause<br>\
      <span style=\"color: black;\">★</span>Press ENTER to open the settings menu");
  });

  //Show Highscores Button
  $("#showHS").click(function(){
    if (!highscoresVisible) {
      $("#scoreTable").css({"visibility":"visible","display":"block"});
      $("#showHS").html("Hide Highscores");
      highscoresVisible = true;
    }else{
      $("#scoreTable").css({"visibility":"hidden","display":"none"});
      $("#showHS").html("Show Highscores");
      highscoresVisible = false;    
    }
  });

  //Add
  $("#addBTN").click(function(b){
  	b.preventDefault();
    //Get input
    let usernameVal = $("#username").val();
    let commentVal = $("#comment").val();
    let scoreVal = $("#score").val();
    //Sanitize it
    usernameVal = sanitizeString(usernameVal);
    commentVal = sanitizeString(commentVal);
    scoreVal = sanitizeString(scoreVal);
    //Check if there is name and score, comment is optional.
    if (!usernameVal) {
      //No name
      showMessage("alert","You must enter a name.");      
      return;
    };
    //If there is already an entry with the same name and score
    for (let i = 0; i < highscoreArray.length; i++) {
      if (usernameVal === highscoreArray[i].name && parseInt(scoreVal) <= parseInt(highscoreArray[i].score) ) {
        showMessage("alert warning","This name already achieved an equal or better score.<br>Pick another name, or get a better score.")
        return;
      };
      //TODO: If it hs same name but higher score, update score if it's higher
      if (usernameVal === highscoreArray[i].name && parseInt(scoreVal) > parseInt(highscoreArray[i].score) ) {
        //TODO: Call update function.
        showMessage("alert info","Highscore updated.")
        return;
      };
    };
    //Make a table entry with data
    let tableEntry = "<tr class=\"entry\" id=\"0\"><td>" + usernameVal + "</td><td>" + commentVal + "</td><td>" + scoreVal + "</td></tr>";
    
    $.ajax({
      type: "POST",
      url: "/addentry",
      data: { 
        username: usernameVal, 
        comment: commentVal, 
        score: scoreVal
      },
      success: function() {
        showMessage("alert info","The score was submitted.");
        //Update Table:
        $('#entriesTable tr:last').after(tableEntry);
        emptyFields();
        $("#addBTN").prop("disabled", true);
        scoreSubmitted = true;
      },
      error: function(err){
        //console.log("Error: " , err);
        showMessage("alert","An error has occurred.");
      },
      complete: function(){
        //TODO: check if everything is ok.
      }
    });
  });

//Modify TODO: Make it so this is called when only the score of an entry needs to be updated. 
//TODO: Restructure the entire function accordingly
//If a entry is selected automatically change forms to entry's values, 
//When clicking modify use new values that are in forms to modify it.
//If not, tell user to fill the forms.
/*
$("#modifyBTN").click(function(b){
    b.preventDefault();
    if (!selectedElementId) {
      showMessage("alert","You must click on the entry you want to modify.");
      return
    };
    //Get input
    let usernameVal = $("#username").val();
    let commentVal = $("#comment").val();
    let scoreVal = $("#score").val();
    //Sanitize it
    usernameVal = sanitizeString(usernameVal);
    commentVal = sanitizeString(commentVal);
    scoreVal = sanitizeString(scoreVal);
    //Check if there is any data
    if (!usernameVal || !commentVal || !scoreVal) {
      //No data
      showMessage("alert","You must fill every field.");      
      return
    }
    //If the new data is the same as the old data, give an error and return.
    if (usernameVal === currentUN && commentVal === currentCM && parseInt(scoreVal) === parseInt(currentAge) ) {
      showMessage("alert","You must change at least one field if you want to modify an entry.");   
      return
    }

    confirmBox("alert warning","Modify permanently selected entry?",
      function yes(){

        $.ajax({
          type: "PUT",
          url: "/updateentry",
          data: {
            entryId: selectedElementId,
            username: usernameVal, 
            comment: commentVal, 
            score: scoreVal
          },
          success: function() {
            showMessage("alert info", "Selected entry was modified");
            //Update Table:
            updateEntry(usernameVal,commentVal,scoreVal);
            $("#entriesTable tr").removeClass("selected");
            selectedElementId = "";
            currentUN = "";
            currentCM = "";
            currentAge = "";
            emptyFields();
          },
          error: function(err){
            //console.log("Error: " , err);
            showMessage("alert","An error has occurred.");
          },
          complete: function(){
            }
          });
        
        },
      function no(){
        return;
      });
  });

//Delete TODO: Make it so this is called when the database is full, and a new entry needs to be added, so it removes the lowest score
//to make space for the new one, higher one.
//If a entry is selected, ask for confirm, and delete it, if not, tell user to select an entry.
$("#deleteBTN").click(function(b){
    b.preventDefault();

    if (!selectedElementId) {
      showMessage("alert","You must click on the entry you want to delete.");
      return
    };

    //Confirm deletion
    confirmBox("alert warning","Delete permanently selected entry?",
      function yes (){
        //If Yes is clicked, the entry gets deleted
        $.ajax({
          type: "DELETE",
          url: "/deleteentry",
          data: { entryId: selectedElementId
          },
          success: function(){
            showMessage("alert info", "Selected entry was deleted");
            //Update Table:
            $("#"+selectedElementId).remove();
          },
          error: function(err){
            //console.log("Error: " , err);
            showMessage("alert","An error has occurred.");
          },
          complete: function(){
            selectedElementId = "";
            emptyFields();
          }
        });
      },
      function no (){
        return;
      });
  });

  */

  //Close All
  $("#closeAll").click(function(b){
    b.preventDefault();
    $("#messageBox").empty();
    $(".messageBox").css("visibility","hidden");
  });

});