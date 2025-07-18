const boxes = document.querySelectorAll('.box');
const msg = document.getElementById('msg');
const resetButton = document.getElementById('reset');
const modeSelect = document.getElementById('mode-select');

let currentPlayer = 'X';
let board = Array(9).fill(null);
let gameActive = true;
let mode = 'pvp';

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

modeSelect.addEventListener('change', (e) => {
    mode = e.target.value;
    resetGame();
});

boxes.forEach((box, index) => {
    box.addEventListener('click', () => handleBoxClick(index));
});

function handleBoxClick(index) {
    if (board[index] || !gameActive) return;

    makeMove(index, currentPlayer);

    if (checkWin(currentPlayer)) {
        endGame(`${currentPlayer} Wins!`);
        return;
    }
    if (board.every(val => val)) {
        endGame("It's a draw!");
        return;
    }

    if (mode === 'pvp') {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        msg.textContent = `Player ${currentPlayer}'s Turn`;
    } else if (mode.startsWith('pvc') && currentPlayer === 'X') {
        currentPlayer = 'O';
        msg.textContent = `Computer's Turn`;
        setTimeout(() => {
            if (mode === 'pvc-easy') easyComputerMove();
            else hardComputerMove();
        }, 500);
    }
}

function makeMove(index, player) {
    board[index] = player;
    boxes[index].textContent = player;
}

function easyComputerMove() {
    let emptyIndexes = board.map((v, i) => v === null ? i : null).filter(i => i !== null);
    let randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    makeMove(randomIndex, currentPlayer);
    finalizeComputerMove();
}

function hardComputerMove() {
    let bestMove = minimax(board, currentPlayer).index;
    makeMove(bestMove, currentPlayer);
    finalizeComputerMove();
}

function finalizeComputerMove() {
    if (checkWin(currentPlayer)) {
        endGame('Computer Wins!');
    } else if (board.every(val => val)) {
        endGame("It's a draw!");
    } else {
        currentPlayer = 'X';
        msg.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

function minimax(newBoard, player) {
    const emptyIndexes = newBoard.map((v, i) => v === null ? i : null).filter(i => i !== null);

    if (checkWinFor(newBoard, 'X')) return { score: -10 };
    if (checkWinFor(newBoard, 'O')) return { score: 10 };
    if (emptyIndexes.length === 0) return { score: 0 };

    const moves = [];

    emptyIndexes.forEach(index => {
        const move = { index };
        newBoard[index] = player;

        if (player === 'O') {
            move.score = minimax(newBoard, 'X').score;
        } else {
            move.score = minimax(newBoard, 'O').score;
        }

        newBoard[index] = null;
        moves.push(move);
    });

    return player === 'O'
        ? moves.reduce((best, move) => move.score > best.score ? move : best)
        : moves.reduce((best, move) => move.score < best.score ? move : best);
}

function checkWin(player) {
    return checkWinFor(board, player);
}

function checkWinFor(boardState, player) {
    return winningConditions.some(pattern => pattern.every(idx => boardState[idx] === player));
}

function endGame(message) {
    msg.textContent = message;
    gameActive = false;

    setTimeout(() => {
        resetGame();
    }, 2500);
}

resetButton.addEventListener('click', resetGame);

function resetGame() {
    board = Array(9).fill(null);
    boxes.forEach(box => box.textContent = '');
    currentPlayer = 'X';
    gameActive = true;
    msg.textContent = mode === 'pvp' ? `Player ${currentPlayer}'s Turn` : '';
}
