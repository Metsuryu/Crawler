/*
Crawler - A snake clone by Mario Cannistrà based on the code by Daniel Shiffman 
at https://github.com/CodingRainbow/Rainbow-Code/tree/master/challenges/CC_03_Snake_game_p5.js
taken from his video: https://www.youtube.com/watch?v=AaGK-fj-BAM

TODO: Use my own music
Music file name: FDS_rushjet1_-_fdx
It was a demo song I found inside the FamiTracker folder

I continued to write on top of that code by adding more functionality and making the game in the current state.
My github: https://github.com/Metsuryu
*/

let s;
const scl = 20;
let score = 0;
let food;
let bonusFood;
let bonusFoodIcon = {x:210,y:574};
let bonusFoodSpawned = false;
const bonusFoodTimeC = 50;
let bonusFoodTime = bonusFoodTimeC;
let started = false;
let gameOver = false;
let win = false;
let rainbow = false;
let backgroundColor = 50;
let textBG = 40;
let menuBG = 35;
let textColor = "#3282FF"; //50,130,255
let hovered = 100;
let mouseOverYes = false;
let mouseOverPlayAgain = false;
let music = false;
let mouseOverMusic = false;
let mouseOverMusicP = false;
let mouseOverMusicM = false;
let mouseOverAudio = false;
let mouseOverAudioP = false;
let mouseOverAudioM = false;
let mouseOverSpeedP = false;
let mouseOverSpeedM = false;
let mouseOverResume = false;
let mouseOverX = false;
let audio = false;
let audioVolume = 0.5;
let musicVolume = 0.5;
let musicStatus = "";
let audioStatus = "";
let settings = false;
//Speed of the game is tied to framerate
let maxFrCap = 30;
let frCap = 15;
let startingFr = 8;
let fr = 8;
let cSpd = 1;
const UpDir =     {x:0, y:-cSpd};
const DownDir =   {x:0, y:cSpd};
const RightDir =  {x:cSpd, y:0};
const LeftDir =   {x:-cSpd,y:0};
let currenetDir = {x:0, y:0};

//Buttons positions
let endTX = 235;
let endTY = 200;
let setTX = 300;
let setTY = 95;
//TAB to resume
let resumeX = 175;
let resumeY = 350;
let resumeW = 250;
let resumeH = 50;
let resumeTX = resumeX + 125;
let resumeTY = resumeY + 35;
//X Button
let xX = 455;
let xY = 35;
let xW = 40;
let xH = 40;
let xTX = 475;
let xTY = 65;
//Yes button
let yesX = 165;
let yesY = 365;
let yesW = 90;
let yesH = 50;
//Play Again button
let paX = 310;
let paY = 365;
let paW = 100;
let paH = 80;
//Music Toggle button
let musX = 175;
let musY = 135;
let musW = 250;
let musH = 50;
let musTX = musX + 125;
let musTY = musY + 35;
//Increment Music button
let muspX = 435;
let muspY = 135;
let muspW = 50;
let muspH = 50;
let muspTX = muspX + 25;
let muspTY = muspY + 37;
//Decrement Music Button
let musmX = 115;
let musmY = 135;
let musmW = 50;
let musmH = 50;
let musmTX = musmX + 25;
let musmTY = musmY + 37;
//Audio Toggle button
let auX = 175;
let auY = 205;
let auW = 250;
let auH = 50;
let auTX = auX + 125;
let auTY = auY + 35;
//Increment Audio button
let aupX = 435;
let aupY = 205;
let aupW = 50;
let aupH = 50;
let aupTX = aupX + 25;
let aupTY = aupY + 37;
//Decrement Audio Button
let aumX = 115;
let aumY = 205;
let aumW = 50;
let aumH = 50;
let aumTX =  aumX + 25;
let aumTY = aumY + 37;
//Speed
let speedX = 175;
let speedY = 275;
let speedW = 250;
let speedH = 50;
let spTX = speedX + 125;
let spTY = speedY + 35;
//Increment Speed button
let sppX = 435;
let sppY = 275;
let sppW = 50;
let sppH = 50;
let sppTX = sppX + 25;
let sppTY = sppY + 37;
//Decrement speed Button
let spmX = 115;
let spmY = 275;
let spmW = 50;
let spmH = 50;
let spmTX = spmX + 25;
let spmTY = spmY + 37;
//Preload media
let fontArcade = "";
let eatSFX = "";
let BGM = "";
function preload() {
  fontArcade = loadFont("fonts/sf-pixelate.bold-oblique.ttf");
  //Eating sound effect
  eatSFX = loadSound("audio/eat.wav");
  eatSFX.setVolume(audioVolume);
  //Background music //TODO: Change BGM to my own
  BGM = loadSound("audio/FDSrushjet1fdx32.mp3");
  BGM.setVolume(musicVolume);
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("sketch-holder");
  background(backgroundColor);
  textFont(fontArcade);
  s = new Crawler();
  frameRate(fr);
  pickLocation();
  lastPos = currentPos;
}



