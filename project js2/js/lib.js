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



// console.log(ctx)

  // let n; // number of slots
  // let imgMix; // mixed images
  // let clicks; // counter of each click
  // let startTime; //Time count upon the start

  // function playThatMusic(src){

  //   let sound = new Audio();

  //   sound.src = "sound/noise/pfeif.mp3";
  //   sound.volume = 0.1;
  //   sound.play();

  // };

  // function inTheGrid(){
  //    n = 9;
  //    imgMix = mix1(loadImgSet());
  //    clicks = 0;
  //    startTime = null;
     
  //    el("#clicks").innerHTML = "";
  //    el("#Time").innerHTML = "";

  // };

  // let pictures = [
  //     "img/2.jpg",
  //     "img/3.jpg",
  //     "img/4.jpg",
  //     "img/5.jpg",
  //     "img/6.jpg",
  //     "img/7.jpg",
  //     "img/8.jpg",
  //     "img/9.jpg"
  // ];



  // function makeTheSlots(){

  //   let picture;
    
  //   picture = new Image;
  //   picture.src = pictures[Math.floor(Math.random()*(pictures.length))];
  //   picture.onload = function(){

  //   contex_drawImage(makeTheSlots, 0,0);

  //   }
      
    

  // };

//   function imageLoad() {
    //   let result = [{ x: 45, y: 56 }];
    //   return result;
    // }
    
    // function detect(url) {
    //   let image = new Image();
    //   image.src = url;
    //   image.onload = imageLoad;
    // };
  
    // console.log(url)
  
  
    
  
    // duplicateFactory()
    // detect()

    