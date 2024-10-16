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

// ��ʼ����Ϸ
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

  // ��鴫����
  portals.forEach(portal => {
    if (head.x === portal.x && head.y === portal.y) {
      generatePortals();
      head.x = portals[1].x;
      head.y = portals[1].y;
    }
  });

  snake.unshift(head);

  // ����Ƿ�Ե�ʳ��
  if (head.x === food.x && head.y === food.y) {
    generateFood();
  } else {
    snake.pop();
  }

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

// ���ɴ�����
function generatePortals() {
  portals = [
    { x: Math.floor(Math.random() * canvasSize / boxSize) * boxSize, y: Math.floor(Math.random() * canvasSize / boxSize) * boxSize },
    { x: Math.floor(Math.random() * canvasSize / boxSize) * boxSize, y: Math.floor(Math.random() * canvasSize / boxSize) * boxSize }
  ];
}

// ���ƴ�����
function drawPortals() {
  ctx.fillStyle = "blue";
  portals.forEach(portal => {
    ctx.fillRect(portal.x, portal.y, boxSize, boxSize);
  });
}

// ����ߵ�ͷ�Ƿ���ǽ�ڡ��Լ��������ߵ�ͷ��ײ
function checkCollisionWithWallsOrSnake(snakeArray, direction, otherSnake) {
  const head = { ...snakeArray[0] };

  // �ƶ���ͷ����һ��λ��
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

  // ������Ƿ�ײ���Լ�
  for (let i = 1; i < snakeArray.length; i++) {
    if (head.x === snakeArray[i].x && head.y === snakeArray[i].y) {
      return true;
    }
  }

  // ���ж��ߵ�ͷ��
  if (otherSnake[0].x === head.x && otherSnake[0].y === head.y) {
    return true;
  }

  // ȷ����ͷ��Խ��ǽ�ڣ�x��y��������0��canvasSize - boxSize�ķ�Χ�ڣ�
  if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
    return true;
  }

  return false;
}



// ���µж��ߵ�AI���������������ײ
function moveEnemySnake() {
  const head = { ...enemySnake[0] };

  const dx = food.x - head.x;
  const dy = food.y - head.y;

  // ���п��ܵķ���
  const availableDirections = ["UP", "DOWN", "LEFT", "RIGHT"];

  // ɸѡ����ȫ�ķ��򣨲���ײǽ��ײ�Լ���ײ������ߣ�
  const safeDirections = availableDirections.filter(dir => 
    !checkCollisionWithWallsOrSnake(enemySnake, dir, snake)
  );

  if (safeDirections.length > 0) {
    let chosenDirection = null;

    // ����ѡ����ʳ��ķ���
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

    // ���û��ѡ�񵽺���ķ��������ѡ��һ����ȫ�ķ���
    if (!chosenDirection) {
      enemyDirection = safeDirections[Math.floor(Math.random() * safeDirections.length)];
    } else {
      enemyDirection = chosenDirection;
    }
  } else {
    enemyDirection = availableDirections[Math.floor(Math.random() * availableDirections.length)];
  }

  // ��������ѡ��ķ����ƶ�������
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
    drawSnake(snake, "green");
    drawSnake(enemySnake, "orange");
    drawFood();
    drawPortals();
    moveSnake();
    moveEnemySnake();

    // ���������ߵ���ײ
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
