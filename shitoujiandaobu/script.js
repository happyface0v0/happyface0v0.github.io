// 游戏设置
const boardWidth = 4; // 棋盘宽度
const boardHeight = 3; // 棋盘高度

const areas = [
  ['home', 'home', 'home', 'home'], // 第一行是家
  ['ocean', 'beach', 'plain', 'river'], // 第二行
  ['', 'greenhouse', 'warehouse', ''], // 第三行
];

let playerCount = 0;
let players = [];
let selectedPlayer = null; // 当前选中的玩家

// 初始化游戏
function startGame(count) {
    playerCount = count;
    players = []; // 清空玩家

    // 生成玩家
    for (let i = 0; i < playerCount; i++) {
        players.push({
            name: '玩家' + (i + 1),
            house: i, // 玩家对应的家
            x: i, // 初始位置
            y: 0, // 家的位置是在最上面一行
            position: ['top-left', 'top-right', 'bottom-left', 'bottom-right'][i],
            selected: false
        });
    }

    document.getElementById('player-selection').style.display = 'none'; // 隐藏选择界面
    document.getElementById('game-board').style.display = 'block'; // 显示游戏地图

    renderBoard();
}

// 渲染棋盘
function renderBoard() {
    const boardContainer = document.getElementById('board');
    boardContainer.innerHTML = ''; // 清空棋盘容器

    // 遍历所有的格子
    for (let x = 0; x < boardWidth; x++) {
        const row = document.createElement('div');
        row.classList.add('row');

        for (let y = 0; y < boardHeight; y++) {
            const cell = document.createElement('div');
            const cellType = areas[y][x]; // 获取当前格子的地形类型

            if (cellType === '') {
                // 如果是空格子，跳过，不渲染这个格子
                continue;
            }

            // 渲染“家”格子的文字
            if (cellType === 'home') {
                cell.textContent = '家'; // 格子里显示“家”
            }

            cell.classList.add('cell', cellType); // 直接给格子加上地形类型的类名

            // 渲染玩家
            players.forEach(player => {
                if (player.x === x && player.y === y) {
                    const playerIcon = document.createElement('div');
                    playerIcon.classList.add('player');
                    playerIcon.textContent = player.name;

                    // 设置玩家图标的定位
                    playerIcon.style.position = 'absolute';

                    switch (player.position) {
                        case 'top-left':
                            playerIcon.style.top = '5px';
                            playerIcon.style.left = '5px';
                            break;
                        case 'top-right':
                            playerIcon.style.top = '5px';
                            playerIcon.style.right = '5px';
                            break;
                        case 'bottom-left':
                            playerIcon.style.bottom = '5px';
                            playerIcon.style.left = '5px';
                            break;
                        case 'bottom-right':
                            playerIcon.style.bottom = '5px';
                            playerIcon.style.right = '5px';
                            break;
                    }

                    // 如果是选中的玩家，给他们加上特殊的标记（例如改变背景色）
                    if (player.selected) {
                        playerIcon.classList.add('selected'); // 加上选中样式
                    }

                    playerIcon.addEventListener('click', () => {
                        selectPlayer(player); // 选中玩家
                    });

                    cell.appendChild(playerIcon);
                }
            });

            row.appendChild(cell);
        }

        boardContainer.appendChild(row);
    }
}



// 选中玩家函数
function selectPlayer(playerIndex) {
    // 取消上一个玩家的选中状态
    if (selectedPlayer) {
        selectedPlayer.selected = false;
    }

    // 选中新的玩家
    selectedPlayer = players[playerIndex];
    selectedPlayer.selected = true;
    renderBoard(); // 重新渲染棋盘
}

// 监听键盘事件，选择玩家和移动选中的玩家
document.addEventListener('keydown', (event) => {
    if (event.key >= '1' && event.key <= '9' && event.key <= playerCount.toString()) {
        const playerIndex = parseInt(event.key) - 1; // 选择玩家
        selectPlayer(playerIndex);
    }

    // 如果没有选中玩家，什么都不做
    if (!selectedPlayer) return;

    // 控制选中玩家的移动
    let newX = selectedPlayer.x;
    let newY = selectedPlayer.y;

    switch (event.key) {
        case 'ArrowUp': // 上箭头
            if (newY > 0) {
                newY--; // 上箭头减少 y 坐标
            }
            break;
        case 'ArrowDown': // 下箭头
            if (newY < boardHeight - 1) {
                newY++; // 下箭头增加 y 坐标
            }
            break;
        case 'ArrowLeft': // 左箭头
            if (newX > 0) {
                newX--; // 左箭头减少 x 坐标
            }
            break;
        case 'ArrowRight': // 右箭头
            if (newX < boardWidth - 1) {
                newX++; // 右箭头增加 x 坐标
            }
            break;
        default:
            break;
    }

    // 确保玩家不会移动到空格子（即空字符串格子）
    if (areas[newY][newX] !== '') {
        selectedPlayer.x = newX;
        selectedPlayer.y = newY;
    }

    renderBoard(); // 重新渲染棋盘
});

// 初始化
renderBoard();