//Checks if an array (list) contains an object (obj) with the same x and y values
function containsObject(obj, list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].x === obj.x && list[i].y === obj.y) {
            return true;
        };
    };
    return false;
}

// Returns a random integer between min (included) and max (excluded)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


function victory(){
  //Change framerate to set the speed of victory animation
  //A high framerate seems to look best
  frameRate(maxFrCap);
  win = true;
}

function pickLocation() {
  //Pick a new location for the food. 
  //Can't be below the bottom line or on top of the body of the crawler
  let created = false;
  let overlap = false;
  let cols = floor( (width / scl) -1); //-1 to avoid food spawning outside field
  let rows = floor( (height / scl) -3);//2 for the size of the bottom line, and 1 more to avoid spawning outside field

  //Fill emptyCols and emptyRows
  let emptyCols = [];
  let emptyRows = [];
  for (let i = cols; i >= 0; i--) {
    emptyCols[i] = i;
  };
  for (let i = rows; i >= 0; i--) {
    emptyRows[i] = i;
  };

  //Pick a random coordinate from the available empty cols and rows and multiply it by scl, so it's on the grid
  //TODO: Maybe need to add +1 to the max, since it may be excluded. Need more testing. 
  //TODO: Or add it directly to the function and remove it from the rest of the code
  let allowedCol = (emptyCols[getRandomInt(0,emptyCols.length)] * scl);
  let allowedRow = (emptyRows[getRandomInt(0,emptyRows.length)] * scl);

  //Check if the food would spawn on top of the tail or head, if there is overlap, prevent it.
  for (let i = 0; i < s.tail.length; i++) {
      let posit = s.tail[i];
      let distn = dist(allowedCol, allowedRow, posit.x, posit.y);
      if (distn < 1) {
        overlap = true;
        break;
      };
    };

//This prevents the overlap and if there is no more space, end the game.
if (overlap) {
  //Adds every coord of the tail to an array, then generate a new coord for the food excluding the ones in the tail array
  //Initialize forbiddenCoords with position of head, and later add tail positions
  let forbiddenCoords = [ {x: (s.x/scl),y: (s.y/scl)} ];
  let allowedCoords = [];

  for (let j = 0; j < s.tail.length; j++) {
    let posNew = s.tail[j];
    forbiddenCoords.push({ x: (posNew.x/scl) , y: (posNew.y/scl) });
    };

//This checks which tiles are available by adding every coord to the allowedCoords array, 
//only if they are not contained in the forbiddenCoords array
      for (let k = cols; k >= 0; k--) {
          for (let n = rows; n >= 0; n--) {
              let coordsTocheck = {x: k , y: n};
              if ( containsObject( coordsTocheck, forbiddenCoords ) ) {
              }else{
                allowedCoords.push(coordsTocheck);
                };
              };
            };

  //TODO: Make food spawn at a random available position, making it always spawn at the same spot is bad
  //TODO: Also change these comments after it's done
  //Then create the food with the first item in allowedCoords if available and multiply by scl
  //(Should pick a random one)

  if (allowedCoords.length > 0) {
    let freeLoc = getRandomInt(0,allowedCoords.length+1);
    food = createVector( (allowedCoords[freeLoc].x *scl) , (allowedCoords[freeLoc].y*scl) );
    created = true;
    //Create bonus piece of food if there is at least one more free space
    if (allowedCoords.length > 1) {
      let bonusFreeLoc = getRandomInt(0,allowedCoords.length+1);
      //If the random bonus location is the same as the normal food, see if one higher or one lower is available, and pick that. 
      if (bonusFreeLoc === freeLoc) {
        if (allowedCoords[bonusFreeLoc+1]) {
          bonusFreeLoc += 1;
          bonusFood = createVector( (allowedCoords[bonusFreeLoc].x *scl) , (allowedCoords[bonusFreeLoc].y*scl) );
          bonusFoodSpawned = true;
          bonusFoodTime = bonusFoodTimeC;
        }else if( allowedCoords[bonusFreeLoc-1]){
          bonusFreeLoc -= 1;
          bonusFood = createVector( (allowedCoords[bonusFreeLoc].x *scl) , (allowedCoords[bonusFreeLoc].y*scl) );
          bonusFoodSpawned = true;
          bonusFoodTime = bonusFoodTimeC;
        }else{
          //If nothing is available, something went wrong.
        };
      } else {
        //If the bonus location is different from the normal food, pick it.
        bonusFood = createVector( (allowedCoords[bonusFreeLoc].x *scl) , (allowedCoords[bonusFreeLoc].y*scl) );
        bonusFoodSpawned = true;
        bonusFoodTime = bonusFoodTimeC;
      };
    };
  }else{
    //No more space to spawn food
    food = "";
    victory();
    return;
  }
}

//Creates the food at the start of the game
if (!started) {
  //If the food would spawn on the same position of the head at the start of the game, make it spawn 2 tiles below.
  if (allowedCol === startingX && allowedRow === startingY) {allowedRow = startingY+(scl*2); };
  food = createVector(allowedCol , allowedRow);
  started = true;
  created = true;
};

//If the food wasn't created at this point it spawns normally
if (!created) {
  //If it appears at the same position as the previous one, pick a new position.
  if (food.x === allowedCol && food.y === allowedRow) {
    pickLocation();
  }else{
    //Otherwise just create it on an empty tile
  food = createVector(allowedCol , allowedRow);
  };
};
}

