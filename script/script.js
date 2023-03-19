const playerFactory = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker };
};

const gameBoard = (() => {
  let _board = [[], [], []];

  const _display = () => {
    const _boardTable = document.querySelectorAll("td");
    _boardTable.forEach((cell, index) => {
      const _cellRef = cell;
      _cellRef.textContent = _board[Math.floor(index / 3)][index % 3];
    });
  };

  const reset = () => {
    _board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  };

  const fillCell = function fillCell(_playerMarker) {
    _board[this.dataset.row][this.dataset.column] = _playerMarker;
    _display();
  };

  const checkWin = function checkWin(cell) {
    let _overlapCount = 0;

    const _checkOverlap = () => {
      _overlapCount = _overlapCount === 2 ? true : 0;
    };

    const _checkHorizontal = () => {
      for (let i = 0; i < 2; i += 1) {
        if (_board[cell.dataset.row][i] === _board[cell.dataset.row][i + 1]) {
          _overlapCount += 1;
        }
      }
    };

    const _checkVertical = () => {
      for (let i = 0; i < 2; i += 1) {
        if (
          _board[i][cell.dataset.column] === _board[i + 1][cell.dataset.column]
        ) {
          _overlapCount += 1;
        }
      }
    };

    const _checkLeftToRightDiag = () => {
      for (let i = 0; i < 2; i += 1) {
        if (_board[i][i] === _board[i + 1][i + 1]) {
          _overlapCount += 1;
        }
      }
    };

    const _checkRightToLeftDiag = () => {
      for (let i = 0, j = 2; i < 2; i += 1, j -= 1) {
        if (_board[i][j] === _board[i + 1][j - 1]) {
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
    reset,
    checkWin,
  };
})();

const gameFlow = (() => {
  let _playerMarker = "";
  let _turn = 1;
  let _gameOver = false;

  const initPlayers = () => {
    const playerOne = playerFactory("Alex", "X");
    const playerTwo = playerFactory("Senya", "O");

    return {
      playerOne,
      playerTwo,
    };
  };

  const _players = initPlayers();

  const gameStart = () => {
    gameBoard.reset();

    _playerMarker = _players.playerOne.getMarker();
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
          _changePlayer();
          _turn += 1;
          if (_turn > 5) {
            _gameOver = gameBoard.checkWin(cell);
          }
        }
      }
    });
  });

  return { gameStart };
})();

gameFlow.gameStart();
