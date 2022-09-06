//módulos da biblioteca Matter
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var fruit,rope, rope2, rope3;
var link, link2, link3;
var bunny;
var bunnyImg, fruitImg, bgImg;
var button, button2, button3, soundButton,airButton;
var bunnyAnimation, eatAnimation, sadAnimation;
var eatSound, sadSound,backgroundSound, cutSound, airSound;
var canW, canH;

function preload()
{
  bgImg = loadImage('assets/background.png');
  bunnyImg = loadImage('assets/Rabbit-01.png');
  fruitImg = loadImage('assets/melon.png');
  bunnyAnimation = loadAnimation('assets/blink_1.png','assets/blink_2.png', 'assets/blink_3.png');
  eatAnimation = loadAnimation('assets/eat_0.png','assets/eat_1.png', 'assets/eat_2.png', 'assets/eat_3.png', 'assets/eat_4.png')
  sadAnimation = loadAnimation('assets/sad_1.png', 'assets/sad_2.png', 'assets/sad_3.png');

  //executando a animação
  bunnyAnimation.playing = true;
  bunnyAnimation.looping = true;

  eatAnimation.playing = true;
  eatAnimation.looping = false;

  sadAnimation.playing = true;
  sadAnimation.looping = false;

  //carregando os sons
  eatSound = loadSound('assets/eating_sound.mp3');
  sadSound = loadSound('assets/sad.wav');
  backgroundSound = loadSound('assets/sound1.mp3');
  cutSound = loadSound('assets/rope_cut.mp3');
  airSound = loadSound('assets/air.wav');
}


function setup() 
{
  //criação da tela
  //createCanvas(500,700);
  var isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = displayWidth;
    canH = displayHeight;
    createCanvas(canW,canH);
  }
  else{
    canW = windowWidth;
    canH = windowHeight;
    createCanvas(canW,canH);
  }

  //taxa de frames
  frameRate(80);
  //mecanismo de física
  engine = Engine.create();
  //nosso mundo
  world = engine.world;

  //criação de solo
  ground = new Ground(250,canH-50,500,20);

  //criar a corda
  rope = new Rope(5,{x:250,y:20});
  rope2 = new Rope(5,{x:70,y:110});

  //criar a fruta

  var fruit_options = {
    restitution: 0.5
  }

  fruit = Bodies.circle(300,200,15,fruit_options);
  
  //adicionando a fruta no composto
  Matter.Composite.add(rope.body,fruit);

  //criar o link entre a fruta e a corda
  link = new Link(rope,fruit);
  link2 = new Link(rope2,fruit);
  
  //criar o coelho
  coelho = createSprite(250,canH-150,50,80);
  //coelho.addImage("coelho",bunnyImg);
  coelho.scale = 0.3;

  //trabalhando com os frames
  bunnyAnimation.frameDelay = 20;
  eatAnimation.frameDelay = 20;
  sadAnimation.frameDelay = 20;
  //adicionando a animação
  coelho.addAnimation('piscando', bunnyAnimation);
  coelho.addAnimation('comendo', eatAnimation);
  coelho.addAnimation('triste', sadAnimation);

  //botão para cortar a corda
  button = createImg('assets/cut_btn.png');
  button.position(220,30);
  button.size(50,50);
  button.mouseClicked(drop);

  //botão para cortar a corda
  button2 = createImg('assets/cut_btn.png');
  button2.position(50,100);
  button2.size(50,50);
  button2.mouseClicked(drop2);

  //botão para parar/voltar o som
  soundButton = createImg('assets/mute.png');
  soundButton .position(450,30);
  soundButton .size(50,50);
  soundButton .mouseClicked(mute);

  //botão para soprar a melancia
  airButton = createImg('assets/balloon.png');
  airButton .position(50,160);
  airButton .size(100,80);
  airButton .mouseClicked(wind);
  //configuração de texto e desenho
  imageMode(CENTER);
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);
}

function draw() 
{
  //cor de fundo
  background(0); //0 preto e 256 é branco

  //imagem de fundo
  image(bgImg,canW/2,canH/2,canW,canH);
  
  //atualização do mecanismo de física
  Engine.update(engine);

  //mostrar o solo
  //ground.show();

  //mostrar a corda
  rope.show();
  rope2.show();

  //mostrar a fruta
  if(fruit != null){
  image(fruitImg, fruit.position.x, fruit.position.y, 60, 60);
  }
  //detecção de colisão com o chão
    if(fruit != null && fruit.position.y>=canH-100){
      sadSound.play();
      coelho.changeAnimation("triste");
      fruit=null
    }
    

  //detecção de colisão da fruta
  if(collide(fruit,coelho) === true){
    coelho.changeAnimation('comendo');
    eatSound.play()
  }
  //desenhar os sprites
  drawSprites();
   
}

//função para cortar a corda
function drop(){
  rope.break();
  link.dettach();
  link = null;
  cutSound.play();
}

function drop2(){
  rope2.break();
  link2.dettach();
  link2 = null;
  cutSound.play();
}

function collide(body,sprite){
  if(body != null){
    var d = dist(body.position.x, body.position.y,sprite.position.x, sprite.position.y);
    if(d<=80){
      World.remove(world,fruit); //remove a melancia do mundo
      fruit = null;
      return true;
    }
    else{
      return false;
    }
  }
}

function mute(){
  if(backgroundSound.isPlaying()){
    backgroundSound.stop();
  }
  else{
    backgroundSound.play();
  }
}

function wind(){

  Matter.Body.applyForce(fruit,{
    x:0,y:0},{  x:0.01,y:0 
  })
  airSound.play();
}









