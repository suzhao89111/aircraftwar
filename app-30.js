/**游戏的全局配置**/
var WIDTH = 480;    //手机中应该是屏幕的宽
var HEIGHT = 650;   //手机中应该是屏幕的高

var canvas = document.getElementById('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
var ctx = canvas.getContext('2d');

//游戏进行的五个阶段
const PHASE_READY = 1;    //就绪阶段
const PHASE_LOADING = 2;  //加载游戏阶段
const PHASE_PLAY = 3;     //游戏运行阶段
const PHASE_PAUSE = 4;    //暂停阶段
const PHASE_GAMEOVER = 5; //游戏结束阶段
var curPhase = 0;   //当前所处的阶段


/**begin: 游戏的第一个阶段——就绪阶段**/
var bgImg = new Image();
bgImg.src = "img/background.png";
var logo = new Image();
logo.src = "img/start.png";

var sky = null;
bgImg.onload = function(){
  curPhase = PHASE_READY;  //图片加载完成，进入就绪阶段
  sky = new Sky(this);
}
function Sky(bgImg){  //包含两张背景图片的天空
  this.x1 = 0;  //第一张背景图的X
  this.y1 = 0;  //第一张背景图的Y
  this.x2 = 0;  //第二张背景图的X
  this.y2 = -bgImg.height;  //第二张背景图的Y
  
  this.draw = function(){ //绘制天空对象一次
    ctx.drawImage(bgImg, this.x1, this.y1);//画第一张背景图
    ctx.drawImage(bgImg, this.x2, this.y2);//画第二张背景图
  }
  this.move = function(){  //天空对象移动一次
    this.y1++;  //this.y1+=3;
    this.y2++;  //this.y2+=3;
    if(this.y1 >= HEIGHT){ //若移动到画布底部，则绘制到顶部
      this.y1 = this.y2 - bgImg.height;
    }
    if(this.y2 >= HEIGHT){ //若移动到画布底部，则绘制到顶部
      this.y2 = this.y1 - bgImg.height;
    }
  }
}
/**end: 游戏的第一个阶段——就绪阶段**/


/**begin: 游戏的第二个阶段——加载阶段**/
var loadingImgs = [];
loadingImgs[0] = new Image();
loadingImgs[0].src = 'img/game_loading1.png';
loadingImgs[1] = new Image();
loadingImgs[1].src = 'img/game_loading2.png';
loadingImgs[2] = new Image();
loadingImgs[2].src = 'img/game_loading3.png';
loadingImgs[3] = new Image();
loadingImgs[3].src = 'img/game_loading4.png';
function Loading(imgs){
  this.index = 0; //当前需要绘制的图片的下标
  this.moveCount = 0; //move函数被调用的次数
  this.draw = function(){ //绘制一次
    ctx.drawImage(imgs[this.index], 0, HEIGHT-imgs[this.index].height);
  }
  this.move = function(){ //移动一次
    this.moveCount++;
    if(this.moveCount%3==0){
      this.index++;
      if(this.index>=imgs.length){
        curPhase = PHASE_PLAY; //所有的图片播放完成，进入游戏状态
      }
    }
  }
}
var loading = new Loading(loadingImgs);
canvas.onclick = function(){ //画布被单击，则进入loading状态
  if(curPhase === PHASE_READY){
    curPhase = PHASE_LOADING;  //1->2
  }
}
/**end: 游戏的第二个阶段——加载阶段**/


/**begin: 游戏的第二个阶段——游戏运行阶段**/
var heroImgs = [];
heroImgs[0] = new Image();
heroImgs[0].src = 'img/hero1.png';
heroImgs[1] = new Image();
heroImgs[1].src = 'img/hero2.png';
function Hero(imgs){
  this.index = 0; //待绘制的图片的下标
  this.x = (WIDTH-99)/2;  //为大家所不齿
  this.y = HEIGHT-124;    //为大家所不齿

  this.draw = function(){
    ctx.drawImage(imgs[this.index],this.x,this.y);
  }
  this.move = function(){
    this.index++;
    if(this.index>=imgs.length){
      this.index = 0;
    }
  }
}
var hero = new Hero(heroImgs);
canvas.onmousemove = function(event){
  if(curPhase === PHASE_PLAY){
    var x = event.offsetX; //以画布的左上角为参考点
    var y = event.offsetY;
    hero.x = x-heroImgs[hero.index].width/2;
    hero.y = y-heroImgs[hero.index].height/2;
  }
}
/**end: 游戏的第二个阶段——游戏运行阶段**/



/**游戏的主定时器**/
var timer = setInterval(function(){
  sky.draw();  //绘制背景图，同时清空画布上的当前所有内容
  sky.move();
  switch(curPhase){
    case PHASE_READY:
      ctx.drawImage(logo, (WIDTH-logo.width)/2, (HEIGHT-logo.height)/2);
      break;
    case PHASE_LOADING:
      loading.draw();
      loading.move();
      break;
    case PHASE_PLAY:
      hero.draw();
      hero.move();
      break;
    case PHASE_PAUSE:
      break;
    case PHASE_GAMEOVER:
      break;
  }
}, 62);  //每秒钟大约16帧