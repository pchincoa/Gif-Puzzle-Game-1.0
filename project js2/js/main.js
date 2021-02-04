let url = [
  "https://media.giphy.com/media/3ohhwDfcBvBPpD9RZu/source.gif", // Vermeer
  "https://media.giphy.com/media/gVJKzDaWKSETu/source.gif", // Frida Kahlo
  "https://media.giphy.com/media/xTiTnyVHRS87mtGPQs/source.gif", // Magritte
  "https://media.giphy.com/media/l4tV5VQbNScIikY4o/source.gif", // Picasso
  "https://media.giphy.com/media/pJewxDQLE8iZi/source.gif" // Leonardo
];

let img;
let confetti = [];
let sound;
let puzz;
let counter = 0;
let button1, button2;
const mischenZeit = 10;

let timerInterval;
let timerHtml;
let co;
let clicks = 0;
let startTime = null;
let puzzleCollection = []; 
let minDimension = 0;       // smaller of both dimensions of the source image
let border = 2;
let piecesX = 3;            // number of puzzle pieces in a row, should be >=3
let piecesY = 3;            // number of puzzle pieces in a column, should be >=3
let gameWon = false;

let prototypePuzzle = {
  dx : 0,                   // x position in final puzzle (canvas/destination) (0 = most left, piecesX-1 = most right piece)
  dy : 0,                   // y position in final puzzle (canvas/destination) (0 = most up, piecesY-1 = bottom piece)
  sx : 0,                   // x position in source image (0 = most left, piecesX-1 = most right piece)
  sy : 0,                   // y position in source image (0 = top, piecesY-1 = bottom piece)
  whitePiece: false,
  spX: 0.1,
  spY: 0.1,
  so: null,
  init: function(){ puzzleCollection.push(this); },
  checkNeighborsForWhitePiece: function(){  // Positioning the four neighbors of the empty piece 
    if(this.dx > 0 && getPuzzlePiece(this.dx-1, this.dy).whitePiece) {
      return [this.dx-1, this.dy];
    } // left

    if(this.dy > 0 && getPuzzlePiece(this.dx, this.dy-1).whitePiece) {
      return [this.dx, this.dy-1];
    } // up

    if(this.dx < piecesX-1 && getPuzzlePiece(this.dx+1, this.dy).whitePiece) {
      return [this.dx+1, this.dy];
    } // right

    if(this.dy < piecesY-1 && getPuzzlePiece(this.dx, this.dy+1).whitePiece) {
      return [this.dx, this.dy+1];
    }  // down

    return false; // not found
  },
  move: function() {
    let neighbor = this.checkNeighborsForWhitePiece();
    if(neighbor)
    {
      let whitePiece = getPuzzlePiece(neighbor[0], neighbor[1]);
      let tmp = whitePiece.dx;
      whitePiece.dx = this.dx;
      this.dx = tmp;

      tmp = whitePiece.dy;
      whitePiece.dy = this.dy;
      this.dy = tmp;
    }
  }
};


/**
 * Initialize image array and preload image
 */
function preload() {
  //img = loadImage(url[Math.floor(random(url.length))]);
  img = loadImage('img/free-images-national-gallery-of-art-2.jpg');
  //img = loadImage('https://media.giphy.com/media/xUA7bcoWYjQMZhvEAM/giphy.gif');
};


// Sekunden in "zweistellig" konvertieren
/**
 * Format current timer
 * @param {number} seconds
 */
function convertSeconds(seconds) {
  let min = floor(seconds / 60);
  let sec = seconds % 60;
  return `${nf(min, 2)}:${nf(sec, 2)}`;
};


/**
 * p5 library setup
 */
function setup() {
  let canvasSize = Math.min(window.innerHeight, window.innerWidth);
  co = createCanvas(canvasSize, canvasSize);
  
  // shuffle button
  select("#btn").mouseClicked(shufflePuzzle);

  // end of game, for debugging
  select("#eg").mouseClicked(endOfTheGame);

  button1 = createButton('Reload the Puzzle');
  button1.mousePressed(nachLaden);
  
  select("#start").mousePressed(nachLaden);

  // create puzzle peaces
  puzzleFactory();

  // Settings timer
  timerHtml = select('#timer');
  timerHtml.html(convertSeconds(counter));

  // Confetti Piece Instance
  // nach dem Lösung des Puzzle Confetti zeigen
  for (let i = 0; i < canvasSize / 2; i++) {
     confetti[i] = new Confetti();
  } // Ende Schleife
}; //ENDE setup


