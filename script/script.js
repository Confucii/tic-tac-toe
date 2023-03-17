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
      const cellRef = cell;
      cellRef.textContent = _board[Math.floor(index / 3)][index % 3];
    });
  };

  const reset = () => {
    _board = [[], [], []];
  };

  const fillCell = function fillCell(_playerMarker) {
    if (this.textContent === "") {
      _board[this.dataset.row][this.dataset.column] = _playerMarker;
      _display();
    }
  };

  return {
    fillCell,
    reset,
  };
})();

const gameFlow = (() => {
  let _playerMarker = "";

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

  const __boardTable = document.querySelectorAll("td");

  __boardTable.forEach((cell) => {
    cell.addEventListener("click", () => {
      gameBoard.fillCell.call(cell, _playerMarker);
      _changePlayer();
    });
  });

  return { gameStart };
})();

gameFlow.gameStart();
