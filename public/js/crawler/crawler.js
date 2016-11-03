let startingX = 300;
let startingY = 280;
let r = 69;
let g = 193;
let b = 166;
let counter = 0;

let currentPos = {x: 0, y: 0};
let lastPos;
function Crawler() {
  this.x = startingX;
  this.y = startingY;
  this.xspeed = 0;
  this.yspeed = 0;
  this.total = 0;
  this.tail = [];

  this.eat = function(pos) {
    let d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.total++;
      return true;
    } else {
      return false;
    }
  }

  this.dir = function(xyDir) {

    this.xspeed = xyDir.x;
    this.yspeed = xyDir.y;
  }

  this.death = function() {
    for (let i = 0; i < this.tail.length; i++) {
      let pos = this.tail[i];
      let d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
          gameOver = true;
      }
    }
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

    this.x = constrain(this.x, 0, width - scl);
    this.y = constrain(this.y, 0, height - (scl*3) );//*3 to constrain the crawler above the line

    currentPos = {x: this.x, y: this.y}
  }

  this.show = function() {
    //Tail
    fill(r, g, b);
    for (let i = 0; i < this.tail.length; i++) {
      //pick a random color if rainbow
      if (rainbow) {
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        b = Math.floor(Math.random() * 255);
        fill(r, g, b);
        }else if (win) {
          //A bright tile flows through the whole tail and loops until the game is restarted
          if (i === counter) {
          r = 215;
          g = 255;
          b = 246;

          fill(r, g, b);
        }else if(i === counter-1){
          r = 150;
          g = 255;
          b = 231;
          fill(r, g, b);
        }else{
          r = 69;
          g = 193;
          b = 166;
          fill(r, g, b);
        }

        };

        rect(this.tail[i].x, this.tail[i].y, scl, scl,2);
        };

    //Head
    r = 69;
    g = 193;
    b = 166;
    fill(r, g, b);
        if (win) {
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
    text("Score: " + score, 10, 590);
    text("Speed: " + fr.toPrecision(3), 500, 590);
    //Bottom Line
    stroke(255);
    line(0, 560, 600, 560);
    stroke(0);
  }
}