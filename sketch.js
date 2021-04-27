var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var PLAY, END, gamestate;
var gameOver,gameOverImage, restart, restartImage;
var highScore = 0;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;


function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
}

function setup() {
  createCanvas(1200, 200);

  PLAY = 1;
  END = 0;

  gamestate = PLAY;
  
  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
   trex.addImage("collided", trex_collided);
  trex.scale = 0.5;
  trex.velocityX = 4;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 4;
  ground.velocityX = 0;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
  
  gameOver = createSprite(300,100,10,10);
  gameOver.addImage("gameOver",gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(300,120,10,10);
  restart.addImage("restart",restartImage);
  restart.scale = 0.3;
  restart.visible = false;
}

function draw() {
  
  camera.x = trex.x;
  gameOver.x = restart.x = camera.x;

  background(180);
  if (gamestate === PLAY) {
    score = score + Math.round(getFrameRate() / 60);


    if (keyDown("space")) {
      trex.velocityY = -10;
    }

    trex.velocityX = 4;
    trex.velocityY = trex.velocityY + 0.8

    invisibleGround.x = trex.x;

    if (ground.x < trex.x - 300){
      ground.x = trex.x;
    }
    spawnClouds();
    spawnObstacles();
    
    if(trex.isTouching(obstaclesGroup)){
      gamestate = END;
    }
  } else if(gamestate === END){
    ground.velocityX = 0;
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    trex.velocityX = 0;
    trex.changeImage("collided", trex_collided);
    gameOver.visible = true;
    restart.visible = true;
  }

  if(mousePressedOver(restart)){
  reset();
  }
  
  trex.collide(invisibleGround);
  text("Score: " + score, trex.x +200, 50);
  text("High Score:"+ highScore,trex.x+100,50);

  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(trex.x + 600, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = 0;

    //assign lifetime to the variable
    cloud.lifetime = 500;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }

}

function spawnObstacles() {
  if (frameCount % 100 === 0) {
    var obstacle = createSprite(trex.x + 600, 165, 10, 40);
    obstacle.velocityX = 0;

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 500;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gamestate = PLAY;
  trex.changeAnimation("running",trex_running);
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  gameOver.visible = false;
  restart.visible = false;
  if(highScore < score){
    highScore = score;
  }
  score = 0;
}