function pauseText (){
  fill(textBG);
  rect(195,260,210,60);
  fill(textColor);
  textSize(26);
  text("Click to play", 200, 300);
}


function endScreen(endText){
  //max framerate for better responsiveness
  frameRate(maxFrCap);
  //Menu background
  fill(menuBG);
  rect(10,140,580,320);
  //Menu text
  fill(textBG);
  rect(200,160,200,60);
  fill(textColor);
  textSize(26);
  if (endText === "Game Over") {endTX = 215;}; //Adjust positioning
  text(endText, endTX, endTY);

  textSize(24);
  fill(textBG);
  rect(120,235,350,50);
  fill(textColor);
  text("Your score is: " + score, 180, 270);

  textSize(22);
  fill(textBG);
  rect(25,305,540,50);
  fill(textColor);
  text("Would you like to submit your score?", 40, 340);

  textSize(22);
  if (mouseOverYes) {
    fill(hovered);
  }else{
    fill(textBG);
  }  
  rect(yesX,yesY,yesW,yesH);
  fill(textColor);
  text("Yes", 185, 400);

  textSize(22);
  if (mouseOverPlayAgain) {
    fill(hovered);
  }else{
    fill(textBG);
  }  
  rect(paX,paY,paW,paH);
  fill(textColor);
  textAlign(CENTER);
  text("Play\nagain", 360, 400);
  textAlign(LEFT);
}

