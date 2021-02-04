(function(){

  function el(cssSelector){
    return document.querySelector(cssSelector)
};

  let co = el("#canvas");
  let ctx = co.getContext("2d");

  let clicks = 0;
  let startTime = null;
  let puzzleCollection = []
  let minDimension = 0;    // smaller of both dimensions of the source image
  let border = 2;
  let piecesX = 3;
  let piecesY = 3;

  let prototypePuzzle = {
    dx : 0,   // x position in final puzzle (canvas/destination) (0 = most left, piecesX-1 = most right piece)
    dy : 0,   // y position in final puzzle (canvas/destination) (0 = most up, piecesY-1 = bottom piece)
    sx : 0,   // x position in source image (0 = most left, piecesX-1 = most right piece)
    sy : 0,   // ...
    whitePiece: false,
    spX: 0.1,
    spY: 0.1,
    so: null,
    init: function(){
      puzzleCollection.push(this);
    },
    draw: function(){
      if(this.whitePiece){
        ctx.fillStyle = "white";
        ctx.fillRect(this.dx*co.width/piecesX + border, this.dy*co.height/piecesY + border, co.width/piecesX - 2*border, co.height/piecesY - 2*border);
      } else {
        ctx.drawImage(image,
          this.sx*minDimension/piecesX, this.sy*minDimension/piecesY, minDimension/piecesX, minDimension/piecesY,
          this.dx*co.width/piecesX + border, this.dy*co.height/piecesY + border, co.width/piecesX - 2*border, co.height/piecesY - 2*border);
        }
     },

     checkNeighborsForWhitePiece: function (){  // Positioning the four neighbors of the empty piece 

      if(this.dx > 0 && getPuzzlePiece(this.dx-1, this.dy).whitePiece){
        return [this.dx-1, this.dy];
      } // left

      if(this.dy > 0 && getPuzzlePiece(this.dx, this.dy-1).whitePiece){
        return [this.dx, this.dy-1];
      } // up

      if(this.dx < piecesX-1 && getPuzzlePiece(this.dx+1, this.dy).whitePiece){
        return [this.dx+1, this.dy];
      } // right

      if(this.dy < piecesY-1 && getPuzzlePiece(this.dx, this.dy+1).whitePiece){
        return [this.dx, this.dy+1];
      }  // down

      return false;
    },

    move: function(){
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

        drawUp();
      }
    }
  };

  co.addEventListener('click', function(event) {
    let x = event.pageX - (co.offsetLeft + co.clientLeft);
    let y = event.pageY - (co.offsetTop + co.clientTop);

    // Collision detection between clicked offset and element.
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
    el("#clicks").innerHTML = `Moves: ${clicks}`;

    if(clicks === 1){

      startTime = new Date();
    };

  }, false);

  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    let canvasSize = Math.min(window.innerHeight, window.innerWidth) - window.getComputedStyle(co).borderLeftWidth.replace("px","")*2;
    co.width = canvasSize;
    co.height = canvasSize;

    drawUp(); 
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
  function shuffle(){
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

    drawUp();
  };

  el("#btn").addEventListener("click", shuffle)
  
  let url = [
    "https://media.giphy.com/media/3ohhwDfcBvBPpD9RZu/source.gif", // Vermeer
    "https://media.giphy.com/media/gVJKzDaWKSETu/source.gif", // Frida Kahlo
    "https://media.giphy.com/media/xTiTnyVHRS87mtGPQs/source.gif", // Magritte
    "https://media.giphy.com/media/l4tV5VQbNScIikY4o/source.gif", // Picasso
    "https://media.giphy.com/media/pJewxDQLE8iZi/source.gif" // Leonardo
  ];


  let image = new Image();
  image.src = "img/free-images-national-gallery-of-art-2.jpg";
  //image.src = url[Math.floor(Math.random()*(url.length))];
  image.onload = drawUp;
  // console.log(url)

  
  function drawUp (){
    // let pattern = ctx.createPattern(image, "repeat");
    // ctx.fillStyle = pattern;
    // ctx.fillRect(0,0, 480, 480);
  
    minDimension = Math.min(image.width, image.height)
    // console.log("minDimension:"+minDimension);
  
    puzzleCollection.forEach(function(puzzlePiece){
      puzzlePiece.draw();
    });
  };

  // el("#start").addEventListener("click", drawUp)

  // Upon the start of the new game 
  // el("clicks").innerHTML = " ";
  // el("time").innerHTML = " ";

  function playAudio(){ 

    let sound = new Audio();
    sound.src = "sound\mp3\winner.mp3";
    sound.volume = 0.1;
    sound.play();

  };

  function endOfTheGame(){
    if (puzzleCollection.every((puzzlePiece) => puzzlePiece.dx === puzzlePiece.sx && puzzlePiece.dy === puzzlePiece.sy)) {
      
      
      el("#start").style.display = "block"; // start button will be appeared 
      // Time count 

     

      let endTime = new Date();

      el("#time").innerHTML = `Seconds: ${Math.ceil((endTime - startTime) / 1000)}`;
      playAudio();


    };
        // image.src = "img/free-images-national-gallery-of-art-2.jpg"
  };
  

  el("#eg").addEventListener("click", endOfTheGame);

  function newGame(){}



  puzzleFactory();
  resizeCanvas();



}()); 