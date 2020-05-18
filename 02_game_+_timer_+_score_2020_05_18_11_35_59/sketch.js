// empty array of bubbles 
let bubbles = [];

//sound file
let popSound;

let timer = 30;

let score = 0;

function preload() {
  popSound = loadSound("popSound.m4a");
}

//posenet stuff
let video;
let poseNet;
leftWristX = 0; 
leftWristY = 0;
rightWristX = 0;
rightWristY = 0;

w = 640;
h = 480;


function setup() {
  
  //posenet 
video = createCapture(VIDEO);
  video.size(w, h);
  createCanvas(w, h);
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);


  //how many bubbles are drawn
  for (let i = 0; i < 300; i++) {
    let x = random(width);
    let y = random(height);
    let r = random(10, 50);
    let b = new Bubble(x, y, r);
    bubbles.push(b);
  }
}

//pose detection
gotPoses = function(poses) {
  console.log(poses);
  if (poses.length > 0) {
    lX = poses[0].pose.keypoints[9].position.x;
    lY = poses[0].pose.keypoints[9].position.y;
    rX = poses[0].pose.keypoints[10].position.x;
    rY = poses[0].pose.keypoints[10].position.y;

    leftWristX = lerp(leftWristX, lX, 0.5);
    leftWristY = lerp(leftWristY, lY, 0.5);
    rightWristX = lerp(rightWristX, rX, 0.5);
    rightWristY = lerp(rightWristY, rY, 0.5);
  }
}

modelReady = function() {
  console.log('model ready');
}


function draw() {
  
  //video drawn to canvas 
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0);
  d = dist(leftWristX, leftWristY, rightWristX, rightWristY);

  fill(255);
  noStroke();
  ellipse(leftWristX, leftWristY, 20);

  fill(255);
  ellipse(rightWristX, rightWristY, 20);
  
  //draw all bubbles in array
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].show();
    bubbles[i].burst(rightWristX, rightWristY);
    bubbles[i].burst(leftWristX, leftWristY);
  }
  
  //timer
  countdown();
  
  highScore();
}

class Bubble {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.alive = true;
  }

  //bubble disappears and sound plays 
  burst(bx, by) {
    let d = dist(bx, by, this.x, this.y);
    if (d < this.r) {
      this.alive = false;
      this.x = 1000000;
      this.y = 1000000;
      popSound.play();
      score ++;//score icrement 
    }
  }

  show() {
    // stroke(color(random(255), 255, random(255), 200));
    stroke("#89cff0");
    strokeWeight(3);
    fill(113,201,255,100);
    // fill(color(random(255), 100, random(255), 225));
    ellipse(this.x, this.y, this.r * 2)
  }
}

function countdown(){
  textAlign(CENTER);
  translate(video.width, 0);
  scale(-1, 1);
  textSize(60);
  text(timer, width/2, height/2);
  
   if (frameCount % 30 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
    timer --;
  }
  if (timer == 0) {
   // background("black");
    video.stop();//stop recording
  }
}

function highScore(){
    textSize(40);
  noStroke();
  fill(255);
  text(score, width/2,450);
}