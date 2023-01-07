/** Minesweeper game made by Sangwon Park
 *
 * script.js file is for Display/UI
 *
 * List out the game features and steps
 *
 * 1. Populate a board with tiles/mines
 * 2. Left click on tiles
 *   a. Reveal tiles
 * 3. Right click on tiles
 *   a. Mark tiles
 * 4. Check for win/lose
 */

import {
  TILE_STATUSES,
  createBoard,
  markTile,
  revealTile,
  checkLose,
  checkWin,
} from "./minesweeper.js";

// Constant Variables
const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 10;

// Display message
const minesLeftText = document.querySelector(".data-mine-count");
if (NUMBER_OF_MINES >= 10) minesLeftText.textContent = NUMBER_OF_MINES;
else {
  minesLeftText.textContent = "0" + NUMBER_OF_MINES;
}
const messageText = document.querySelector(".subtext");
const mineText = document.querySelector(".minetext");

// Bomb message
var div = document.createElement("div");
div.textContent = "🥟";
mineText.prepend(div);
twemoji.parse(document.body);

// Setup Board
const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");

// Timer
var isFirstClick = true;
let timePassed;
let timer = true;

board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.element);
    // Add event listener for left click
    tile.element.addEventListener("click", () => {
      if (isFirstClick) {
        startTimer();
        timer = true;
      }
      revealTile(board, tile, true);
      checkGameEnd();
      isFirstClick = false;
    });
    // Add event listern for right click
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (isFirstClick) {
        startTimer();
        timer = true;
      }
      markTile(tile);
      listMinesLeft();
      isFirstClick = false;
    });
  });
});

boardElement.style.setProperty("--size", BOARD_SIZE);

/**
 * Display number of mines left after marking
 */
function listMinesLeft() {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === TILE_STATUSES.MAKRED).length
    );
  }, 0);
  if (markedTilesCount <= NUMBER_OF_MINES) {
    minesLeftText.style.color = "#dee2ff";
    let remainingFlags = NUMBER_OF_MINES - markedTilesCount;
    if (remainingFlags < 10) {
      minesLeftText.textContent = "0" + remainingFlags;
    } else {
      minesLeftText.textContent = remainingFlags;
    }
  } else {
    minesLeftText.style.color = "red";
  }
}

const timerElement = document.getElementById("game-time");

function startTimer() {
  if (timer) {
    clearInterval(timePassed);
    let second = 0;

    timePassed = setInterval(function () {
      // timerElement.toggle("odd");
      if (second < 10) timerElement.innerHTML = "00" + second;
      if (second >= 10 && second < 100) timerElement.innerHTML = "0" + second;
      if (second >= 100) timerElement.innerHTML = second;
      second++;
    }, 1000);
  }
}

// Checks whether game is won or lost
function checkGameEnd() {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    clearInterval(timePassed);
    boardElement.addEventListener("click", stopProp, { capture: true });
    boardElement.addEventListener("contextmenu", stopProp, { capture: true });
  }

  if (win) {
    messageText.textContent = "You Win";
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUSES.MAKRED) markTile(tile);
        if (tile.mine) revealTile(board, tile, false);
      });
    });
  }
  if (lose) {
    messageText.textContent = "You Lose";
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUSES.MAKRED) markTile(tile);
        revealTile(board, tile, false);
      });
    });
  }
}

function stopProp(e) {
  e.stopImmediatePropagation();
}