function settingsMenu(){
  //Menu background
  fill(menuBG);
  rect(100,30,400,400);
  textAlign(CENTER);
  //Settings text
  fill(textBG);
  rect(210,60,180,50);
  fill(textColor);
  textSize(26);
  text("Settings", setTX, setTY);
  //Closing X
  if (mouseOverX) {
    fill(hovered);
  }else{
    fill(textBG);
  }  
  rect(xX,xY,xW,xH);
  fill(textColor);
  textSize(30);
  text("X", xTX, xTY);
  //Music
  //++
  textSize(30);
  if (mouseOverMusicP) {
    fill(hovered);
  }else{
    fill(textBG);
  }
  rect(muspX,muspY,muspW,muspH);
  fill(textColor);
  text("+", muspTX, muspTY);
  //--
  if (mouseOverMusicM) {
    fill(hovered);
  }else{
    fill(textBG);
  }
  rect(musmX,musmY,musmW,musmH);
  fill(textColor);
  text("-", musmTX, musmTY);
  //Audio Text
  textSize(20);
  if (mouseOverMusic) {
    fill(hovered);
  }else{
    fill(textBG);
  }  
  rect(musX,musY,musW,musH);
  fill(textColor);
  if (!music) {
    musicStatus = "Muted";
  }else{
    musicStatus = Math.round( ( musicVolume )*10 ) +"/10"; //*10 so it shows in a scale of 1 to 10 instead of 0.1 to 1.
  }
  text("Music: " + musicStatus, musTX, musTY);
  //Audio
  //++
  textSize(30);
  if (mouseOverAudioP) {
    fill(hovered);
  }else{
    fill(textBG);
  }
  rect(aupX,aupY,aupW,aupH);
  fill(textColor);
  text("+", aupTX, aupTY);
  //--
  if (mouseOverAudioM) {
    fill(hovered);
  }else{
    fill(textBG);
  }
  rect(aumX,aumY,aumW,aumH);
  fill(textColor);
  text("-", aumTX, aumTY);
  //Audio Text
  textSize(20);
  if (mouseOverAudio) {
    fill(hovered);
  }else{
    fill(textBG);
  }  
  rect(auX,auY,auW,auH);
  fill(textColor);
  if (!audio) {
    audioStatus = "Muted";
  }else{
    audioStatus = Math.round( ( audioVolume )*10 ) +"/10"; //*10 so it shows in a scale of 1 to 10 instead of 0.1 to 1.
  }
  text("Audio: " + audioStatus, auTX, auTY);
  //Speed cap
  //++
  textSize(30);
  if (mouseOverSpeedP) {
    fill(hovered);
  }else{
    fill(textBG);
  }
  rect(sppX,sppY,sppW,sppH);
  fill(textColor);
  text("+", sppTX, sppTY);
  //--
  if (mouseOverSpeedM) {
    fill(hovered);
  }else{
    fill(textBG);
  }
  rect(spmX,spmY,spmW,spmH);
  fill(textColor);
  text("-", spmTX, spmTY);
  //Spped Text
  textSize(18);
  fill(textBG);
  rect(speedX,speedY,speedW,speedH);
  fill(textColor);
  text("Speed cap: " + fr.toPrecision(3)+"/"+frCap.toPrecision(3), spTX, spTY);
  //Press TAB to resume
  if (mouseOverResume) {
    fill(hovered);
  }else{
    fill(textBG);
  }  
  rect(resumeX,resumeY,resumeW,resumeH);
  fill(textColor);
  textSize(20);
  text("\"TAB\" to resume", resumeTX, resumeTY);
  //Normalize textAlign
  textAlign(LEFT);
}

