const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const grid = 20;
let count = 0;
let snake = [{ x: 160, y: 160 }];
let food = { x: 320, y: 320 };
let dx = 0;
let dy = 0;
let score = 0;
let gameStarted = false;
let gamePaused = false;
let directionChangedThisFrame = false;
const speed = 100; // 目标更新频率，ms
const frameRate = 10; // 每秒更新帧数
let lastUpdate = 0;

document.addEventListener('keydown', handleStartOrChangeDirection);
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);
document.getElementById('pauseButton').addEventListener('click', togglePause);

function gameLoop(timestamp) {
    if (gamePaused) {
        requestAnimationFrame(gameLoop);
        return;
    }

    const deltaTime = timestamp - lastUpdate;
    if (deltaTime > speed) {
        lastUpdate = timestamp;
        clearCanvas();

        // 无论游戏是否开始，都渲染蛇和食物
        drawFood();
        drawSnake();

        // 游戏开始后才移动蛇和检查碰撞
        if (gameStarted) {
            moveSnake();
            checkCollision();
        }

        updateScore();
        directionChangedThisFrame = false;
    }
    requestAnimationFrame(gameLoop);
}

function clearCanvas() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; // 画布背景色
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
    } else {
        snake.pop();
    }
    console.debug('Snake Position:', snake);
}

function handleStartOrChangeDirection(event) {
    if (!gameStarted) {
        gameStarted = true;
    }
    if (gamePaused || directionChangedThisFrame) return;

    const keyPressed = event.code;
    let newDx = dx;
    let newDy = dy;

    if (keyPressed === 'ArrowUp' && dy === 0) {
        newDx = 0;
        newDy = -grid;
    } else if (keyPressed === 'ArrowDown' && dy === 0) {
        newDx = 0;
        newDy = grid;
    } else if (keyPressed === 'ArrowLeft' && dx === 0) {
        newDx = -grid;
        newDy = 0;
    } else if (keyPressed === 'ArrowRight' && dx === 0) {
        newDx = grid;
        newDy = 0;
    }

    if (newDx !== 0 || newDy !== 0) {
        console.debug('Direction Change Request:', { newDx, newDy });
        // 确保新方向不与当前方向完全相反
        if (dx !== -newDx || dy !== -newDy) {
            dx = newDx;
            dy = newDy;
            directionChangedThisFrame = true; // 本帧内已经处理了一次方向改变
        }
    }
}

function handleTouchStart(event) {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    console.debug('Touch Start:', { touchStartX, touchStartY });
}

function handleTouchEnd(event) {
    const touch = event.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const dxTouch = touchEndX - touchStartX;
    const dyTouch = touchEndY - touchStartY;

    if (!gameStarted) {
        gameStarted = true;
    }
    if (gamePaused || directionChangedThisFrame) return;

    let newDx = dx;
    let newDy = dy;

    if (Math.abs(dxTouch) > Math.abs(dyTouch)) {
        if (dxTouch > 0 && dx === 0) {
            newDx = grid;
            newDy = 0;
        } else if (dxTouch < 0 && dx === 0) {
            newDx = -grid;
            newDy = 0;
        }
    } else {
        if (dyTouch > 0 && dy === 0) {
            newDx = 0;
            newDy = grid;
        } else if (dyTouch < 0 && dy === 0) {
            newDx = 0;
            newDy = -grid;
        }
    }

    console.debug('Touch End:', { touchEndX, touchEndY, dxTouch, dyTouch });
    if (newDx !== 0 || newDy !== 0) {
        // 确保新方向不与当前方向完全相反
        if (dx !== -newDx || dy !== -newDy) {
            dx = newDx;
            dy = newDy;
            directionChangedThisFrame = true; // 本帧内已经处理了一次方向改变
        }
    }
}

function drawSnake() {
    ctx.fillStyle = '#fff'; // 白色蛇
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, grid, grid);
    });
}

function drawFood() {
    ctx.fillStyle = '#00A3FF'; // 蓝色食物
    ctx.fillRect(food.x, food.y, grid, grid);
}

function placeFood() {
    let newFoodPosition;
    do {
        newFoodPosition = {
            x: Math.floor(Math.random() * canvas.width / grid) * grid,
            y: Math.floor(Math.random() * canvas.height / grid) * grid
        };
    } while (snake.some(part => part.x === newFoodPosition.x && part.y === newFoodPosition.y));
    food = newFoodPosition;
    console.debug('Food Position:', food);
}

function checkCollision() {
    if (snake[0].x < 0 || snake[0].x >= canvas.width ||
        snake[0].y < 0 || snake[0].y >= canvas.height ||
        snake.slice(1).some(part => part.x === snake[0].x && part.y === snake[0].y)) {
        console.debug('Collision Detected');
        resetGame();
    }
}

function resetGame() {
    snake = [{ x: 160, y: 160 }];
    dx = 0;
    dy = 0;
    score = 0;
    gameStarted = false;
    gamePaused = false;
    directionChangedThisFrame = false;
    placeFood();
}

function updateScore() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.textContent = 'Score: ' + score;
}

function togglePause() {
    gamePaused = !gamePaused;
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.textContent = gamePaused ? 'Resume' : 'Pause';
}

requestAnimationFrame(gameLoop); // 启动游戏循环
