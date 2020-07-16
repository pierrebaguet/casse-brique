'use strict';

var Slate = function (ball, cursor, bricks, score, life){
    this.canvas = document.getElementById('game');
    this.context = this.canvas.getContext('2d');
    this.currentLocation = null;
    this.isPlaying = false;
    this.ball = ball;
    this.score = score;
    this.life = life;
    this.lifeScore = 3;
    this.cursor = cursor;
    this.move = null;
    this.gameStatus = null;
    this.bricks = bricks;
    this.ballPosition = {
        x: 0,
        y: 0
    };
    this.ballOffsetPosition = {
        dx: -2,
        dy: -1
    };
    this.count = this.bricks.rowCount * this.bricks.columnCount;

    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
};

Slate.prototype.play = function (){
    this.isPlaying = true;
    if (this.isPlaying) {
        this.ball.setSize(20);
        this.setBallInitialPosition();
        if (this.move === null) {
            this.move = setInterval(this.update.bind(this),0.5);
        }
    }
};

Slate.prototype.setBallInitialPosition = function () {
    this.ballPosition.x = this.canvas.width / 2;
    this.ballPosition.y = this.canvas.height-30;
};

Slate.prototype.drawBall = function (){
    this.context.beginPath();
    this.context.arc(this.ballPosition.x,this.ballPosition.y, this.ball.size, 0, Math.PI*2);
    this.context.fillStyle = this.ball.color;
    this.context.fill();
    this.context.closePath();
};

// Gestion des mises à jour
Slate.prototype.update = function (){
    //MAJ position de la balle
    this.updateBallPosition();
    //MAJ position du curseur

    //On actualise l'affichage
    this.draw();
};

Slate.prototype.updateBallPosition = function (){

    // Calculs des positions de la balle
    this.ballPosition.x += this.ballOffsetPosition.dx;
    this.ballPosition.y += this.ballOffsetPosition.dy;

    //Gestion des collisions avec les briques
    for (var c = 0; c < this.bricks.columnCount; c++) {
        for (var r = 0; r < this.bricks.rowCount; r++) {
            if (this.bricks.bricks[c][r].status > 0) {
                var bX = this.bricks.bricks[c][r].x;
                var bY = this.bricks.bricks[c][r].y;
                if(
                    (this.ballPosition.y - this.ball.size < bY + this.bricks.height) &&
                    (this.ballPosition.y + this.ball.size > bY) &&
                    (this.ballPosition.x + this.ball.size > bX) &&
                    (this.ballPosition.x - this.ball.size < bX + this.bricks.width)
                ){
                    // Désactivation de la brique
                    this.bricks.bricks[c][r].status -= 1;

                    //Gestion du rebond
                    if (this.ballPosition.x <= bX || this.ballPosition.x >= bX + this.bricks.width) {
                        this.ballOffsetPosition.dx = -this.ballOffsetPosition.dx;
                    }

                    if (this.ballPosition.y <= bY || this.ballPosition.y >= bY + this.bricks.height) {
                        this.ballOffsetPosition.dy = -this.ballOffsetPosition.dy;
                    }

                    c = this.bricks.columnCount;
                    r = this.bricks.rowCount;
                    this.count --;

                    if (this.count <= 0) {
                        $.event.trigger('game:game-win');
                        this.gameStatus = 'Win';
                        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
                        clearInterval(this.move);
                    }
                }
            }
        }
    }

    Slate.prototype.drawWin = function () {
        if (this.gameStatus === 'Win') {
            this.context.font = this.score.font;
            this.context.fillStyle = this.score.color;
            this.context.fillText("Victoire", this.canvas.width/2, this.canvas.height/2);
        }
    };

    // Gestion des collisions sur l'axe X inférieur avec prise en compte du rayon de la balle
    if (this.ballPosition.x - this.ball.size <= 0) {
        this.ballPosition.x = 2 * this.ball.size - this.ballPosition.x;
        this.ballOffsetPosition.dx = -this.ballOffsetPosition.dx;
    }

    // Gestion des collision sur l'axe X supérieur
    if(this.ballPosition.x + this.ball.size >= this.canvas.width) {
        this.ballPosition.x = 2 * (this.canvas.width - this.ball.size) - this.ballPosition.x;
        this.ballOffsetPosition.dx = -this.ballOffsetPosition.dx;
    }

    // Gestion des collisions sur l'axe Y inférieur avec prise en compte du rayon de la balle
    if(this.ballPosition.y - this.ball.size <= 0) {
        this.ballPosition.y = 2 * this.ball.size - this.ballPosition.y;
        this.ballOffsetPosition.dy = -this.ballOffsetPosition.dy;
    }


    //Gestion des collisions avec le curseur
    if ((this.ballPosition.x + this.ball.size >= this.cursor.posX)
        &&
        (this.ballPosition.x - this.ball.size <= this.cursor.posX + this.cursor.width)) {
            if (this.ballPosition.y + this.ball.size > this.canvas.height-this.cursor.height) {
                this.ballOffsetPosition.dy = -this.ballOffsetPosition.dy;
                this.ballPosition.y = 2 * (this.canvas.height - this.cursor.height - this.ball.size) - this.ballPosition.y;
            }
    }

    // Gestion des collisions sur l'axe Y supérieur
    if(this.ballPosition.y + this.ball.size >= this.canvas.height) {
        this.ballPosition.y = 2 * (this.canvas.height - this.ball.size) - this.ballPosition.y;
        this.ballOffsetPosition.dy = -this.ballOffsetPosition.dy;
        this.lifeScore --;

        if (this.lifeScore <= 0) {
            $.event.trigger('game:game-over');
            this.gameStatus = 'Game Over';
            document.location.reload();
            clearInterval(this.move);
        }
    }

};

