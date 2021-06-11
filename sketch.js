var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided, mario_walk;
var ground, invisibleGround, groundImage;
var backgroundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score=0;

var gameOver, restart;

var floor, floorImg, floorGroup;

localStorage["HighestScore"] = 0;

function preload(){
  mario_running =   loadAnimation("images/walk1.png","images/walk2.png","images/walk3.png");
  mario_collided = loadAnimation("images/marioUp.png");
 
  
  groundImage = loadImage("images/ground.png");
  backgroundImage = loadImage("images/day.jpg");
  
  cloudImage = loadImage("images/cloud.png");
  
  obstacle1 = loadImage("images/pipe.png");
  obstacle2 = loadImage("images/flowerPipe.png");
  obstacle3 = loadImage("images/mushroom.png");
  
  gameOverImg = loadImage("images/gameOverText.png");
  restartImg = loadImage("images/restart.png");
}

function setup() {
  createCanvas(displayWidth - 180, displayHeight-50);

  
  ground = createSprite(20,200,displayWidth,displayHeight);
  ground.addImage("ground",backgroundImage);
  ///ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);

  mario = createSprite(50,500,20,50);
  mario.addAnimation("running", mario_running);
  mario.scale = 2;
  //mario.debug=true;
  mario.setCollider("circle",0,0,25);
  
  gameOver = createSprite(displayWidth/2-30,displayHeight/2-40);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2-10,displayHeight/2+50);
  restart.addImage(restartImg);
  
  

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(0,510,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
 
  
}

function draw() {
  
  //camera.x = mario.x;
  //camera.y = mario.y;

  //gameOver.position.x = restart.position.x = camera.x

  background("grey");
  
  textAlign(RIGHT, TOP);
  text("Score: "+ score, 600,5);
 
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    

    if(keyDown("space") && mario.y >= 159) {
      mario.velocityY = -8;
    }
   
    
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 250){
      ground.x = ground.width/2-200;
    }
  
    mario.collide(invisibleGround);
    spawnClouds();
    spawnFloor();
  
    if(obstaclesGroup.isTouching(mario)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the mario animation
  
    mario.changeAnimation("collided",mario_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }


  }
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 160 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 1.2;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnFloor() {
  if(frameCount % 160 === 0) {
    var floor = createSprite(50,500,20,50);
    floor.y = Math.round(random(100,120));
    //floor.debug = true;
    floor.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1));
    switch(rand) {
      case 1: floor.addImage(obstacle1);
              break;
      
      
    }
    
    //assign scale and lifetime to the obstacle           
    floor.scale = 1.5;
    floor.lifetime = 300;
    //add each obstacle to the group
    floor.add(obstacle1);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}


