let startingX = canvasX/2;
let startingY = (canvasY/2)-(scl*2);
let red = 69;
let green = 193;
let blue = 166;
let counter = 0;
const bottomLinePosY = canvasY-(scl*2);
let currentPos = {x: 0, y: 0};
let lastPos;
let limitX = canvasX - scl;
let limitY = canvasY - (scl*3);
function Crawler() {
  this.x = startingX;
  this.y = startingY;
  this.xspeed = 0;
  this.yspeed = 0;
  this.total = 0;
  this.tail = [];

  this.eat = function(pos) {
    let d = dist(this.x, this.y, pos.x, pos.y);
    if (d < scl) {
      this.total++;
      return true;
    } else {
      return false;
    };
  }

  this.dir = function(xyDir) {

    this.xspeed = xyDir.x;
    this.yspeed = xyDir.y;
  }

  this.death = function() {
    for (let i = 0; i < this.tail.length; i++) {
      //BUG: (BUG1:Undefined tail) Temporary workaround to missing tail on win. 
      //Don't know how to reproduce this, and it happens rarely, so for now it's low priority.
      //Sometimes an element inside the tail array is missing, for some reason, so it causes a crash since it's undefined
      if (!this.tail[i]) {
        //Skip the current iteration if the tail piece is missing. (This is the workaround)
        continue;
      };
      let pos = this.tail[i];
      let d = dist(this.x, this.y, pos.x, pos.y);
      //If touching tail
      if (d < scl) {
        gameOver = true;
      };
    };
    //Hit a wall
    if (this.y === -1 || this.y === (limitY+1) || this.x === -1 || this.x === (limitX+1) ) {
        gameOver = true;
    };
  }

  this.update = function() {
    if (this.total === this.tail.length) {
      for (let i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }
    this.tail[this.total - 1] = createVector(this.x, this.y);

    this.x = this.x + this.xspeed * scl;
    this.y = this.y + this.yspeed * scl;

    //Make constraints -1 and +1 of the limits to avoid death when being near the walls without touching them.
    this.x = constrain(this.x, -1, (limitX+1) );
    this.y = constrain(this.y, -1, (limitY+1) );//*3 to constrain the crawler above the line

    currentPos = {x: this.x, y: this.y}
  }

  this.show = function() {
    //Tail
    fill(red, green, blue);
    for (let i = 0; i < this.tail.length; i++) {
      //pick a random color if rainbow
      if (rainbow) {
        red = Math.floor(Math.random() * 255);
        green = Math.floor(Math.random() * 255);
        blue = Math.floor(Math.random() * 255);
        fill(red, green, blue);
      }else if (win || gameOver) {
          //A bright tile flows through the whole tail and loops until the game is restarted
          if (i === counter) {
            red = 215;
            green = 255;
            blue = 246;
            fill(red, green, blue);
          }else if(i === counter-1){
            red = 150;
            green = 255;
            blue = 231;
            fill(red, green, blue);
          }else{
            red = 69;
            green = 193;
            blue = 166;
            fill(red, green, blue);
          };
        };
      //BUG: Same as (BUG1)
      if (!this.tail[i]) {
        continue;
      };
      rect(this.tail[i].x, this.tail[i].y, scl, scl,2);
    };
    //Head
    red = 69;
    green = 193;
    blue = 166;
    fill(red, green, blue);
    if (win || gameOver) {
      counter +=1;
      if (counter > this.tail.length) {
        fill(215, 255, 246);
      };
      if (counter >= this.tail.length+1) {counter = 0;};
    };

    rect(this.x, this.y, scl, scl,2);
    //Score and speed
    fill(50, 130, 255);
    textSize(14);
    text(scoreLabelGame + score, 10, 590);
    text(speedLabel + fr.toPrecision(3), speedLabelX, 590);
    //Bonus food time
    if (bonusFoodSpawned) {
      text(eatBeforeLabel + bonusFoodTime, 240, 590);
    };
    //Bottom Line
    stroke(255);
    line(0, bottomLinePosY, canvasX, bottomLinePosY );
    stroke(0);
  }
}