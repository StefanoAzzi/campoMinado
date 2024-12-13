let boardSize = 10;
let totalMines = 10;
let board = [];
let gameOver = false;
let gameWon = false;

// Função para gerar o tabuleiro
function generateBoard() {
    board = [];
    for (let y = 0; y < boardSize; y++) {
        let row = [];
        for (let x = 0; x < boardSize; x++) {
            row.push({
                revealed: false,
                flagged: false,
                mine: false,
                surroundingMines: 0
            });
        }
        board.push(row);
    }

    placeMines();
    calculateSurroundingMines();
}

// Função para colocar as minas aleatoriamente
function placeMines() {
    let placedMines = 0;
    while (placedMines < totalMines) {
        let x = Math.floor(Math.random() * boardSize);
        let y = Math.floor(Math.random() * boardSize);
        if (!board[y][x].mine) {
            board[y][x].mine = true;
            placedMines++;
        }
    }
}

// Função para calcular o número de minas ao redor de cada célula
function calculateSurroundingMines() {
    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            if (board[y][x].mine) continue;

            let mineCount = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    let nx = x + dx;
                    let ny = y + dy;
                    if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize) {
                        if (board[ny][nx].mine) {
                            mineCount++;
                        }
                    }
                }
            }

            board[y][x].surroundingMines = mineCount;
        }
    }
}

// Função para revelar as células
function revealCell(x, y) {
    if (gameOver || board[y][x].revealed || board[y][x].flagged) return;

    const cell = document.getElementById(`cell-${y}-${x}`);

    if (board[y][x].mine) {
        cell.classList.add('revealed');
        cell.classList.add('empty');
        cell.textContent = "💣";
        gameOver = true;
        document.getElementById('game-status').textContent = "Game Over!";
        revealAllCells();
        return;
    }

    board[y][x].revealed = true;
    const surroundingMines = board[y][x].surroundingMines;

    if (surroundingMines === 0) {
        cell.classList.add('empty');
    } else {
        cell.textContent = surroundingMines;
    }

    cell.classList.add('revealed');

    if (surroundingMines === 0) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                let nx = x + dx;
                let ny = y + dy;
                if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize) {
                    revealCell(nx, ny);
                }
            }
        }
    }

    checkForWin();
}

// Função para marcar uma célula com bandeira
function flagCell(x, y) {
    if (gameOver || board[y][x].revealed) return;

    const cell = document.getElementById(`cell-${y}-${x}`);

    // Alterna o estado da célula com bandeira
    board[y][x].flagged = !board[y][x].flagged;

    // Se a célula foi marcada com bandeira, adicione a classe, caso contrário, remova
    if (board[y][x].flagged) {
        console.log('vtnc ste')
        cell.classList.add('flagged');
        cell.textContent = "🚩";  
    } else {
        console.log('teste, sai bandeira')
        cell.classList.remove('flagged');
        cell.textContent = "";  
    }
}

// Função para revelar todas as minas no final do jogo
function revealAllCells() {
    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            const cell = document.getElementById(`cell-${y}-${x}`);
            if (board[y][x].mine) {
                cell.classList.add('revealed');
                cell.textContent = "💣";
            } else if (board[y][x].revealed && board[y][x].surroundingMines > 0) {
                cell.textContent = board[y][x].surroundingMines;
            }
        }
    }
}

// Função para verificar se o jogador venceu
function checkForWin() {
    let revealedNonMineCells = 0;
    let totalNonMineCells = 0;

    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            if (!board[y][x].mine) {
                totalNonMineCells++;
                if (board[y][x].revealed) {
                    revealedNonMineCells++;
                }
            }
        }
    }

    if (revealedNonMineCells === totalNonMineCells) {
        gameWon = true;
        document.getElementById('game-status').textContent = "Você Venceu!";
        revealAllCells();
    }
}

// Função para criar o tabuleiro na interface
function renderBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;

    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `cell-${y}-${x}`;

            // Adiciona o evento de clique para revelar células
            cell.addEventListener('click', () => revealCell(x, y));

            // Adiciona o evento de clique com o botão direito para marcar a célula com bandeira
            cell.addEventListener('contextmenu', (event) => {
                event.preventDefault(); 
                flagCell(x, y);
            });

            gameBoard.appendChild(cell);
        }
    }
}

// Função para escolher a dificuldade ou inicializar o jogo com o tamanho escolhido pelo jogador
function initializeGame() {
    const difficulty = document.getElementById('difficulty').value;

    if (difficulty === "easy") {
        boardSize = 8;
        totalMines = 10;
    } else if (difficulty === "normal") {
        boardSize = 14;
        totalMines = 40;
    } else if (difficulty === "hard") {
        boardSize = 20;
        totalMines = 99;
    } else if (difficulty === "custom") {
        boardSize = parseInt(document.getElementById('board-size').value);
        totalMines = parseInt(document.getElementById('mine-count').value);
    }

    generateBoard();
    renderBoard();
    gameOver = false;
    gameWon = false;
    document.getElementById('game-status').textContent = '';
}

// Iniciar jogo quando o botão for clicado
document.getElementById('start-game').addEventListener('click', initializeGame);

// Exibir ou esconder configurações personalizadas ao escolher o modo "Personalizado"
document.getElementById('difficulty').addEventListener('change', (e) => {
    if (e.target.value === "custom") {
        document.getElementById('custom-settings').style.display = "block";
    } else {
        document.getElementById('custom-settings').style.display = "none";
    }
});
