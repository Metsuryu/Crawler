let playing = false;
let inCinemaMode = false;
let scoreSubmitted = false;
let highscoresVisible = false;
let highscoreArray;
let clickedPage = 1;
let dbSize = 0;
const resultsPerPage = 10; //Must be equal to limitOfResults in app.js
const limitOfDatabase = 100; //Arbitrary low limit to keep it light.
let dbIsFull = false;
const minWidth = 1076;
const minHeight = 685;
const canvasWH = 600;
let screenTooSmall = false;
let windowW = 0;
let windowH = 0;

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


function generatePageButtons(databaseSize){
  let pages = Math.ceil( databaseSize / resultsPerPage );
  for (let i = 1; i <= pages; i++) {
    if (i === 1) {
      $( "#scorePages" ).append( "  <div class=\"scorePageButton Current\">1</div>  " );
    }else{
      $( "#scorePages" ).append( "  <div class=\"scorePageButton\">"+i+"</div>  " );
    };
  };
}

let app = angular.module("Crawler", []);
app.controller("ctrl", function($scope, $http) {
  //Get the database entries form the server
  $http({
    url: "/entries", 
    method: "GET",
    params: {pageToDisplay: clickedPage}
  }).then(function (response) {
    $scope.entrylist = response.data;
    highscoreArray = $scope.entrylist;
    if (highscoreArray[0].dbsize) {
      dbSize = highscoreArray[0].dbsize;
      if (dbSize >= limitOfDatabase) {
        dbIsFull = true;
      };
    };
    generatePageButtons(dbSize);
  });


  $("#scorePages").on("click", ".scorePageButton", function(){
    $(".scorePageButton").removeClass("Current");
    $(this).addClass("Current");
    var page = $(this).html();
    clickedPage = page;
    $http({
      url: "/entries", 
      method: "GET",
      params: {pageToDisplay: clickedPage}
    }).then(function (response) {
      $scope.entrylist = response.data;
      highscoreArray = $scope.entrylist;
    });
  });
});


$(document).ready(function() {
  windowW = window.innerWidth;
  windowH = window.innerHeight;

  if (windowW < minWidth || windowH < minHeight) {
    if (windowW < canvasWH || windowH < canvasWH) {
      //Remove canvas and show error message.
      $("#sketch-holder").remove();
      console.log("The browser window is WAY too small. The game window is 600x600. Consider closing the console and reloading.");
      showMessage("alert","Sorry, your browser window is too small to fit the game window (600x600).\
        You could try increasing your monitor resolution, making some space in the browser by removing toolbars \
        or other addons that take space, or just using a larger monitor.");
    }else{
      //Fit the game window anyway by moving it top-left
      console.log("The browser window is too small. Consider closing the console and reloading.");
      showMessage("alert info","Your browser window is too small to fit the game window normally, so \
      when you click play, the game window will move to the top-left corner of the screen.");
      screenTooSmall = true;
    };
  };

  $("#sketch-holder").click(function(){
    if (!playing) {
      $( "body" ).addClass( "stop-scrolling" );
      if (!highscoresVisible) {
        $("#scoreTable").css({"visibility":"hidden","display":"block"});
      };
      $('#sketch-holder').cinema();

      if (screenTooSmall) {
        $("#sketch-holder").css({"position":"absolute","top":0});
      };

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

  //About the game
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


  function updateScore(nameVal,commentVal,scoreVal,idToModify,dbfull){
    let warningMessage = "There is already a highscore with the same name, this will update the score. Continue?";
    if (dbfull) {
      warningMessage = "Since the database is full, submitting this score will remove the lowest existing highscore to make room. Continue?";
    };

    confirmBox("alert warning",warningMessage,
      function yes(){
        $.ajax({
          type: "PUT",
          url: "/updateentry",
          data: {
            entryId: idToModify,
            username: nameVal, 
            comment: commentVal, 
            score: scoreVal
          },
          success: function() {
            showMessage("alert info","Highscore updated.")
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
  }

  function getLowestScore(){

  }

  //Submit Score
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
    //Check if there is name, comment is optional, score should always be there.
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
      //If it has same name but higher score, update score if it's higher
      if (usernameVal === highscoreArray[i].name && parseInt(scoreVal) > parseInt(highscoreArray[i].score) ) {
        let idToChange = highscoreArray[i].id;
        updateScore(usernameVal,commentVal,scoreVal,idToChange,dbIsFull);
        return;
      };
    };

    //If the database is full, remove lowest score to make room for new one, by updating the old score with the new values
    if (dbIsFull) {
      if (highscoreArray[0].score >= 0) {
        let lowestScore = highscoreArray[0].score;
        let lowestScoreId = highscoreArray[0].id;

        for (let i = highscoreArray.length - 1; i >= 0; i--) {
          if (highscoreArray[i].score < lowestScore) {
            lowestScore = highscoreArray[i].score;
            lowestScoreId = highscoreArray[i].id;
          };
          updateScore(usernameVal,commentVal,scoreVal,lowestScoreId,dbIsFull);
          return;
        };
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
        emptyFields();
        $("#addBTN").prop("disabled", true);
        scoreSubmitted = true;
        dbSize += 1;
        //Update Table:
        $('#entriesTable tr:last').after(tableEntry);
      },
      error: function(err){
        //console.log("Error: " , err);
        showMessage("alert","An error has occurred.");
      },
      complete: function(){
      }
    });
  });

  //Close All
  $("#closeAll").click(function(b){
    b.preventDefault();
    $("#messageBox").empty();
    $(".messageBox").css("visibility","hidden");
  });

});