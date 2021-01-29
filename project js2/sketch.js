let url = [

  "https://media.giphy.com/media/xThuWtXFxz8ywTQtlC/source.gif",
  
];

let img;
let puzz;
let button1;
let zufällig; // Change the degree of difficulty from 0 to 100.


function preload() {
  img = loadImage(url[Math.floor(random(url.length))]);
}


function setup() {
  createCanvas(750, 750);
  button1 = createButton('Reload the Puzzle');
  button1.mousePressed(nachLaden);

 
}

function draw() {
  

  
}

function mouseClicked() {
  
}

function bingoBG() {}



// Reload the page
function nachLaden() {
  button1 = window.location.reload();


}

