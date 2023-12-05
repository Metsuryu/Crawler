const serverLess = true;
let playing = false;
let inCinemaMode = false;
let scoreSubmitted = false;
let highscoresVisible = false;
let highscoreArray;
let clickedPage = 1;
let dbSize = 0;
let resultsPerPage = 10; //Must be equal to limitOfResults in app.js
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


function confirmBox(msgType, info, yes, no){
  /* msgType can be same as showMessage */
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
  if (serverLess) {
    return;
  }

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
    clickedPage = $(this).html();
    $http({
      url: "/entries",
      method: "GET",
      params: {pageToDisplay: clickedPage}
    }).then(function (response) {
      $scope.entrylist = response.data;
      highscoreArray = $scope.entrylist;
    });
  });

  $("#searchField").on("keyup", function(){
    let searchInput = "s";
    let searchValue = $(this).val();
    if (searchValue === "") {
      searchInput = clickedPage;
    };
    $http({
      url: "/entries",
      method: "GET",
      params: {pageToDisplay: searchInput}
    }).then(function (response) {
      $scope.entrylist = response.data;
      highscoreArray = $scope.entrylist;
    });
  });

});


$(document).ready(function() {
  //Detect browser language, and translate if italian
  let userLang = navigator.language || navigator.userLanguage;
  if(userLang == "it-IT" || userLang == "it"){toItalian();};

  windowW = window.innerWidth;
  windowH = window.innerHeight;

  if (windowW < minWidth || windowH < minHeight) {
    if (windowW < canvasWH || windowH < canvasWH) {
      //Remove canvas and show error message.
      $("#sketch-holder").remove();
      console.log(tooSmallCsl);
      showMessage("alert",wayTooSmall);
    }else{
      //Fit the game window anyway by moving it top-left
      console.log(tooSmallCsl);
      showMessage("alert info",tooSmall);
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
        showMessage("alert info",alreadySubmitted);
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
        showMessage("alert info",submitInstructions);
      };

    }else if(settings){
      //Settings menu
    };
  };
});

  //About
  $("#about").click(function(){
    showMessage("alert info", aboutMsg);
  });

  //About the game
  $("#aboutGame").click(function(){
    showMessage("alert info",gameGuideMsg);
  });

  //Show Highscores Button
  $("#showHS").click(function(){
    if (!highscoresVisible) {
      if (screenTooSmall) {
        $("#sketch-holder").css({"visibility":"hidden"})
      };
      $("#scoreTable").css({"visibility":"visible","display":"block"});
      $("#showHS").html(hideScoresBTNLabel);
      highscoresVisible = true;
    }else{
      if (screenTooSmall) {
        $("#sketch-holder").css({"visibility":"visible"})
      };
      $("#scoreTable").css({"visibility":"hidden","display":"none"});
      $("#showHS").html(showScoresBTNLabel);
      highscoresVisible = false;
    }
  });


  function updateScore(nameVal,commentVal,scoreVal,idToModify,dbfull){
    let warningMessage = updateScoreMsg;
    if (dbfull) {
      warningMessage = dbFullMsg;
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
            showMessage("alert info",hsUpdated)
            emptyFields();
          },
          error: function(err){
            //console.log("Error: " , err);
            showMessage("alert",errorMsg);
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
      showMessage("alert",enterANameMsg);
      return;
    };

    //If there is already an entry with the same name and score
    for (let i = 0; i < highscoreArray.length; i++) {
      if (usernameVal === highscoreArray[i].name && parseInt(scoreVal) <= parseInt(highscoreArray[i].score) ) {
        showMessage("alert warning",pickDifferentNameMsg)
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
        showMessage("alert info",successfullySubmitted);
        emptyFields();
        $("#addBTN").prop("disabled", true);
        scoreSubmitted = true;
        dbSize += 1;
        //Update Table:
        $('#entriesTable tr:last').after(tableEntry);
      },
      error: function(err){
        //console.log("Error: " , err);
        showMessage("alert",errorMsg);
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
