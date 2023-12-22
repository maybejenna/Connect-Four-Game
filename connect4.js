class Game {
  constructor (height, width) {
    this.height = height; 
    this.width = width; 
    this.board = []; 

    this.players = [player1, player2];
    this.currPlayerIndex = 0;

    this.gameOver = false; 

    this.handleClick = this.handleClick.bind(this);
    this._win = this._win.bind(this);
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = ''
  
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    this.handleGameClick = this.handleClick.bind(this);

    top.addEventListener('click', this.handleClick);
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
    
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }

  updateStartButtonText(text) {
    const startButton = document.getElementById('startButton');
    startButton.innerText = text;
  }

  startGame() {
    if (document.getElementById('Player1Name').value === "" || 
    document.getElementById('Player1Color').value === "" ||
    document.getElementById('Player2Name').value === "" ||
    document.getElementById('Player2Color').value === ""
    ) {
      alert("Must Enter Valid Player Information");
      return;
      }
      const player1Name = document.getElementById('Player1Name').value;
      const player2Name = document.getElementById('Player2Name').value;

      const player1Color = document.getElementById('Player1Color').value;
      const player2Color = document.getElementById('Player2Color').value;
    
      const player1 = new Player(player1Color, player1Name);
      const player2 = new Player(player2Color, player2Name);

    
      this.players = [player1, player2];
      this.currPlayerIndex = 0;

    if (startButton.innerText === 'Reset Board' || startButton.innerText === 'Let\'s Play Again!'){
      this.resetGame();
      this.updateStartButtonText('Reset Board');

    } else {
      this.resetGame();
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      // Log the current state before checking if it's undefined
      console.log(`Checking spot for column ${x}, row ${y}: `, this.board[y][x]);
      if (this.board[y][x] === undefined) { // Check if the spot is taken
        return y;
      }
    }
    return null; // No available spots
  }

  placeInTable(y, x) {
    console.log(`Placing piece for player ${this.currPlayerIndex} at row ${y}, column ${x}`);
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.players[this.currPlayerIndex].color;

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  resetGame() {
    this.board = [];
  
    const board = document.getElementById('board');
    while (board.firstChild) {
      board.removeChild(board.firstChild);
    }
    
    this.makeBoard();
    this.makeHtmlBoard();
    this.currPlayerIndex = 0;
    this.gameOver = false;
    this.updateStartButtonText('Let\'s Play!');
  }

  endGame(msg) {
    setTimeout(() => {
      alert(msg);
    }, 500);

    this.updateStartButtonText('Let\'s Play Again!');
  }

  handleClick(evt) {
    // Prevent further moves if the game is over
    if (this.gameOver) {
      return;
    }
  
    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
  
    // If the column is full, no more pieces can be placed there
    if (y === null) {
      return;
    }
  
    // Place the piece in the table and update the board state
    this.board[y][x] = this.currPlayerIndex;
    this.placeInTable(y, x);
  
    // Check for a win or a tie
    if (this.checkForWin()) {
      this.gameOver = true;
      this.endGame(`${this.players[this.currPlayerIndex].name} won!`);
      return;
    } else if (this.board.every(row => row.every(cell => cell !== undefined))) {
      this.gameOver = true;
      this.endGame('It\'s a Tie!');
      return;
    }
  
    // Switch players
    this.currPlayerIndex = this.currPlayerIndex === 0 ? 1 : 0;
  }

  _win(cells) {
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayerIndex
    );
  }; 

  checkForWin() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        if (this._win(horiz) || this._win(vert) || this._win(diagDR) || this._win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player{
    constructor(color, name) {
      this.color = color;
      this.name = name;
    }
  }

const game = new Game(6, 7);

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', () => {

  game.startGame();
  });