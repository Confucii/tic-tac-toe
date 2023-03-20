const playerFactory = (marker) => {
  const getMarker = () => marker;
  return { getMarker };
};

const gameBoard = (() => {
  const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const resetBoard = () => {
    board.forEach((row, i) => {
      row.forEach((_cell, j) => {
        board[i][j] = "";
      });
    });
  };

  const display = () => {
    const _boardTable = document.querySelectorAll("td");
    _boardTable.forEach((cell, index) => {
      const _cellRef = cell;
      _cellRef.textContent = board[Math.floor(index / 3)][index % 3];
    });
  };

  const fillCell = function fillCell(_playerMarker) {
    board[this.dataset.row][this.dataset.column] = _playerMarker;
    display();
  };

  const checkWin = function checkWin(cell) {
    let _overlapCount = 0;

    const _checkOverlap = () => {
      _overlapCount = _overlapCount === 2 ? true : 0;
    };

    const _checkHorizontal = () => {
      for (let i = 0; i < 2; i += 1) {
        if (board[cell.dataset.row][i] === board[cell.dataset.row][i + 1]) {
          _overlapCount += 1;
        }
      }
    };

    const _checkVertical = () => {
      for (let i = 0; i < 2; i += 1) {
        if (
          board[i][cell.dataset.column] === board[i + 1][cell.dataset.column]
        ) {
          _overlapCount += 1;
        }
      }
    };

    const _checkLeftToRightDiag = () => {
      for (let i = 0; i < 2; i += 1) {
        if (board[i][i] === board[i + 1][i + 1]) {
          _overlapCount += 1;
        }
      }
    };

    const _checkRightToLeftDiag = () => {
      for (let i = 0, j = 2; i < 2; i += 1, j -= 1) {
        if (board[i][j] === board[i + 1][j - 1]) {
          _overlapCount += 1;
        }
      }
    };

    _checkHorizontal();
    _checkOverlap();

    if (!_overlapCount) {
      _checkVertical();
      _checkOverlap();

      if (!_overlapCount) {
        if (cell.dataset.row === "1" && cell.dataset.column === "1") {
          _checkLeftToRightDiag();
          _checkOverlap();
          if (!_overlapCount) {
            _checkRightToLeftDiag();
            _checkOverlap();
          }
        } else if (cell.dataset.row === cell.dataset.column) {
          _checkLeftToRightDiag();
          _checkOverlap();
        } else {
          _checkRightToLeftDiag();
          _checkOverlap();
        }
      }
    }
    if (_overlapCount) {
      return true;
    }
    return false;
  };

  return {
    fillCell,
    checkWin,
    display,
    resetBoard,
  };
})();

const gameFlow = (() => {
  let _playerMarker = "";
  let _turn = 1;
  let _gameOver = false;

  const initPlayers = () => {
    const playerOne = playerFactory("X");
    const playerTwo = playerFactory("O");

    return {
      playerOne,
      playerTwo,
    };
  };

  const _players = initPlayers();

  const resetGame = () => {
    gameBoard.resetBoard();

    const gameState = document.querySelector(".main p");
    gameState.textContent = "The game is on!";
    _playerMarker = _players.playerOne.getMarker();
    _turn = 1;
    _gameOver = false;
    gameBoard.display();
  };

  const _changePlayer = () => {
    if (_playerMarker === _players.playerOne.getMarker()) {
      _playerMarker = _players.playerTwo.getMarker();
    } else {
      _playerMarker = _players.playerOne.getMarker();
    }
  };

  const _boardTable = document.querySelectorAll("td");

  _boardTable.forEach((cell) => {
    cell.addEventListener("click", () => {
      if (_turn < 10) {
        if (cell.textContent === "" && !_gameOver) {
          gameBoard.fillCell.call(cell, _playerMarker);
          _turn += 1;
          if (_turn > 5) {
            _gameOver = gameBoard.checkWin(cell);
            const gameState = document.querySelector(".main p");
            if (_gameOver) {
              gameState.textContent = `The winner is ${_playerMarker}!`;
            } else if (!_gameOver && _turn === 10) {
              gameState.textContent = "It is a tie!";
            }
          }
          _changePlayer();
        }
      }
    });
  });

  const _resetBtn = document.querySelector(".reset");

  _resetBtn.addEventListener("click", resetGame);

  return { resetGame };
})();

gameFlow.resetGame();
