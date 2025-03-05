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

// ��ʼ����Ϸ
function initGame() {
  snake = [{ x: 100, y: 100 }];
  direction = "RIGHT";
  nextDirection = "RIGHT";
  gameOverFlag = false;
  generateFood();
}

// ������
function drawSnake(snakeArray, color) {
  ctx.fillStyle = color;
  snakeArray.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
  });
}

// �ƶ���
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

  // ����Ƿ�Ե�ʳ��
  if (head.x === food.x && head.y === food.y) {
    generateFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);
  direction = nextDirection;
}

// ����ʳ��
function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, boxSize, boxSize);
}

// ����ʳ��
function generateFood() {
  food.x = Math.floor(Math.random() * canvasSize / boxSize) * boxSize;
  food.y = Math.floor(Math.random() * canvasSize / boxSize) * boxSize;
}

// ����ߵ�ͷ�Ƿ���ǽ�ڡ��Լ��������ߵ�ͷ��ײ
function checkCollisionWithWallsOrSnake(snakeArray, direction) {
  const head = { ...snakeArray[0] };

  // ������Ƿ�ײ���Լ�
  for (let i = 1; i < snakeArray.length; i++) {
    if (head.x === snakeArray[i].x && head.y === snakeArray[i].y) {
      return true;
    }
  }

  // ȷ����ͷ��Խ��ǽ�ڣ�x��y��������0��canvasSize - boxSize�ķ�Χ�ڣ�
  if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
    return true;
  }

  return false;
}

// ��Ϸ����
function gameOver(message) {
  document.getElementById("gameOverMessage").textContent = message;
  resetButton.style.display = "block";
  gameOverFlag = true;
  clearInterval(gameLoopInterval);
}

// ��Ϸѭ��
function gameLoop() {
  if (!gameOverFlag) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake(snake, "blue");
    drawFood();
    moveSnake();

    // ��ҵ���ײ
    if (checkCollisionWithWallsOrSnake(snake, direction)) {
      gameOver("You Lose!");
    }
  }
}

// �����������
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

// ������Ϸ
resetButton.addEventListener("click", () => {
  document.getElementById("gameOverMessage").textContent = "";
  resetButton.style.display = "none";
  initGame();
  clearInterval(gameLoopInterval);
  gameLoopInterval = setInterval(gameLoop, 100);
});

// ��ʼ������ʼ��Ϸѭ��
initGame();
gameLoopInterval = setInterval(gameLoop, 100);
