/** Minesweeper game made by Sangwon Park
 *
 * script.js file is for Display/UI
 *
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
var TIME_LIMIT = localStorage.getItem("inputted");
if (!TIME_LIMIT) {
  TIME_LIMIT = 75;
}

// Display Message
const minesLeftText = document.querySelector(".data-mine-count");
if (NUMBER_OF_MINES >= 10) minesLeftText.textContent = "0" + NUMBER_OF_MINES;
else {
  minesLeftText.textContent = "00" + NUMBER_OF_MINES;
}
const messageText = document.querySelector(".subtext");
const mineText = document.querySelector(".minetext");

// Bomb Message
var div = document.createElement("div");
div.textContent = "🥟";
mineText.prepend(div);

// Setup Board
const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");

// Countdown Text Setup
const timerElement = document.getElementById("game-time");
const timerIcon = document.getElementById("timer-icon");
timerIcon.textContent = "⏳️";

// Buttons
const containerButton = document.querySelector(".container-btn");

// New Game Button
const newGameButton = document.createElement("button");
newGameButton.setAttribute("class", "btn btn-new");
newGameButton.setAttribute("type", "button");
newGameButton.innerHTML = "New Game";
containerButton.appendChild(newGameButton);

// Settings Button
const settingsButton = document.createElement("button");
settingsButton.setAttribute("class", "btn btn-settings");
settingsButton.setAttribute("type", "button");
settingsButton.innerHTML = "Settings";
containerButton.appendChild(settingsButton);

// Setup Settings Modal
const settingsModal = document.createElement("section");
settingsModal.setAttribute("class", "modal hidden");
document.body.appendChild(settingsModal);

// Settings Modal Flex Container
const titleContainer = document.createElement("div");
titleContainer.setAttribute("class", "flex");
settingsModal.appendChild(titleContainer);

// Settings Modal Flex
const modalTitle = document.createElement("div");
modalTitle.setAttribute("class", "modal-title");
modalTitle.innerHTML = "Settings";
titleContainer.appendChild(modalTitle);

// Settings Modal Timer Text
const timerContainer = document.createElement("div");
timerContainer.setAttribute("class", "flex timer");
settingsModal.appendChild(timerContainer);
const timerLabel = document.createElement("label");
timerLabel.setAttribute("for", "time");
timerLabel.setAttribute("class", "label-settings");
timerLabel.textContent = "Time (in seconds)";
timerContainer.appendChild(timerLabel);

// Settings Modal Timer Input
const timerNumber = document.createElement("input");
timerNumber.setAttribute("type", "number");
timerNumber.setAttribute("name", "time");
timerNumber.setAttribute("id", "time-input");
timerNumber.setAttribute("placeholder", TIME_LIMIT);
timerNumber.setAttribute("value", TIME_LIMIT);
timerNumber.setAttribute("step", 5);
timerNumber.setAttribute("inputted", "inputted");
timerContainer.appendChild(timerNumber);

// Settings Modal Update Button
const updateButton = document.createElement("button");
updateButton.setAttribute("class", "btn-update");
updateButton.setAttribute("type", "button");
updateButton.setAttribute("id", "update");
updateButton.innerHTML = "Save and Restart Game";
settingsModal.appendChild(updateButton);

// Countdown Variables
var isFirstClick = true;
setTimeText(TIME_LIMIT);
var timePassed;
var timer = true;
var timeIsUp = false;

/**
 *
 * @param {int} TIME_LIMIT
 * Receive the time limit in seconds and display in screen
 */
function setTimeText(timeLimit) {
  timerElement.style.color = "#dee2ff";
  let second = timeLimit % 60;
  let minute = Math.floor(timeLimit / 60);
  if (second < 10 && second >= 0) {
    timerElement.innerHTML = minute + ":" + "0" + second;
  } else {
    timerElement.innerHTML = minute + ":" + second;
  }
  if (minute === 0 && second < 6) timerElement.style.color = "red";
  // Flashing countdown
  // if (minute === 0 && second === 5) timerElement.style.color = "red";
  // if (minute === 0 && second === 3) timerElement.style.color = "red";
  // if (minute === 0 && second === 1) timerElement.style.color = "red";
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
    if (remainingFlags >= 10) {
      minesLeftText.textContent = "0" + remainingFlags;
    } else {
      minesLeftText.textContent = "00" + remainingFlags;
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
        timerIcon.textContent = "⌛️";
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

// Button Functionality
// New Game Button functionality
newGameButton.addEventListener("click", () => {
  window.location.reload();
});

// Modal Constants
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");

// Open Settings Modal functionality
const openSettingsModal = function () {
  modal.classList.remove("hidden");
  // overlay.classList.remove("hidden");
};
settingsButton.addEventListener("click", () => {
  if (modal.classList.contains("hidden")) {
    openSettingsModal();
  } else {
    closeSettingsModal();
  }
});

// Close Settings Modal functionality
const closeSettingsModal = function () {
  modal.classList.add("hidden");
  // overlay.classList.add("hidden");
};

// Close Settings modal for keyboard escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeSettingsModal();
  }
});

// Update Settings Button functionality
updateButton.addEventListener("click", () => {
  var num = document.getElementById("time-input").value;
  localStorage.setItem("inputted", num);
  window.location.reload();
});
