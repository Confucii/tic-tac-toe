const playerFactory = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker };
};

const gameBoard = (() => {
  let board = [[], [], []];

  const reset = () => {
    board = [[], [], []];
  };

  const display = () => {
    const boardTable = document.querySelectorAll("td");
    boardTable.forEach((cell, index) => {
      const cellRef = cell;
      cellRef.textContent = board[Math.floor(index / 3)][index % 3];
    });
  };

  const fillCell = function fillCell(playerMarker) {
    if (this.textContent === "") {
      board[this.dataset.row][this.dataset.column] = playerMarker;
      display();
    }
  };

  return {
    display,
    fillCell,
    reset,
  };
})();

const boardTable = document.querySelectorAll("td");
const playerMarker = "O";

boardTable.forEach((cell) => {
  cell.addEventListener("click", gameBoard.fillCell.bind(cell, playerMarker));
});
