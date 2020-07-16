'use strict';

var Brick = function (){
    this.rowCount = 5;
    this.color = 'firebrick';
    this.columnCount = 9;
    this.width = 75;
    this.height = 20;
    this.padding = 10;
    this.offsetTop = 100;
    this.offsetLeft = 20;
    this.bricks = [];

    //creation des bricks
    for (var column = 0; column < this.columnCount; column++) {
        this.bricks[column] = [];
        for (var row = 0; row < this.rowCount; row++) {
            this.bricks[column][row] = {
                x : this.offsetLeft + (this.width + this.padding) * column,
                y : this.offsetTop + (this.height + this.padding ) * row,
                status: 1
            };
        }
    }
}