function restartgame(){
  if (!inCinemaMode) {
    inCinemaMode = true;
  };
  if (music) {
    BGM.loop();
    BGM.play();
  };
  s.total = 0;
  s.tail = [];
  score = 0;
  win = false;
  started = false;
  gameOver = false;
  s.x = startingX;
  s.y = startingY;
  s.xspeed = 0;
  s.yspeed = 0;
  r = 69;
  g = 193;
  b = 166;
  fr = startingFr;
  frameRate(fr);
  pickLocation();
}

function submitScore(){
  inCinemaMode = true;
}

function mouseClicked(){
  if (win || gameOver && mouseOverPlayAgain) {
    restartgame();
  }else if(win || gameOver && mouseOverYes){
    submitScore();
  };

  //Music toggle
  if (mouseOverMusic) {
    if (!music) {
      music = true;
      BGM.loop();
      BGM.play();
    }else{
      music = false;
      BGM.stop();
    };
  };
  //Music ++
  let musicIncr = 0.1;
  if (mouseOverMusicP) {
    if (musicVolume >= 0.9) {
      musicVolume = 1;
    }else{
      musicVolume = (musicVolume+musicIncr);
      BGM.setVolume(musicVolume);
    };
  };
  //Music --
  if (mouseOverMusicM) {
    if (musicVolume <= 0.1) {
      musicVolume = 0;
    }else{
      musicVolume = (musicVolume-musicIncr);
      BGM.setVolume(musicVolume);
    };
  };

  //Audio toggle
  if (mouseOverAudio) {
    if (!audio) {
      audio = true;
    }else{
      audio = false;
    };
  };
  //Audio ++
  let audioIncr = 0.1;
  if (mouseOverAudioP) {
    if (audioVolume >= 0.9) {
      audioVolume = 1;
    }else{
      audioVolume = (audioVolume+audioIncr);
      eatSFX.setVolume(audioVolume);
    };
  };
  //Audio --
  if (mouseOverAudioM) {
    if (audioVolume <= 0.1) {
      audioVolume = 0;
    }else{
      audioVolume = (audioVolume-audioIncr);
      eatSFX.setVolume(audioVolume);
    };
  };
  //Speed ++
  if (mouseOverSpeedP) {
    frCap +=1;
    if (frCap > maxFrCap) { frCap = maxFrCap};
  };
  //Speed --
  if (mouseOverSpeedM) {
    frCap -=1;
    if (frCap < startingFr) { frCap = startingFr};
    //Current framerate can't exceed cap
    if (fr > frCap) {
      fr = frCap;
    };
  };
  //Resume and X have the same effect as pressing TAB to exit the settings menu
  if (mouseOverResume || mouseOverX ) {
    //framerate must be updated when settings are closed
    frameRate(fr);
    settings = false;
  };
}

function isMouseOver(x,y,w,h){
  if (mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h) {
    return true;
  }else{
    return false;
  };
}

