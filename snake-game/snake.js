const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const canvasSize = 400;
const boxSize = 20;
canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [{ x: 100, y: 100 }];
let direction = "RIGHT";
let nextDirection = "RIGHT";
let food = { x: 200, y: 200 };
let portals = [];
let enemySnake = [{ x: 300, y: 300 }];
let enemyDirection = "LEFT";
let gameOverFlag = false;
let gameLoopInterval;
const resetButton = document.getElementById("resetButton");

// 初始化游戏
function initGame() {
  snake = [{ x: 100, y: 100 }];
  direction = "RIGHT";
  nextDirection = "RIGHT";
  enemySnake = [{ x: 300, y: 300 }];
  enemyDirection = "LEFT";
  gameOverFlag = false;
  generateFood();
  generatePortals();
}

// 绘制蛇
function drawSnake(snakeArray, color) {
  ctx.fillStyle = color;
  snakeArray.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
  });
}

// 移动蛇
function moveSnake() {
  const head = { ...snake[0] };

  switch (nextDirection) {
    case "UP":
      head.y -= boxSize;
      break;
    case "DOWN":
      head.y += boxSize;
      break;
    case "LEFT":
      head.x -= boxSize;
      break;
    case "RIGHT":
      head.x += boxSize;
      break;
  }

  // 检查传送门
  portals.forEach(portal => {
    if (head.x === portal.x && head.y === portal.y) {
      generatePortals();
      head.x = portals[1].x;
      head.y = portals[1].y;
    }
  });

  snake.unshift(head);

  // 检查是否吃到食物
  if (head.x === food.x && head.y === food.y) {
    generateFood();
  } else {
    snake.pop();
  }

  direction = nextDirection;
}

// 绘制食物
function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, boxSize, boxSize);
}

// 生成食物
function generateFood() {
  food.x = Math.floor(Math.random() * canvasSize / boxSize) * boxSize;
  food.y = Math.floor(Math.random() * canvasSize / boxSize) * boxSize;
}

// 生成传送门
function generatePortals() {
  portals = [
    { x: Math.floor(Math.random() * canvasSize / boxSize) * boxSize, y: Math.floor(Math.random() * canvasSize / boxSize) * boxSize },
    { x: Math.floor(Math.random() * canvasSize / boxSize) * boxSize, y: Math.floor(Math.random() * canvasSize / boxSize) * boxSize }
  ];
}

// 绘制传送门
function drawPortals() {
  ctx.fillStyle = "blue";
  portals.forEach(portal => {
    ctx.fillRect(portal.x, portal.y, boxSize, boxSize);
  });
}

// 检查蛇的头是否与墙壁、自己或其他蛇的头相撞
function checkCollisionWithWallsOrSnake(snakeArray, direction, otherSnake) {
  const head = { ...snakeArray[0] };

  // 移动蛇头到下一个位置
  if (snakeArray == enemySnake){
      switch (direction) {
    case "UP":
      head.y -= boxSize;
      break;
    case "DOWN":
      head.y += boxSize;
      break;
    case "LEFT":
      head.x -= boxSize;
      break;
    case "RIGHT":
      head.x += boxSize;
      break;
     }
  }

  // 检查蛇是否撞到自己
  for (let i = 1; i < snakeArray.length; i++) {
    if (head.x === snakeArray[i].x && head.y === snakeArray[i].y) {
      return true;
    }
  }

  // 检查敌对蛇的头部
  if (otherSnake[0].x === head.x && otherSnake[0].y === head.y) {
    return true;
  }

  // 确保蛇头不越过墙壁（x和y都必须在0到canvasSize - boxSize的范围内）
  if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
    return true;
  }

  return false;
}



