let deck           = [];
const suits        = ['C','D','H','S'];
const specialCards = ['A','J','Q','K'];

const createDeck = () => {

  for ( let i = 2; i <= 10; i++ ) {
    for( let suit of suits ) {
      deck.push( i + suit );
    }
  }

  for ( let suit of suits ) {
    for ( let specialCard of specialCards ) {
      deck.push( specialCard + suit );
    }
  }

  deck = _.shuffle( deck );

  return deck;

}

createDeck();