'use strict';
// **********************************************************************************
// ********************************* Classe Program *********************************
// **********************************************************************************
var Program = function () {
    this.ball = new Ball();
    this.cursor = new Cursor();
    this.bricks = new Brick();
    this.score = new Score();
    this.life = new Score();
    this.slate = new Slate(this.ball, this.cursor, this.bricks, this.score, this.life);

};


Program.prototype.onClickStartPlaying = function () {
    this.slate.play();
    console.log(this.bricks);
};

Program.prototype.getGameOver = function () {
    console.log('GAME OVER');
};

Program.prototype.getWin = function () {
    this.slate.drawWin();
};



// Méthode appelée au démarrage de l'application.
Program.prototype.start = function () {
    $('#startPlaying').on('click', this.onClickStartPlaying.bind(this));
    $(document).on('game:game-over', this.getGameOver).bind(this);
    $(document).on('game:game-win', this.getWin).bind(this);
};