Slate.prototype.draw = function (){
    this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    this.drawBall();
    this.drawCursor();
    this.drawBricks();
    this.drawScore();
    this.drawLife();
};

Slate.prototype.drawScore = function () {
    this.context.font = this.score.font;
    this.context.fillStyle = this.score.color;
    this.context.fillText("Briques Restantes : " + this.count, 8, 20);
};

Slate.prototype.drawLife = function () {
    this.context.font = this.life.font;
    this.context.fillStyle = this.life.color;
    this.context.fillText("Vie restantes : " + this.lifeScore, this.canvas.width - 120, 20);
};

Slate.prototype.drawCursor = function (){
    this.context.beginPath();
    this.context.rect(
        this.cursor.posX,
        this.canvas.height-this.cursor.height,
        this.cursor.width,
        this.cursor.height
    );
    this.context.fillStyle = this.cursor.color;
    this.context.fill();
    this.context.closePath();
};
Slate.prototype.updateCursor = function (positionX){
    this.cursor.posX = positionX - this.cursor.width/2;

    // Limition du curseur à la fenêtre de jeu
    if (this.cursor.posX < 0) {
        this.cursor.posX = 0;
    } else if (this.cursor.posX + this.cursor.width > this.canvas.width) {
        this.cursor.posX = this.canvas.width - this.cursor.width;
    }
};

Slate.prototype.drawBricks = function (){
    for (var c = 0; c < this.bricks.columnCount; c++) {
        for (var r = 0; r < this.bricks.rowCount; r++) {
            if (this.bricks.bricks[c][r].status > 0) {
                this.context.beginPath();
                this.context.rect(this.bricks.bricks[c][r].x,this.bricks.bricks[c][r].y, this.bricks.width, this.bricks.height);
                this.context.fillStyle = this.bricks.color;
                this.context.fill();
                this.context.closePath();
            }
        }
    }
};

Slate.prototype.onMouseMove = function (event) {
    if (this.isPlaying) {

        var offset = this.canvas.getBoundingClientRect();
        var styles = window.getComputedStyle(this.canvas);
        var posX = event.clientX - offset.left - parseInt(styles.borderLeftWidth);

        this.updateCursor(posX);
    }
};
