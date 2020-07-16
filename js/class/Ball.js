'use strict';

var Ball = function (){
    this.color = 'lime';
    this.size = 5;
    this.state = 1
}

Ball.prototype.configure = function (context) {
    context.fillStyle = this.color;
};

// Méthode de configuration de la couleur du crayon (valeur HTML hexadécimale ou nom de couleur CSS prédéfini)
Ball.prototype.setColor = function (color) {
    this.color = color;
};

// Méthode de configuration de l'épaisseur du crayon.
Ball.prototype.setSize = function (size) {
    this.size = size;
};
