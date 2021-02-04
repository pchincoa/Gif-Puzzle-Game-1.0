function el(cssSelector){
    return document.querySelector(cssSelector)
};		

function create(html){
    return document.createElement(html)
};

function group(cssSelector){
    return document.querySelectorAll(cssSelector)
};

let url = [
    "https://media.giphy.com/media/3ohhwDfcBvBPpD9RZu/source.gif", // Vermeer
    "https://media.giphy.com/media/gVJKzDaWKSETu/source.gif", // Frida Kahlo
    "https://media.giphy.com/media/xTiTnyVHRS87mtGPQs/source.gif", // Magritte
    "https://media.giphy.com/media/l4tV5VQbNScIikY4o/source.gif", // Picasso
    "https://media.giphy.com/media/pJewxDQLE8iZi/source.gif" // Leonardo
 ];


function droppingBubbles(){

    let co = el("#canvas");

    let ctx = co.getContext("2d");    

    let cloneCollector = [];

    let proto = {
      x   :2,     // X - Position
      y   :8,    // Y - Position
      w   :30,    // Width
      h   :30,    // Height
      rx  :0,     // direction: 0 => right / 1 => left
      ry  :0,     // direction: 0 => toward bottom(runter) / 1 => toward top(rauf)
      spX :0.02,   // value of the speed of X
      spY :0.02,   // value of the speed of Y 
      r   :1,    // radius for the circle
      col :null,  // null means not yet will be added later
      init:function(){
        this.col = color();
        this.x = Math.ceil(Math.random()*co.width);
        this.y = Math.floor(Math.random()*co.height);
        this.spX = (Math.random()*3)+1;
        this.spY = (Math.random()*3);
        cloneCollector.push(this);
      },
      
      move: function(){

        // Animation room
        if (this.x > co.width-this.r){this.rx = 1;this.col=color()};
        if (this.x < 0 + this.r){this.rx = 0; this.col = color()};

        if(this.y > co.height-this.r){this.ry = 1; this.col =color()};
        if(this.y < 0 + this.r){this.ry = 0; this.col = color()};

        // Movement of X axis
        if(this.rx === 0){this.x += this.spX};
        if(this.rx === 1){this.x -= this.spX};

        // Movement of Y axis
        if(this.ry === 0){this.y += this.spY};
        if(this.ry === 1){this.y -= this.spY};

        // Pixel Objekt
        ctx.fillStyle = this.col;
        // ctx.fillRect(this.x,this.y,this.w,this.h);

        ctx.beginPath();
        // ctx.arc(x,y,r, startwinkel, endwinkel, anticlockwise)
        ctx.arc(this.x,this.y,this.r, 0,3 * Math.PI, false)
        ctx.closePath();
        ctx.fill();

      }
  };

  function cloneFactory(){
    let clone;
    // 10 pieces of clone
    for(let i = 0; i < 235; i++){
      clone = Object.create(proto);
      clone.init();

    };
  };

  // Testen
  // proto.init()

  function render(){ // paint 
    
    // 60 (fps) frame per second under optimal hardware 
    // optimal programming 
    
    window.requestAnimationFrame(render); // paint - ing
    // ctx-clearRect(x,y,w,h);
    ctx.clearRect(0,0,co.width,co.height);
    
    // proto.move()

    cloneCollector.forEach(function(clone){
    clone.move();

    });

  };

  function color(){ 
    // random color combination 
    let r = Math.floor(Math.random()* 516);
    let g = Math.floor(Math.random()* 356);
    let b = Math.floor(Math.random()* 156);
    return `rgb(${r}, ${g}, ${b})`;
  };
  
  cloneFactory();
  render();

  el()

};

