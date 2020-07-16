'use strict';


function getRandomArbitrary(min, max) {
  return parseInt(Math.random() * ((max - min) + 1) + min);
};


function getRandomColor(){
    var red;
    var green;
    var blue;
    var opacity;

    red = getRandomArbitrary(0,255);
    green = getRandomArbitrary(0,255);
    blue = getRandomArbitrary(0,255);
    opacity = Math.random();

    return 'rgba(' + red + ',' + green + ',' + blue + ',' + opacity + ')';
}