function draw() {
  if(!playing && !gameOver && !win){
    pauseText();
  }else if (win || gameOver) {
    s.show();
    //Track mouse
    //Yes
    if ( isMouseOver(yesX,yesY,yesW,yesH) ) {
      mouseOverYes = true;
    }else{
      mouseOverYes = false;
    };
    //Play Again
    if ( isMouseOver(paX,paY,paW,paH) ) {
      mouseOverPlayAgain = true;
    }else{
      mouseOverPlayAgain = false;
    };
    if (win) {
      endScreen("Victory!");
    }else if(gameOver){
      if (music) {
        //TODO: Modulate music for dramatic gameover effect
        //BGM.fade(0,1); //Doesn't work for now so just stop the music.
        BGM.stop(); //"music" is still true, so if the game restats the music restarts.
      };
      endScreen("Game Over");
    };
  }else if (settings) {
    s.show();
    //Track mouse
    //Music toggle
    mouseOverMusic = isMouseOver(musX,musY,musW,musH);
    //Music ++
    mouseOverMusicP = isMouseOver(muspX,muspY,muspW,muspH);
    //Music --
    mouseOverMusicM = isMouseOver(musmX,musmY,musmW,musmH);
    //Audio toggle
    mouseOverAudio = isMouseOver(auX,auY,auW,auH);
    //Audio ++
    mouseOverAudioP = isMouseOver(aupX,aupY,aupW,aupH);
    //Audio --
    mouseOverAudioM = isMouseOver(aumX,aumY,aumW,aumH);
    //Speed ++
    mouseOverSpeedP = isMouseOver(sppX,sppY,sppW,sppH);
    //Speed --
    mouseOverSpeedM = isMouseOver(spmX,spmY,spmW,spmH);
    //Resume Button
    mouseOverResume = isMouseOver(resumeX,resumeY,resumeW,resumeH);
    //X Button
    mouseOverX = isMouseOver(xX,xY,xW,xH);
    
    settingsMenu();
  }else{
    background(50);
    //Eat food
    if (s.eat(food)) {
      if (audio) {eatSFX.play();};
      score += 1;
      pickLocation();
      let incr = 0.2;
      if (fr < frCap-incr) {
        fr += incr;
        frameRate( fr );
      };
    };
    //TODO: If not eaten for x time (steps defined by framerate) deisappears
    //TODO: Bonus food should disappear when restarting a game, for now it doesn't.
    //Eat bonus food. Only inscreases score, not speed.
    if (bonusFood) {
      if (bonusFoodSpawned) {
        bonusFoodTime -=1;
        if (bonusFoodTime <= 0) {
          bonusFood = "";
          bonusFoodSpawned = false;
          };
        };
      if ( s.eat(bonusFood) ) {
        if (audio) {eatSFX.play();};
        score += 10;
        bonusFood = "";
        bonusFoodSpawned = false;
        };
      };

    s.update();
    s.show();
    s.death();
    //Food
    fill(255);
    rect(food.x, food.y, scl, scl,20);
    //Bonus Food
    if (bonusFood) {
      fill(0,255,0);
      rect(bonusFood.x, bonusFood.y, scl, scl,5);
      //And icon next to timer
      rect(bonusFoodIcon.x, bonusFoodIcon.y, scl, scl,5);
    };
  };
}

//TODO: Fix bug that causes death when turning rapidly making it so you eat the tail piece right behind the head
//TODO: The fix to that bug causes poor responsiveness, make it so move commands can be queued (up to 1) for better responsiveness
function keyPressed() {
  switch(keyCode) {
    case TAB:
    if (!settings) {
      //Max framerate while in settings for better responsiveness
      frameRate(maxFrCap);
    settings = true;
    }else{
      //Return framerate to normal when returning to game
      frameRate(fr);
      settings = false;
      }
      break;
    default:
  };
  
  if (lastPos.x === currentPos.x && lastPos.y === currentPos.y) {

    //Don't allow more movement until the head is in a new position
  
  }else{
    switch(keyCode) {
      case UP_ARROW:
      if (currenetDir === DownDir) {
      }else{
        lastPos = currentPos;
        s.dir(UpDir);
        currenetDir = UpDir;
      }
      break;
      case DOWN_ARROW:
      if (currenetDir === UpDir) {
      }else{
        lastPos = currentPos;
        s.dir(DownDir);
        currenetDir = DownDir;
      }
      break;
      case RIGHT_ARROW:
      if (currenetDir === LeftDir) {
      }else{
        lastPos = currentPos;
        s.dir(RightDir);
        currenetDir = RightDir;
      }
      break;
      case LEFT_ARROW:
      if (currenetDir === RightDir) {
      }else{
        lastPos = currentPos;
        s.dir(LeftDir);
        currenetDir = LeftDir;
      }
      break;
      default:
      if (!playing || win || gameOver) {
      }else{
        return false;
      };
    };
  };
}