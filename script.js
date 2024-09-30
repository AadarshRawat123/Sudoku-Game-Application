// Variables for game setup
let chosenPlayer = ''; // To store chosen player (X or O)
let difficulty = ''; // To store difficulty level
let playerName = ''; // To store player's name

// Function to choose X
function chooseX() {
  chosenPlayer = 'X';
}

// Function to choose O
function chooseO() {
  chosenPlayer = 'O';
}

// Function to set difficulty
function setDifficulty(level) {
  difficulty = level;
  document.getElementById('difficulty').innerText = `Difficulty: ${level}`;
}

// Function to start Tic Tac Toe game
function startTicTacToe() {
  document.getElementById('game-options').style.display = 'none'; // Hide game options
  document.getElementById('tic-tac-toe').style.display = 'block'; // Show Tic Tac Toe options
}

// Function to start game after selecting options
function startGame() {
  if (chosenPlayer === '' || difficulty === '') {
    alert('Please choose player symbol and difficulty');
    return;
  }
  playerName = prompt('Enter your name:', 'Player'); // Ask for player's name
  if (playerName === null || playerName === '') {
    playerName = 'Player'; // Set default player name if not entered
  }
  document.getElementById('tic-tac-toe').style.display = 'none'; // Hide Tic Tac Toe options
  document.getElementById('game-container').style.display = 'block'; // Show game container
  document.getElementById('difficulty').innerText = `Difficulty: ${difficulty}`; // Display chosen difficulty
  initializeBoard(); // Initialize the game board
}

// Game Logic
const PLAYER_X = 'X';
const PLAYER_O = 'O';
let currentPlayer = PLAYER_X;
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let scores = { player: 0, ai: 0, draw: 0 };

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const scoreboard = document.getElementById('scoreboard');

// Initialize game board
function initializeBoard() {
  cells.forEach(cell => {
    cell.innerText = '';
    cell.addEventListener('click', handleCellClick);
  });
  message.innerText = `Current Turn: ${currentPlayer}`;
  gameOver = false;
  gameState = ['', '', '', '', '', '', '', '', ''];
}

// Handle cell click
function handleCellClick(event) {
  const cellIndex = Array.from(cells).indexOf(event.target);
  if (gameOver || gameState[cellIndex] !== '') return;

  gameState[cellIndex] = currentPlayer;
  event.target.innerText = currentPlayer;

  if (checkWin(currentPlayer)) {
    gameOver = true;
    message.innerText = `${currentPlayer} wins!`;
    scores[currentPlayer.toLowerCase()]++;
  } else if (!gameState.includes('')) {
    gameOver = true;
    message.innerText = `It's a draw!`;
    scores.draw++;
  } else {
    currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
    message.innerText = `Current Turn: ${currentPlayer}`;
    if (currentPlayer === PLAYER_O) {
      setTimeout(makeAIMove, 500);
    }
  }

  updateScoreboard();
}

// Check for win/draw
function checkWin(player) {
  return winningCombinations.some(combination => {
    return combination.every(index => gameState[index] === player);
  });
}

// AI Move using Minimax algorithm
function makeAIMove() {
  let bestScore = -Infinity;
  let bestMove;
  for (let i = 0; i < gameState.length; i++) {
    if (gameState[i] === '') {
      gameState[i] = PLAYER_O;
      let score = minimax(gameState, 0, false);
      gameState[i] = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  gameState[bestMove] = PLAYER_O;
  cells[bestMove].innerText = PLAYER_O;

  if (checkWin(PLAYER_O)) {
    gameOver = true;
    message.innerText = `${PLAYER_O} wins!`;
    scores.ai++;
  } else if (!gameState.includes('')) {
    gameOver = true;
    message.innerText = `It's a draw!`;
    scores.draw++;
  } else {
    currentPlayer = PLAYER_X;
    message.innerText = `Current Turn: ${currentPlayer}`;
  }

  updateScoreboard();
}

// Minimax algorithm
function minimax(board, depth, isMaximizing) {
  if (checkWin(PLAYER_X)) {
    return -10 + depth;
  } else if (checkWin(PLAYER_O)) {
    return 10 - depth;
  } else if (!gameState.includes('')) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = PLAYER_O;
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = PLAYER_X;
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Update scoreboard
function updateScoreboard() {
  scoreboard.innerText = `${playerName}: ${scores.player} AI: ${scores.ai} Draw: ${scores.draw}`;
}

// Function to start new game
function newGame() {
  chosenPlayer = ''; // Reset chosen player
  difficulty = ''; // Reset difficulty
  playerName = ''; // Reset player name
  document.getElementById('game-options').style.display = 'block'; // Show game options
  document.getElementById('tic-tac-toe').style.display = 'none'; // Hide Tic Tac Toe options
  document.getElementById('game-container').style.display = 'none'; // Hide game container
  document.getElementById('message').innerText = 'Click on a cell to start the game'; // Reset message
  document.getElementById('scoreboard').innerText = 'Player: 0 AI: 0 Draw: 0'; // Reset scoreboard
  initializeBoard(); // Initialize the game board
}

// Function to restart game
function restartGame() {
  initializeBoard(); // Initialize the game board
}

// Initialize the game
initializeBoard();
