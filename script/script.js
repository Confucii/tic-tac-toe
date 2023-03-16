const playerFactory = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker };
};

const gameBoard = (() => {
  let _board = [[], [], []];

  const _display = () => {
    const boardTable = document.querySelectorAll("td");
    boardTable.forEach((cell, index) => {
      const cellRef = cell;
      cellRef.textContent = _board[Math.floor(index / 3)][index % 3];
    });
  };

  const reset = () => {
    _board = [[], [], []];
  };

  const fillCell = function fillCell(playerMarker) {
    if (this.textContent === "") {
      _board[this.dataset.row][this.dataset.column] = playerMarker;
      _display();
    }
  };

  return {
    fillCell,
    reset,
  };
})();

const gameFlow = (() => {
  const boardTable = document.querySelectorAll("td");
  const playerMarker = "O";

  boardTable.forEach((cell) => {
    cell.addEventListener("click", gameBoard.fillCell.bind(cell, playerMarker));
  });
  return {};
})();
