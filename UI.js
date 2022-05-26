export class UI {
  UiSelectors = {
    board: "[data-board]",
    cell: "[data-cell]",
  };
  constructor() {}
  getElement(selector) {
    return document.querySelector(selector);
  }

  getElements(selector) {
    return document.querySelectorAll(selector);
  }
}