// 更新敌对蛇的AI，避免与玩家蛇相撞
function moveEnemySnake() {
  const head = { ...enemySnake[0] };

  const dx = food.x - head.x;
  const dy = food.y - head.y;

  // 所有可能的方向
  const availableDirections = ["UP", "DOWN", "LEFT", "RIGHT"];

  // 筛选出安全的方向（不会撞墙、撞自己或撞到玩家蛇）
  const safeDirections = availableDirections.filter(dir => 
    !checkCollisionWithWallsOrSnake(enemySnake, dir, snake)
  );

  if (safeDirections.length > 0) {
    let chosenDirection = null;

    // 优先选择朝向食物的方向
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && safeDirections.includes("RIGHT")) {
        chosenDirection = "RIGHT";
      } else if (dx < 0 && safeDirections.includes("LEFT")) {
        chosenDirection = "LEFT";
      } else if (dy > 0 && safeDirections.includes("DOWN")) {
        chosenDirection = "DOWN";
      } else if (dy < 0 && safeDirections.includes("UP")) {
        chosenDirection = "UP";
      }
    } else {
      if (dy > 0 && safeDirections.includes("DOWN")) {
        chosenDirection = "DOWN";
      } else if (dy < 0 && safeDirections.includes("UP")) {
        chosenDirection = "UP";
      } else if (dx > 0 && safeDirections.includes("RIGHT")) {
        chosenDirection = "RIGHT";
      } else if (dx < 0 && safeDirections.includes("LEFT")) {
        chosenDirection = "LEFT";
      }
    }

    // 如果没有选择到合理的方向，则随机选择一个安全的方向
    if (!chosenDirection) {
      enemyDirection = safeDirections[Math.floor(Math.random() * safeDirections.length)];
    } else {
      enemyDirection = chosenDirection;
    }
  } else {
    enemyDirection = availableDirections[Math.floor(Math.random() * availableDirections.length)];
  }

  // 根据最终选择的方向移动敌人蛇
  switch (enemyDirection) {
    case "UP":
      head.y -= boxSize;
      break;
    case "DOWN":
      head.y += boxSize;
      break;
    case "LEFT":
      head.x -= boxSize;
      break;
    case "RIGHT":
      head.x += boxSize;
      break;
  }

  enemySnake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    generateFood();
  } else {
    enemySnake.pop();
  }
}

// 游戏结束
function gameOver(message) {
  document.getElementById("gameOverMessage").textContent = message;
  resetButton.style.display = "block";
  gameOverFlag = true;
  clearInterval(gameLoopInterval);
}

// 游戏循环
function gameLoop() {
  if (!gameOverFlag) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake(snake, "green");
    drawSnake(enemySnake, "orange");
    drawFood();
    drawPortals();
    moveSnake();
    moveEnemySnake();

    // 玩家与敌人蛇的碰撞
    if (snake[0].x === enemySnake[0].x && snake[0].y === enemySnake[0].y) {
      gameOver("You Lose!");
    } else if (checkCollisionWithWallsOrSnake(snake, direction, enemySnake)) {
      gameOver("You Lose!");
    } else if (checkCollisionWithWallsOrSnake(enemySnake, enemyDirection, snake)) {
      gameOver("Enemy Snake Died");
      enemySnake = [];
    }
  }
}

// 处理键盘输入
document.addEventListener("keydown", event => {
  switch (event.keyCode) {
    case 37:
      if (direction !== "RIGHT") nextDirection = "LEFT";
      break;
    case 38:
      if (direction !== "DOWN") nextDirection = "UP";
      break;
    case 39:
      if (direction !== "LEFT") nextDirection = "RIGHT";
      break;
    case 40:
      if (direction !== "UP") nextDirection = "DOWN";
      break;
  }
});

// 重置游戏
resetButton.addEventListener("click", () => {
  document.getElementById("gameOverMessage").textContent = "";
  resetButton.style.display = "none";
  initGame();
  clearInterval(gameLoopInterval);
  gameLoopInterval = setInterval(gameLoop, 100);
});

// 初始化并开始游戏循环
initGame();
gameLoopInterval = setInterval(gameLoop, 100);
