'use strict';

// ************************************
//            CODE PRINCIPAL
// ************************************
/*
 * Installation d'un gestionnaire d'évènement déclenché quand l'arbre DOM sera
 * totalement construit par le navigateur.
 *
 * Le gestionnaire d'évènement est une fonction anonyme que l'on donne directement à jQuery.
 */
$(function(){
    var cassebrique;

    // Création puis démarrage de l'application.
    cassebrique = new Program();
    cassebrique.start();
});
