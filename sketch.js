let seeds = [];
let vinePoints = [];
const TOTAL_WEEKS = 2; // 修改為 2 週

function setup() {
  let canvas = createCanvas(windowWidth * 0.3, windowHeight);
  canvas.parent('canvas-container');

  // 1. 初始化藤蔓路徑 (Vertex & For)
  // 我們從底部向上生長
  for (let i = 0; i <= 100; i++) {
    let y = map(i, 0, 100, height + 50, -50);
    let xOffset = sin(i * 0.1) * 30; // 產生波浪感
    vinePoints.push({ x: width / 2 + xOffset, y: y });
  }

  // 2. 在路徑上放置「週次種子」 (Class)
  for (let i = 1; i <= TOTAL_WEEKS; i++) {
    // 依比例找到路徑上的座標
    let idx = Math.floor(map(i, 1, TOTAL_WEEKS, 40, 60));
    let pos = vinePoints[idx];
    
    // 模擬不同的作品 URL
    let weekUrl = `week${i}/index.html`; 
    // 測試用：也可以放外部連結，例如 `https://example.com`
    
    seeds.push(new Seed(pos.x, pos.y, i, weekUrl));
  }
}

function draw() {
  background(240, 242, 240);

  // 繪製土壤/底部感
  fill(100, 70, 50);
  noStroke();
  rect(0, height - 40, width, 40);

  // 繪製生長脈絡 (Vertex & For)
  noFill();
  stroke(46, 139, 87, 150); // 森林綠
  strokeWeight(4);
  beginShape();
  for (let p of vinePoints) {
    vertex(p.x, p.y);
  }
  endShape();

  // 繪製所有種子
  for (let s of seeds) {
    s.update();
    s.display();
  }
}

// 當滑鼠點擊時，檢查是否點到種子
function mousePressed() {
  for (let s of seeds) {
    if (s.isHovered()) {
      s.clicked();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth * 0.3, windowHeight);
}

// 週次節點類別 (Class)
class Seed {
  constructor(x, y, week, url) {
    this.x = x;
    this.y = y;
    this.week = week;
    this.url = url;
    this.baseSize = 40;
    this.currentSize = 40;
    this.angle = 0;
    this.color = color(144, 238, 144); // 淺綠色
    this.isBlooming = false;
  }

  update() {
    // 懸停動態效果：跳動或放大
    if (this.isHovered()) {
      this.currentSize = lerp(this.currentSize, this.baseSize * 1.5, 0.2);
      this.angle += 0.1;
    } else {
      this.currentSize = lerp(this.currentSize, this.baseSize, 0.1);
      this.angle = 0;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(sin(this.angle) * 0.2); // 輕微晃動

    // 繪製種子外觀
    noStroke();
    if (this.isHovered()) {
      fill(255, 100, 100); // 懸停變色 (開花預兆)
    } else {
      fill(this.color);
    }
    
    // 利用簡單幾何代表種子，學生可在此改用 vertex 畫花朵
    ellipse(0, 0, this.currentSize, this.currentSize * 1.2);
    
    // 標註週次
    fill(50);
    textAlign(CENTER, CENTER);
    textSize(12);
    text("W" + this.week, 0, 0);
    pop();
  }

  isHovered() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d < this.currentSize / 2;
  }

  clicked() {
    // Iframe 整合：切換右側頁面
    let iframe = document.getElementById('exhibit-frame');
    if (iframe) {
      iframe.src = this.url;
      console.log(`切換至第 ${this.week} 週作品: ${this.url}`);
    }
    this.isBlooming = true;
  }
}