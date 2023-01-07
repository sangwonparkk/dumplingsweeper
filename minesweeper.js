/**
 * minesweeper.js file is for functionality/logic
 */

// Tile Statuses
export const TILE_STATUSES = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MAKRED: "marked",
};

// Emojis
const TIMER = "⏳️";
// const FLAG = "🚩";
const FLAG = "🥢";
const DETONATION = "😭";
const MINE = "🥟";

export function createBoard(boardSize, numberOfMines) {
  const board = [];
  const minePositions = getMinePositions(boardSize, numberOfMines);

  for (let x = 0; x < boardSize; x++) {
    const row = [];
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement("div");
      element.dataset.status = TILE_STATUSES.HIDDEN;
      // Tile object
      const tile = {
        element,
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, { x, y })),
        clicked: false, // In order to show detonation only on clicked line
        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      };
      row.push(tile);
    }
    board.push(row);
  }
  return board;
}
/**
 * Generate a random number from 0 to boardSize
 */
function randomNumber(size) {
  return Math.floor(Math.random() * size);
}

/**
 *
 * @param {position} a
 * @param {position} b
 * @returns Boolean value based on coordinates
 */
function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}

/**
 * Retrieve the positions of mines in the board
 */
function getMinePositions(boardSize, numberOfMines) {
  const positions = [];

  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    };
    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position);
    }
  }
  return positions;
}

/**
 *
 * @param {tile} tile
 * @returns Nothing if tile is hidden and marked, change tile status if hidden or marked
 */
export function markTile(tile) {
  if (
    tile.status !== TILE_STATUSES.HIDDEN &&
    tile.status !== TILE_STATUSES.MAKRED
  ) {
    return;
  }
  if (tile.status === TILE_STATUSES.MAKRED) {
    tile.status = TILE_STATUSES.HIDDEN;
    tile.element.textContent = "";
  } else {
    tile.status = TILE_STATUSES.MAKRED;
    tile.element.textContent = FLAG;
    twemoji.parse(tile.element);
  }
}

/**
 *
 * @param {tile} tile
 */
export function revealTile(board, tile, clicked) {
  if (tile.status !== TILE_STATUSES.HIDDEN) {
    return;
  }
  if (tile.mine && clicked) {
    tile.status = TILE_STATUSES.MINE;
    tile.element.textContent = DETONATION;
    twemoji.parse(tile.element);
    return;
  }

  if (tile.mine && !clicked) {
    tile.status = TILE_STATUSES.MINE;
    tile.element.textContent = MINE;
    twemoji.parse(tile.element);
    return;
  }

  tile.status = TILE_STATUSES.NUMBER;
  const adjacentTiles = nearbyTiles(board, tile);
  const mines = adjacentTiles.filter((t) => t.mine === true);
  if (mines.length === 0) {
    // adjacentTiles.forEach(revealTile.bind(null, board));
    adjacentTiles.forEach((t) => revealTile(board, t));
  } else {
    tile.element.textContent = mines.length;
  }
}

// Goes through board to check win
export function checkWin(board) {
  return board.every((row) => {
    return row.every((tile) => {
      return (
        tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUSES.MAKRED ||
            tile.status === TILE_STATUSES.HIDDEN))
      );
    });
  });
}

export function checkLose(board) {
  return board.some((row) => {
    return row.some((tile) => {
      return tile.status === TILE_STATUSES.MINE;
    });
  });
}

// Get all tiles that are adjacent to tile
function nearbyTiles(board, { x, y }) {
  const tiles = [];

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset];

      if (tile) tiles.push(tile);
    }
  }

  return tiles;
}
