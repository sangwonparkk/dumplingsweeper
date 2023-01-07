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
const TIME_LIMIT = 10;

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

// Countdown
const timerElement = document.getElementById("game-time");
var isFirstClick = true;
setTimeText(TIME_LIMIT);
let timePassed;
let timer = true;
var timeIsUp = false;

/**
 *
 * @param {int} TIME_LIMIT
 * Receive the time limit in seconds and display in screen
 */
function setTimeText(timeLimit) {
  let second = timeLimit % 60;
  let minute = Math.floor(timeLimit / 60);
  if (second < 10 && second >= 0)
    timerElement.innerHTML = minute + ":" + "0" + second;
  else {
    timerElement.innerHTML = minute + ":" + second;
  }
}

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

function startTimer() {
  if (timer) {
    clearInterval(timePassed);
    let seconds = TIME_LIMIT;
    timePassed = setInterval(function () {
      // timerElement.toggle("odd");
      setTimeText(seconds);
      seconds--;
      if (seconds < -1) {
        timerElement.style.color = "red";
        timerElement.innerHTML = "0:00";
        clearInterval(timePassed);
        timeIsUp = true;
        checkGameEnd();
      }
      // Needs to stop at 0:00 and make game lose
    }, 1000);
  }
}

// Checks whether game is won or lost
function checkGameEnd() {
  var win = checkWin(board);
  var lose = checkLose(board);

  if (timeIsUp) lose = true;

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
