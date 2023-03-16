const playerFactory = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker };
};

const gameBoard = (() => {
  let board = [
    ["X", "X", "O"],
    ["O", "O", "X"],
    ["X", "O", "X"],
  ];

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
  return {
    display,
    reset,
  };
})();

gameBoard.display();
