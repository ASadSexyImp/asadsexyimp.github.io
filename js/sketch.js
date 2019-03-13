let spiders = [];
const spiderNum = 5;

// 素材の読み込み
function preload() {


}

// 全体の初期化
function setup() {
  // キャンバスを作る
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < spiderNum; i++){
    spiders[i] = createSpider();
  }
}

function createSpider(){
  let spider = createSprite(random(width), -100, 100, 100);
  spider.velocity.y = 0;
  spider.speed = random(0.3);
  spider.direction = "down";
  spider.bottom = random(height / 2, height);
  
  return spider;
}

// ゲームの進行と表示
function draw() {
  background(0);
  

  for (let i = 0; i < spiderNum; i++) {
    // マウスクリック時にパーティクルを出して消えて、新たなくもを生成する
    if (spiders[i].mouseIsOver == true) {
      spiders[i].remove();
      let spider = createSpider();
      spiders.add(spider);
    }
    console.log(spiders[i].mouseIsPressed);
    
    // 方向調整
    if (spiders[i].position.y > spiders[i].bottom && spiders[i].direction == "down") {
      spiders[i].direction = "up";
      spiders[i].velocity.y = 2;
    } else if (spiders[i].position.y < -100 && spiders[i].direction == "up") {
      spiders[i].direction = "down";
      spiders[i].velocity.y = -2;
      spiders[i].position.x = random(width);
    }

    // スピード調整
    if (spiders[i].direction == "down") {
      spiders[i].velocity.y += spiders[i].speed;
    } else if (spiders[i].direction == "up") {
      spiders[i].velocity.y -= spiders[i].speed;
    }
    
    // 蜘蛛糸
    stroke(255);
    line(spiders[i].position.x, -100, spiders[i].position.x, spiders[i].position.y);
    
  }
  
  
  drawSprites();
}