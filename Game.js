import { UI } from "./UI.js";
import { Cell } from "./Cell.js";

class Game extends UI {
  config = {
    easy: {
      rows: 8,
      cols: 8,
      mines: 10,
    },
    normal: {
      rows: 16,
      cols: 16,
      mines: 40,
    },
    expert: {
      rows: 16,
      cols: 30,
      mines: 99,
    },
  };
  numberOfRows = null;
  numberOfCols = null;
  numberOfMines = null;

  cells = [];
  cellsElements = null;

  board = null;

  constructor() {
    super();
  }

  initializeGame() {
    this.handleElements();
    this.newGame();
  }

  newGame(
    rows = this.config.easy.rows,
    cols = this.config.easy.cols,
    mines = this.config.easy.mines
  ) {
    this.numberOfRows = rows;
    this.numberOfCols = cols;
    this.numberOfMines = mines;

    this.generateCells();
    this.renderBoard();

    this.cellsElements = this.getElements(this.UiSelectors.cell);

    this.addCellsEventListeners();
  }

  handleElements() {
    this.board = this.getElement(this.UiSelectors.board);
  }

  addCellsEventListeners() {
    this.cellsElements.forEach((element) => {
      element.addEventListener("click", this.handleCellClick);
      element.addEventListener("contextmenu", this.handleCellContentMenu);
    });
  }

  generateCells() {
    for (let row = 0; row < this.numberOfRows; row++) {
      this.cells[row] = [];
      for (let col = 0; col < this.numberOfCols; col++) {
        this.cells[row].push(new Cell(col, row));
      }
    }
  }

  renderBoard() {
    this.cells.flat().forEach((cell) => {
      this.board.insertAdjacentHTML("beforeend", cell.createElement());
      cell.element = cell.getElement(cell.selector);
    });
  }

  handleCellClick = (e) => {
    const target = e.target;
    const rowIndex = parseInt(target.getAttribute("data-y"), 10);
    const colIndex = parseInt(target.getAttribute("data-x"), 10);

    this.cells[rowIndex][colIndex].revealCell();
  };

  handleCellContentMenu = (e) => {
    e.preventDefault();
    const target = e.target;
    const rowIndex = parseInt(target.getAttribute("data-y"), 10);
    const colIndex = parseInt(target.getAttribute("data-x"), 10);

    const cell = this.cells[rowIndex][colIndex];
    if (cell.isRevealed) return;

    cell.toggleFlag();
  };

  htmlElements() {
    this.gameBoard = this.getElement(this.UiSelectors.gameBoard);
  }
}

const game = new Game();
game.initializeGame();
