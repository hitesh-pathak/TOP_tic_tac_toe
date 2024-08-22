const calc = (function () {
    function arrSum(arr) {
        return arr.reduce((acc, curr) => acc+curr, 0);
    }

    return {arrSum};
})();

const logger = (function() {
    const textLevels = new Map ([
        [-1, "debug"],
        [0, "info"],
        [1, "warn"],
        [2, "error"],
        [3, "fatal"],
    ]);

    function log(message, level=0) {
        console.log(`[${textLevels.get(level) || ''}] ${message}`);
    }

    return {log};
})();

function GameBoard() {
    
    function createNewBoard() {
        const board = [];
        for (let i=0; i<3; i++) {
            const row = [];
            for (let j=0; j<3; j++) {
                row.push(NaN);
            }
            board.push(row);
        }
        return board;
    }

    const gameBoard = createNewBoard();
    const winners = new Set();
    const pieces = new Set([0, 1]);
    const winningSums = new Set([0, 3]);

    function getBoard() {
        return gameBoard;
    }

    function updateBoardSingle(i, j, val) {
        gameBoard[i][j] = val;
        return gameBoard;
    }

    function updateWinners() {
        // row check
        for (let row of gameBoard) {
            if (winningSums.has(calc.arrSum(row))) {
                winners.add(row[0]);
            }
        }

        // col check
        for (let j=0; j<gameBoard[0].length; j++) {
            const col = gameBoard.map((row) => row[j]);
            if (winningSums.has(calc.arrSum(col))) {
                winners.add(col[0]);
            }
        }

        // diag check
        const lastIdx = gameBoard.length-1;
        const diag0 =  gameBoard.map((row, i) => row[i]);
        const diag1 = gameBoard.map((row, i) => row[lastIdx-i]);
        [diag0, diag1].forEach(diag => {
            if (winningSums.has(calc.arrSum(diag))) {
                winners.add(diag[0]);
            }
        });
    }

    function isFull() {
        return gameBoard.every((row) => row.every((val) => !isNaN(val)));
    }

    function getWinners() {
        return winners;
    }

    function getPieces() {
        return pieces;
    }


    return {getBoard, updateBoardSingle, getWinners, getPieces, updateWinners, isFull};
}

function Player(name, marker, val) {

    let active = false;

    function setActive(val) {
        active = Boolean(val);
    }
    function getActive() {
        return active;
    }

    return {name, marker, val, getActive, setActive};
}

const gameplay = (function GamePlay() {

    let currPlayer;
    let result = 0

    const boardFn = GameBoard();
    const board = boardFn.getBoard();
    const pieces = boardFn.getPieces().values();
    const p1 = Player('p1', 'O', pieces.next().value);
    const p2 = Player('p2', 'X', pieces.next().value);
    const players = [p1, p2];

    currPlayer = p1;

    console.log(board);
    logger.log(`${currPlayer.name}, it's your turn...`)


    function updateResult() {
        const winners = boardFn.getWinners();
        result = winners.has(p1.val) ? (winners.has(p2.val) ? 3 : 1) : (winners.has(p2.val) ? 2 : (boardFn.isFull() ? 3 : 0));
    }

    function announceGameOver() {
        const messages = new Map([
            [1, `${p1.name} won!`],
            [2, `${p2.name} won!`],
            [3, `it's a tie!`],
        ]);
        if (result !== 0) {
            logger.log(messages.get(result));
        }
    }

    function play(i, j) {
        if (!players.includes(currPlayer)) {
            logger.log("current player is invalid");
        }
        if (result !== 0) {
            logger.log('game has ended')
            announceGameOver();
        }

        // console.log(Array.isArray(board[0]),  board[0][0]===NaN)
        if (Array.isArray(board[i]) && isNaN(board[i][j])) {
            boardFn.updateBoardSingle(i, j, currPlayer.val);
            console.log(board)
        } else {
            logger.log("invalid spot to play", 1);
        }
        currPlayer = currPlayer === p1 ? p2 : p1;
        boardFn.updateWinners();
        updateResult();
        announceGameOver();

        if (result === 0) {
            logger.log(`${currPlayer.name}, it's your turn...`)
        }
    }

    return {play}
})();



