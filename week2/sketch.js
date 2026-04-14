let topPoints = [];
let bottomPoints = [];
let gameState = "START"; // START, PLAYING, SUCCESS, FAIL
let numPoints = 10;
let level = 1; // 新增等級追蹤

function setup() {
  createCanvas(windowWidth, windowHeight);
  generatePath();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generatePath();
}

function draw() {
  background(220);

  if (gameState === "START") {
    drawPath();
    fill(0, 200, 0);
    rect(0, topPoints[0].y, 50, bottomPoints[0].y - topPoints[0].y);
    fill(0);
    textAlign(CENTER);
    textSize(24);
    text("第 " + level + " 關", width / 2, height / 2 - 40);
    text("點擊左側綠色區塊開始", width / 2, height / 2 + 10);
    
    if (mouseIsPressed && mouseX < 50 && mouseY > topPoints[0].y && mouseY < bottomPoints[0].y) {
      gameState = "PLAYING";
    }
  } 
  else if (gameState === "PLAYING") {
    drawPath();
    checkCollision();
    
    // 繪製玩家位置（滑鼠）
    fill(255, 0, 0);
    ellipse(mouseX, mouseY, 5, 5);

    // 檢查是否到達右邊終點
    if (mouseX >= width - 10) {
      gameState = "SUCCESS";
    }
  } 
  else if (gameState === "SUCCESS") {
    fill(0, 150, 0);
    textSize(32);
    textAlign(CENTER);
    text("恭喜成功！", width / 2, height / 2);
    textSize(16);
    text("點擊畫面重新開始", width / 2, height / 2 + 40);
  } 
  else if (gameState === "FAIL") {
    fill(200, 0, 0);
    textSize(32);
    textAlign(CENTER);
    text("遊戲失敗！", width / 2, height / 2);
    textSize(16);
    text("點擊畫面重新開始", width / 2, height / 2 + 40);
  }
}

function generatePath() {
  topPoints = [];
  bottomPoints = [];
  let spacing = width / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    let x = i * spacing;
    // 根據視窗高度隨機產生位置
    let yTop = random(height * 0.2, height * 0.7);
    
    // 通道寬度設定在 20 到 45 之間
    let gap = random(40, 85);
    
    topPoints.push(createVector(x, yTop));
    bottomPoints.push(createVector(x, yTop + gap));
  }
}

function drawPath() {
  noFill();
  stroke(0);
  strokeWeight(2);

  // 繪製上邊界
  beginShape();
  curveVertex(topPoints[0].x, topPoints[0].y); // 第一個控制點
  for (let p of topPoints) {
    curveVertex(p.x, p.y);
  }
  curveVertex(topPoints[numPoints - 1].x, topPoints[numPoints - 1].y); // 最後一個控制點
  endShape();

  // 繪製下邊界
  beginShape();
  curveVertex(bottomPoints[0].x, bottomPoints[0].y); // 第一個控制點
  for (let p of bottomPoints) {
    curveVertex(p.x, p.y);
  }
  curveVertex(bottomPoints[numPoints - 1].x, bottomPoints[numPoints - 1].y); // 最後一個控制點
  endShape();
  
  // 繪製終點線
  stroke(0, 0, 255);
  line(width - 1, topPoints[numPoints-1].y, width - 1, bottomPoints[numPoints-1].y);
}

function checkCollision() {
  // 檢查是否移出畫布
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    gameState = "FAIL";
  }

  // 尋找當前 mouseX 所在的路徑區段
  let i = floor(mouseX / (width / (numPoints - 1)));
  if (i >= 0 && i < numPoints - 1) {
    let spacing = width / (numPoints - 1);
    let pct = (mouseX % spacing) / spacing;

    // 計算曲線上的精確 Y 座標 (Catmull-Rom 插值)
    let p0 = i === 0 ? i : i - 1;
    let p1 = i;
    let p2 = i + 1;
    let p3 = i + 2 >= numPoints ? i + 1 : i + 2;

    let currentTopY = curvePoint(topPoints[p0].y, topPoints[p1].y, topPoints[p2].y, topPoints[p3].y, pct);
    let currentBottomY = curvePoint(bottomPoints[p0].y, bottomPoints[p1].y, bottomPoints[p2].y, bottomPoints[p3].y, pct);

    if (mouseY <= currentTopY || mouseY >= currentBottomY) {
      gameState = "FAIL";
    }
  }
}

function mousePressed() {
  if (gameState === "SUCCESS") {
    level++; // 成功則進入下一關
    generatePath();
    gameState = "START";
  } else if (gameState === "FAIL") {
    level = 1; // 失敗則重置等級
    generatePath();
    gameState = "START";
  }
}
