let selectedElementId = "";
let currentUN = "";
let currentCM = "";
let currentAge = "";
let playing = false;
let inCinemaMode = false;



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
  $("#score").val("");
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
    });

  //Get id of clicked entry TODO: comment out, no longer necessary.
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
    //$(".controls").css({"visibility":"hidden","display":"block"});
    $("#scoreTable").css({"visibility":"hidden","display":"block"});
    $('#sketch-holder').cinema();
    inCinemaMode = true;
    playing = true;
  }else{
    if (!win && !settings && !gameOver) {
      $('#sketch-holder').uncinema();
      inCinemaMode = false;
      $( "body" ).removeClass( "stop-scrolling" );
      //$("#scoreTable").css({"visibility":"hidden","display":"block"});
      //$(".controls").css({"visibility":"visible","display":"block"});
      playing = false;
    }else if(mouseOverPlayAgain){
      //Play again
      //If win or lose, and play again is clicked, stay in cinematic mode.
      //Return in cinema mode if it was off
      if (!inCinemaMode) {
        $( "body" ).addClass( "stop-scrolling" );
        $("#scoreTable").css({"visibility":"hidden","display":"block"});
        $('#sketch-holder').cinema();
        inCinemaMode = true;
        playing = true;
      }
    }else if (mouseOverYes) {
      $("#score").val( score );
      $("#addBTN").prop("disabled", false);
      $("#sketch-holder").uncinema();
      inCinemaMode = false;
      $("body").removeClass( "stop-scrolling" );
      $("#scoreTable").css({"visibility":"visible","display":"block"});
      playing = false;
      //$(".controls").css({"visibility":"visible","display":"block"});
      //Yes
      //If win or lose, and yes is clicked, send score to database
      
    }else if(settings){
      //Settings menu
    };

  }
});
  //About
  $("#about").click(function(){
    showMessage("alert info", "This is a page with a simple game that at the end lets you send your score to a database.\
     The purpose of this is to demonstrate how MongoDB, Express, AngularJS, and NodeJs work together to create a MEAN web app.");
  });

  //About the game //TODO: Not sure about the stars
  $("#aboutGame").click(function(){
    showMessage("alert info","\
      <span style=\"color: black;\">★</span>Use the arrow keys to move<br>\
      <span style=\"color: black;\">★</span>Eat the food (the white dots)<br>\
      <span style=\"color: black;\">★</span>When the Crawler gets long enough to cover the entire playing field, you win<br>\
      <span style=\"color: black;\">★</span>Get a higher score by eating the bonus food (the green dots)<br>\
      <span style=\"color: black;\">★</span>Click the game frame again to pause<br>\
      <span style=\"color: black;\">★</span>Press TAB to open the settings menu");
  });

  //Add TODO: after the score is added, show the page it is on (if there is more than one page in the db) and maybe highlight it.
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
    //Check if there is any data
    if (!usernameVal || !commentVal || !scoreVal) {
      //No data
      showMessage("alert","You must fill every field.");      
      return
    }
    //TODO: If there is already an entry with the same values, give an error and return.
    //TODO: If it hs same values but different score, update score if it's higher
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

  //Close All
  $("#closeAll").click(function(b){
    b.preventDefault();
    $("#messageBox").empty();
    $(".messageBox").css("visibility","hidden");
  });

});