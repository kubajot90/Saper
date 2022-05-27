import { UI } from "./UI.js";

export class Cell extends UI {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.value = 0;
    this.isMine = false;
    this.isRevealed = false;
    this.isFlagged = false;
    this.selector = `[data-x='${this.x}'][data-y='${this.y}']`;
    this.element = null;
  }

  createElement() {
    const element = `<div class="cell border border--concave" data-x='${this.x}' data-y='${this.y}' data-cell></div>`;

    return element;
  }

  toggleFlag() {
    this.isFlagged = !this.isFlagged;
    this.element.classList.toggle("cell--is-flag");
  }

  revealCell() {
    this.isRevealed = true;
    this.element.classList.remove("border--concave");
    this.element.classList.add("border--revealed");
  }

  addMine() {
    this.isMine = true;
  }
}
