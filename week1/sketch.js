let weeds = [];
let bubbles = [];
let iframe;
let popSound;

function preload() {
  popSound = loadSound('pop.mp3');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  // 將畫布設為絕對定位，並置於頂層
  canvas.position(0, 0);
  canvas.style('z-index', '1');
  // 讓滑鼠事件可以穿透畫布，與後方的 iframe 互動
  canvas.style('pointer-events', 'none');

  // 產生 iframe 並設定其樣式，使其充滿整個視窗並置於底層
  iframe = createElement('iframe');
  iframe.attribute('src', 'https://www.et.tku.edu.tw');
  iframe.position(0, 0);
  iframe.size(windowWidth, windowHeight);
  iframe.style('border', 'none');
  iframe.style('z-index', '-1');
  
  let colors = ['#ff99c8', '#fcf6bd', '#d0f4de', '#a9def9', '#e4c1f9'];
  
  for (let i = 0; i < 80; i++) {
    weeds.push(new Weed(colors));
  }
}

function draw() {
  clear();
  background(173, 232, 244, 255 * 0.3); // 設定帶有 0.3 透明度的背景顏色
  blendMode(BLEND);
  noStroke();

  for (let weed of weeds) {
    weed.display();
  }

  // 隨機產生氣泡
  if (random() < 0.05) { // 調整機率來控制氣泡數量
    bubbles.push(new Bubble());
  }

  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].display();
    if (bubbles[i].isDead()) {
      bubbles.splice(i, 1);
    }
  }
}

class Weed {
  constructor(colors) {
    this.x = random(width);                       // 位置
    this.h = random(height * 0.2, height * 0.45); // 高度
    this.w = random(40, 50);                      // 粗細
    this.c = random(colors);                      // 顏色
    this.speed = random(0.001, 0.005);            // 搖晃頻率
    this.offset = random(1000);                   // 雜訊偏移
  }

  display() {
    let col = color(this.c);
    col.setAlpha(150); // 設定透明度 (0-255)
    fill(col);
    
    let steps = 20;
    beginShape();
    for (let i = 0; i <= steps * 2; i++) {
      let p = i <= steps ? i / steps : (2 * steps - i) / steps;
      
      let y = height - p * this.h;
      // 使用每條水草獨立的 speed (頻率) 與 offset
      let xOffset = map(noise(p * 2 + this.offset, frameCount * this.speed), 0, 1, -this.h * 0.3, this.h * 0.3) * p;
      
      let r = map(p, 0, 1, this.w / 2, 0);
      curveVertex(this.x + xOffset + (i <= steps ? -r : r), y);
    }
    endShape(CLOSE);
  }
}

class Bubble {
  constructor() {
    this.x = random(width);
    this.y = height + 20; // 從視窗底部下方開始
    this.size = random(10, 25);
    this.speed = random(2, 5);
    this.popY = random(height * 0.2, height * 0.7); // 設定隨機的破裂高度
    this.popping = false;
    this.popTimer = 0; // 用來計算破掉後的動畫時間
  }

  display() {
    if (this.popping) {
      // 破掉的效果：產生一個變大並消失的圓框
      this.popTimer++;
      noFill();
      stroke(255, map(this.popTimer, 0, 10, 255, 0));
      strokeWeight(2);
      ellipse(this.x, this.y, this.size + this.popTimer * 3);
    } else {
      // 上升邏輯
      this.y -= this.speed;
      this.x += sin(frameCount * 0.05 + this.y * 0.01) * 0.5; // 輕微左右搖晃
      if (this.y < this.popY) {
        this.popping = true;
        popSound.play();
      }

      noStroke();
      fill(255, 127); // 白色，透明度 0.5 (約127)
      ellipse(this.x, this.y, this.size);

      fill(255, 204); // 高光：白色，透明度 0.8 (約204)
      ellipse(this.x - this.size * 0.25, this.y - this.size * 0.25, this.size * 0.25);
    }
  }

  isDead() {
    return this.popping && this.popTimer > 10;
  }
}
