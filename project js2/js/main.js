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
        ctx.fillRect(this.dx*co.width/piecesX - border, this.dy*co.height/piecesY - border, co.width/piecesX - 2*border, co.height/piecesY - 2*border);
      } else {
        ctx.drawImage(image,
          this.sx*minDimension/piecesX, this.sy*minDimension/piecesY, minDimension/piecesX, minDimension/piecesY,
          this.dx*co.width/piecesX - border, this.dy*co.height/piecesY - border, co.width/piecesX - 2*border, co.height/piecesY - 2*border);
        }
     },
     getPuzzlePieces: function(dx,dy,piecesX,piecesY){

      pos= piecesX*dy+dx+1;

      return puzzleCollection[pos];

     }
  };

  function checkNeighbors(){}

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
  } 

    el("#btn").addEventListener("click", shuffle)
  

  let url = [
    "https://media.giphy.com/media/3ohhwDfcBvBPpD9RZu/source.gif", // Vermeer
    "https://media.giphy.com/media/gVJKzDaWKSETu/source.gif", // Frida Kahlo
    "https://media.giphy.com/media/xTiTnyVHRS87mtGPQs/source.gif", // Magritte
    "https://media.giphy.com/media/l4tV5VQbNScIikY4o/source.gif", // Picasso
    "https://media.giphy.com/media/pJewxDQLE8iZi/source.gif" // Leonardo
 ];


  let image = new Image();
  image.src = "img/free-images-national-gallery-of-art-2.jpg"
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

  function puzzleRules(){

    clicks++;

    if(clicks === 1){

      startTime = new Date();
    };

    el("#clicks").innerHTML = `Clicks:${clicks}`;


  };


  function endOfTheGame(){

   

  }


  puzzleFactory();
  drawUp();

 

}());