let deck           = [];
const suits        = ['C','D','H','S'];
const specialCards = ['A','J','Q','K'];

let playerScore   = 0,
    computerScore = 0

// HTML References
const btnTakeCard  = document.querySelector('#btnTakeCard');
const scores = document.querySelectorAll('small');

// Function that creates a new shuffled deck.
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

// Function to take a card from the deck.
const takeCard = () => {

  if ( deck.length === 0 ) {
    throw 'There are no cards on the deck';
  }

  const card = deck.pop();
  return card;
}


// Function checking the card's value
const cardValue = ( card ) => {

  const value  = card.substring(0, card.length - 1);

  return ( isNaN( value )) ?
         ( value === 'A' ) ? 11 : 10
         : parseInt( value );
}



createDeck();

// Eventos
btnTakeCard.addEventListener('click', () => {
  
  const card = takeCard();
  playerScore += cardValue( card );
  scores[0].innerText = playerScore;
});