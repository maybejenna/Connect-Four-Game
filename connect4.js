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
  
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
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
      this.currPlayer = 0; 

    if (startButton.innerText === 'Reset Board' || startButton.innerText === 'Let\'s Play Again!'){
      this.resetGame();
      this.updateStartButtonText('Reset Board');

    } else {
      this.resetGame();
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.players[this.currPlayerIndex].color;
  
    piece.style.top = -50 * (y + 2);

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
    this.currPlayer = 1;
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
    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    if (this.gameOver) {
      return;
    }
  
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`${this.currPlayer.name} won!`);
    }
    
    if (this.board.every(row => row.every(cell => cell))) {
      this.gameOver = true;
      return this.endGame('It\'s a Tie!');
    }
      
    this.currPlayerIndex = this.currPlayerIndex === 0 ? 1 : 0;
  }

  _win(cells) {
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer
    );
  }

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

  };

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