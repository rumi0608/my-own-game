var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ground, ground_image, invisible_ground;
var girl, girl_running, girl_collided, girlImage, zombie, zombie_running, zombie_attack;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var jumpSound, dieSound, checkpointSound;
var score;
var gameOver, restart, gameOverImage, restartImage;

function preload() {
  ground_image = loadImage("photos/Background.png");
  girl_running = loadAnimation("photos/Run (1).png", "photos/Run (2).png", "photos/Run (3).png", "photos/Run (4).png", "photos/Run (5).png", "photos/Run (6).png", "photos/Run (7).png", "photos/Run (8).png", "photos/Run (9).png", "photos/Run (10).png", "photos/Run (11).png", "photos/Run (12).png", "photos/Run (14).png", "photos/Run (15).png", "photos/Run (16).png", "photos/Run (17).png", "photos/Run (18).png", "photos/Run (19).png", "photos/Run (20).png");
  zombie_running = loadAnimation("photos/Walk (1).png", "photos/Walk (2).png", "photos/Walk (3).png", "photos/Walk (4).png", "photos/Walk (5).png", "photos/Walk (6).png", "photos/Walk (7).png", "photos/Walk (8).png", "photos/Walk (9).png", "photos/Walk (10).png");
  zombie_attack = loadAnimation("photos/Attack (2).png", "photos/Attack (3).png", "photos/Attack (4).png", "photos/Attack (5).png", "photos/Attack (6).png", "photos/Attack (7).png", "photos/Attack (8).png");
  obstacle1 = loadImage("photos/obstacle1.png");
  zombie_idle = loadImage("photos/Stand.png");
 gameOverImage = loadImage("photos/gameOver1.png");
  restartImage = loadImage("photos/restart1.png");
  girl_collided = loadImage("photos/Dead (30).png");
  girlImage = loadImage("photos/Idle (1).png");
}

function setup() {
  createCanvas(600, 500);

  ground = createSprite(0, 0, 0, 0);
  ground.shapeColor = "white";
  ground.addImage("ground_image", ground_image);
  ground.scale = 1.4;
  ground.velocityX = -1

  girl = createSprite(300, 420, 600, 10);
  girl.addAnimation("girl_running", girl_running);
  girl.addImage("girl_collided", girl_collided);
  girl.addImage("girlImage", girlImage);
  girl.scale = 0.2;
  // girl.velocityX=2;
  girl.debug = false;
  girl.setCollider("rectangle", 0, 0, girl.width, girl.height)


  zombie = createSprite(50, 410, 600, 10);
  zombie.addAnimation("zombie_running", zombie_running);
  zombie.addAnimation("zombie_attack", zombie_attack);
  zombie.addImage("zombie_idle", zombie_idle);
  zombie.scale = 0.2;
  zombie.debug = false;
  // zombie.velocityY=-13;
  // zombie.velocityX=Math.round(random(1,2));

  invisible_ground = createSprite(300, 470, 600, 10);
  invisible_ground.visible = false;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImage);

  restart = createSprite(300, 180);
  restart.addImage(restartImage);

  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  background("black");

  // console.log(girl.y);
  //Gravity
  girl.velocityY = girl.velocityY + 0.8;
  girl.collide(invisible_ground);

  //Gravity
  zombie.velocityY = zombie.velocityY + 0.8;
  zombie.collide(invisible_ground);


  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
    //  zombie.y=girl.y;
    score = score + Math.round(getFrameRate() / 60);

    spawnObstacles();
    if (obstaclesGroup.isTouching(zombie)) {
      zombie.velocityY = -12;
    }
    ground.velocityX = -(4 + 3 * score / 100);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (score > 0 && score % 100 === 0) {
     
    }

    if ((keyDown("space") && girl.y >= 220)) {
      girl.velocityY = -12;
      
    }

    if (girl.isTouching(obstaclesGroup)) {
      gameState = END;
      
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    girl.velocityY = 0
    girl.changeImage("girlImage", girlImage);
    zombie.changeAnimation("zombie_attack", zombie_attack);
    zombie.x = girl.x;
    if (zombie.isTouching(girl)) {
      girl.changeImage("girl_collided", girl_collided);
      zombie.changeImage("zombie_idle", zombie_idle);
    }
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);

    if (mousePressedOver(restart)) {
      reset();
    }
  }


  drawSprites();
  fill("lightpink");
  textSize(20);
  text("Score: " + score, 500, 50);
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  girl.changeAnimation("girl_running", girl_running);
  obstaclesGroup.destroyEach();
  score = 0;
  zombie.x = 50;
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 450, 10, 40);
    obstacle.velocityX = -6; //+ score/100);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    obstacle.addImage(obstacle1);
    obstacle.scale = 0.1;
    obstaclesGroup.add(obstacle);
    obstacle.debug = false;
    obstacle.setCollider("circle", 0, 0, 1);
  }

}