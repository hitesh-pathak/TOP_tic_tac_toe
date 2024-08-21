const board = (function GameBoard() {
    
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
    const winner = [];

    function getBoard() {
        return gameBoard;
    }

    function updateBoardSingle(i, j, val) {
        gameBoard[i][j] = val;
        return gameBoard;
    }

    function checkStatus() {
        // row check
        gameBoard.forEach(row => {
            
        })
    
    }

    return {getBoard, updateBoardSingle}
})();



function Player(name, marker, value) {
    return {name, marker, value};
}