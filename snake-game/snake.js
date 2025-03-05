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
let gameOverFlag = false;
let gameLoopInterval;
const resetButton = document.getElementById("resetButton");

// 初始化游戏
function initGame() {
  snake = [{ x: 100, y: 100 }];
  direction = "RIGHT";
  nextDirection = "RIGHT";
  gameOverFlag = false;
  generateFood();
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

  // 检查是否吃到食物
  if (head.x === food.x && head.y === food.y) {
    generateFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);
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

// 检查蛇的头是否与墙壁、自己或其他蛇的头相撞
function checkCollisionWithWallsOrSnake(snakeArray, direction) {
  const head = { ...snakeArray[0] };

  // 检查蛇是否撞到自己
  for (let i = 1; i < snakeArray.length; i++) {
    if (head.x === snakeArray[i].x && head.y === snakeArray[i].y) {
      return true;
    }
  }

  // 确保蛇头不越过墙壁（x和y都必须在0到canvasSize - boxSize的范围内）
  if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
    return true;
  }

  return false;
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
    drawSnake(snake, "blue");
    drawFood();
    moveSnake();

    // 玩家的碰撞
    if (checkCollisionWithWallsOrSnake(snake, direction)) {
      gameOver("You Lose!");
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