// Puzzlebildern werden in Canvas geladen
// Bg Farbe, Stellung der Bilder und Frame Funktionen,
function draw() {
  img.setFrame(frameCount % img.numFrames());

  minDimension = Math.min(img.width, img.height);
  noStroke();
  fill(255);
  puzzleCollection.forEach(puzzlePiece => {
    if(puzzlePiece.whitePiece) {

      rect(puzzlePiece.dx*co.width/piecesX, puzzlePiece.dy*co.height/piecesY, co.width/piecesX, co.height/piecesY);
    } else {
      rect(puzzlePiece.dx*co.width/piecesX, puzzlePiece.dy*co.height/piecesY, co.width/piecesX, co.height/piecesY);
      image(img,
        puzzlePiece.dx*co.width/piecesX + border, puzzlePiece.dy*co.height/piecesY + border, co.width/piecesX - 2*border, co.height/piecesY - 2*border,
        puzzlePiece.sx*minDimension/piecesX, puzzlePiece.sy*minDimension/piecesY, minDimension/piecesX, minDimension/piecesY);  
    }
  });

  if(gameWon) {
    frameRate(30);
    for (let i = 0; i < confetti.length; i++) {
      confetti[i].show();
      confetti[i].update();
    }
  } else {
    frameRate(15);
  }
}; //ENDE draw

// Die Seite nachladen
function nachLaden() {
  button1 = window.location.reload();

};


function windowResized() {
  let canvasSize = Math.min(window.innerHeight, window.innerWidth);
  confetti=[];
  for (let i = 0; i < canvasSize / 2; i++) {
     confetti[i] = new Confetti();
  }
  resizeCanvas(canvasSize, canvasSize);
}

function mouseClicked(event) {
  let x = event.pageX - (co.canvas.offsetLeft + co.canvas.clientLeft);
  let y = event.pageY - (co.canvas.offsetTop + co.canvas.clientTop);

  // Collision detection between clicked offset and element
  puzzleCollection.forEach(function(puzzlePiece) {
    let puzzlePieceLeft = puzzlePiece.dx*co.width/piecesX + border;
    let puzzlePieceWidth = co.width/piecesX - 2*border;
    let puzzlePieceTop = puzzlePiece.dy*co.height/piecesY + border;
    let puzzlePieceHeight = co.height/piecesY - 2*border;
    if(x > puzzlePieceLeft && x < puzzlePieceLeft + puzzlePieceWidth &&
        y > puzzlePieceTop  && y < puzzlePieceTop  + puzzlePieceHeight) {
        //console.log('clicked an element: ' + puzzlePiece.dx + ' ' +puzzlePiece.dy);
        puzzlePiece.move()
      }
  });

  clicks++;
  select("#clicks").elt.innerHTML = `Moves: ${clicks}`;

  if(clicks === 1){
    startTime = new Date();
  }
};

/**
 * Retrieve puzzle piece at given coordinate in puzzle.
 * @param {number} dx x-coordinate in puzzle, 0-based
 * @param {number} dy y-coordinate in puzzle, 0-based
 * @return {Object} prototypePuzzle instance of puzzle piece, if found with given coordinates, null otherwise
 */
function getPuzzlePiece(dx, dy) {
  for(let i=0; i<puzzleCollection.length; i++){
    if (dx == puzzleCollection[i].dx && dy == puzzleCollection[i].dy) {
      return puzzleCollection[i];
    }
  }
  return null;
};


function puzzleFactory(){
  let puzzlePiece;

  for (let x = 0; x < piecesX; x++) {
    for (let y = 0; y < piecesY; y++) {
      puzzlePiece = Object.create(prototypePuzzle, {
        dx: { // x position in final puzzle (canvas/destination) (0 = most left, piecesX-1 = most right piece)
          value:x,
          writable: true,
          configurable: true
        },
        dy: {// y position in final puzzle (canvas/destination) (0 = most up, piecesY-1 = bottom piece)
          value:y,
          writable: true,
          configurable: true
        }, 
        sx: {value:x}, // x position in source image (0 = most left, piecesX-1 = most right piece)
        sy: {value:y}  // ...
      });
      puzzlePiece.init();
    }
  }
};

/**
 * Shuffles the puzzle pieces randomly
 */
function shufflePuzzle(){
  let pos = []; // create array
  for (let x = 0; x < piecesX; x++) {
    for (let y = 0; y < piecesY; y++) {
      pos.push([x,y]);
    }
  }

  puzzleCollection.forEach(function(puzzlePiece){
    let randomPosition = pos.splice(Math.floor(Math.random()*pos.length), 1);
    puzzlePiece.dx = randomPosition[0][0];
    puzzlePiece.dy = randomPosition[0][1];

    if (randomPosition[0].every((value, index) => value === [0,1][index])){
    // if (randomPosition[0][0] + randomPosition[0][1] == 0){
      puzzlePiece.whitePiece = true;
    } else {
      puzzlePiece.whitePiece = false;
    }
    
  })

  timerInterval = setInterval(() => {
    counter++;
    select("#timer").html(convertSeconds(counter));
  }, 1000)
};

function playAudio(){ 

  let sound = new Audio();
  sound.src = "sound\mp3\winner.mp3";
  sound.volume = 0.1;
  sound.play();

};

function endOfTheGame(){
  if (puzzleCollection.every((puzzlePiece) => puzzlePiece.dx === puzzlePiece.sx && puzzlePiece.dy === puzzlePiece.sy)) {
    gameWon = true;
    
    let a = select("#start").elt.style.display = "block"; // start button will be appeared 
    
    clearInterval(timerInterval);
    playAudio();
  }
};