const boxes = document.querySelectorAll('.box');
const resetBtn = document.querySelector('#reset');
const msg = document.querySelector('#msg');

let currentPlayer = 'X';
let board = Array(9).fill('');

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

boxes.forEach((box, index) => {
    box.addEventListener('click', () => handleClick(index));
});

function handleClick(index) {
    if (board[index] !== '') return;

    board[index] = currentPlayer;
    boxes[index].textContent = currentPlayer;

    if (checkWin()) {
        msg.textContent = `🎉 Player ${currentPlayer} Wins!`;
        disableBoxes();
        setTimeout(resetGame, 2000);
        return;
    }

    if (board.every(cell => cell !== '')) {
        msg.textContent = "🤝 It's a Draw!";
        setTimeout(resetGame, 2000);
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWin() {
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

function disableBoxes() {
    boxes.forEach(box => box.disabled = true);
}

resetBtn.addEventListener('click', resetGame);

function resetGame() {
    board.fill('');
    boxes.forEach(box => {
        box.textContent = '';
        box.disabled = false;
    });
    currentPlayer = 'X';
    msg.textContent = '';
}
