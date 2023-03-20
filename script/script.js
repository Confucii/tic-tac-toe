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

  const checkWin = function checkWin(row, column) {
    let _overlapCount = 0;

    const _checkOverlap = () => {
      _overlapCount = _overlapCount === 2 ? true : 0;
    };

    const _checkHorizontal = () => {
      for (let i = 0; i < 2; i += 1) {
        if (board[row][i] === board[row][i + 1]) {
          _overlapCount += 1;
        }
      }
    };

    const _checkVertical = () => {
      for (let i = 0; i < 2; i += 1) {
        if (board[i][column] === board[i + 1][column]) {
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
        if (row === "1" && column === "1") {
          _checkLeftToRightDiag();
          _checkOverlap();
          if (!_overlapCount) {
            _checkRightToLeftDiag();
            _checkOverlap();
          }
        } else if (row === column) {
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

const computer = (() => {
  const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const nodeFactory = (state, depth) => {
    const states = [];
    const score = -100;
    return { state, depth, states, score };
  };

  const checkWinAI = (inputState) => {
    // Check rows
    for (let i = 0; i < inputState.length; i += 1) {
      if (
        inputState[i][0] !== "" &&
        inputState[i][0] === inputState[i][1] &&
        inputState[i][0] === inputState[i][2]
      ) {
        return true;
      }
    }

    // Check columns
    for (let j = 0; j < inputState[0].length; j += 1) {
      if (
        inputState[0][j] !== "" &&
        inputState[0][j] === inputState[1][j] &&
        inputState[0][j] === inputState[2][j]
      ) {
        return true;
      }
    }

    // Check diagonals
    if (
      inputState[0][0] !== "" &&
      inputState[0][0] === inputState[1][1] &&
      inputState[0][0] === inputState[2][2]
    ) {
      return true;
    }
    if (
      inputState[0][2] !== "" &&
      inputState[0][2] === inputState[1][1] &&
      inputState[0][2] === inputState[2][0]
    ) {
      return true;
    }

    // No win condition found
    return false;
  };

  const root = nodeFactory(board, 0);

  const generateTree = (inputState, node, player) => {
    const nodeRef = node;

    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (inputState[i][j] === "") {
          const boardCopy = JSON.parse(JSON.stringify(inputState));
          boardCopy[i][j] = player;
          const newNode = nodeFactory(boardCopy, node.depth + 1);
          node.states.push(newNode);
          if (!checkWinAI(boardCopy)) {
            generateTree(boardCopy, newNode, player === "X" ? "O" : "X");
            if (newNode.depth === 9) {
              newNode.score = 0;
            }
          } else if (player === "O") {
            newNode.score = 10 - newNode.depth;
          } else if (player === "X") {
            newNode.score = newNode.depth - 10;
          }
          if (node.score < newNode.score) {
            nodeRef.score = newNode.score;
          }
        }
      });
    });
  };

  generateTree(board, root, "X");

  return root;
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
    const cellRef = cell;
    cell.addEventListener("mouseenter", () => {
      if (!_gameOver && cell.textContent === "") {
        cell.classList.add("empty-hover");
        cellRef.textContent = _playerMarker;
      }
    });

    cell.addEventListener("mouseleave", () => {
      if (!_gameOver && cell.classList.contains("empty-hover")) {
        cell.classList.remove("empty-hover");
        cellRef.textContent = "";
      }
    });

    cell.addEventListener("click", () => {
      if (_turn < 10) {
        if (
          (cell.textContent === "" && !_gameOver) ||
          cell.classList.contains("empty-hover")
        ) {
          cell.classList.remove("empty-hover");
          gameBoard.fillCell.call(cell, _playerMarker);
          _turn += 1;
          if (_turn > 5) {
            _gameOver = gameBoard.checkWin(
              cell.dataset.row,
              cell.dataset.column
            );
            const gameState = document.querySelector(".main p");
            if (_gameOver) {
              gameState.textContent = `The winner is ${_playerMarker}!`;
            } else if (!_gameOver && _turn === 10) {
              _gameOver = true;
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
