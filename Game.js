import { UI } from "./UI.js";
import { Cell } from "./Cell.js";
import { Counter } from "./Counter.js";
import { Timer } from "./Timer.js";

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

  counter = new Counter();
  timer = new Timer();

  isGameFinished = false;
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
    this.counter.init();
    this.timer.init();
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

    this.counter.setValue(this.numberOfMines);
    this.timer.startTimer();

    this.generateCells();
    this.renderBoard();
    this.placeMinesInCells();

    this.cellsElements = this.getElements(this.UiSelectors.cell);

    this.addCellsEventListeners();
  }

  endGame(isWin) {
    this.isGameFinished = true;
    this.timer.stopTimer();

    if (!isWin) {
      this.revealMines();
    }
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

  placeMinesInCells() {
    let minesToPlaces = this.numberOfMines;

    while (minesToPlaces) {
      const rowIndex = this.getRandomInteger(0, this.numberOfRows - 1);
      const colIndex = this.getRandomInteger(0, this.numberOfCols - 1);

      const cell = this.cells[rowIndex][colIndex];
      const hasCellMine = cell.isMine;

      if (!hasCellMine) {
        cell.addMine();
        minesToPlaces--;
      }
    }
  }

  handleCellClick = (e) => {
    const target = e.target;
    const rowIndex = parseInt(target.getAttribute("data-y"), 10);
    const colIndex = parseInt(target.getAttribute("data-x"), 10);

    const cell = this.cells[rowIndex][colIndex];
    this.clickCell(cell);
  };

  handleCellContentMenu = (e) => {
    e.preventDefault();
    const target = e.target;
    const rowIndex = parseInt(target.getAttribute("data-y"), 10);
    const colIndex = parseInt(target.getAttribute("data-x"), 10);

    const cell = this.cells[rowIndex][colIndex];
    if (cell.isRevealed) return;

    if (cell.isFlagged) {
      this.counter.increment();
      cell.toggleFlag();
    }
    if (!!this.counter.value) {
      this.counter.decrement();
      cell.toggleFlag();
    }
  };

  clickCell(cell) {
    if (cell.isMine) {
      this.endGame(false);
    }

    cell.revealCell();
  }

  revealMines() {
    this.cells
      .flat()
      .filter(({ isMine }) => isMine)
      .forEach((cell) => cell.revealCell());
  }

  htmlElements() {
    this.gameBoard = this.getElement(this.UiSelectors.gameBoard);
  }

  getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

const game = new Game();
game.initializeGame();
