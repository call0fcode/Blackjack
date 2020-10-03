let deck           = [];
const suits        = ['C','D','H','S'];
const specialCards = ['A','J','Q','K'];

let playerScore   = 0,
    computerScore = 0

// HTML References
const btnTakeCard      = document.querySelector('#btnTakeCard');
const btnStopPlaying   = document.querySelector('#btnStopPlaying');
const scores           = document.querySelectorAll('small');
const playerCardsDiv   = document.querySelector('#player-cards');
const computerCardsDiv = document.querySelector('#computer-cards');

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

// Computer's turn
const computersTurn = ( minimumPoints ) => {

  do {
    // Take card from deck.
    const card = takeCard();
    computerScore += cardValue( card );
    // Display score on HTML.
    scores[1].innerText = computerScore;
  
    // Create card and append it to HTML.
    const cardImg = document.createElement('img');
    cardImg.src = `./assets/cards/${card}.png`;
    cardImg.classList.add('blackjack-card');
    computerCardsDiv.append( cardImg );

    if ( minimumPoints > 21 ) { break; }

  } while ( (computerScore < minimumPoints) && (minimumPoints <= 21) );

  ( computerScore === playerScore ) ? alert('Tie!') :
  ( playerScore > 21 ) ? alert('Computer wins!') : 
  ( computerScore > playerScore && computerScore <= 21) ? alert('Computer wins!') :
  alert('You won!');
}
 
createDeck();

// Eventos
btnTakeCard.addEventListener('click', () => {
  
  // Take card from deck.
  const card = takeCard();
  playerScore += cardValue( card );
  // Display score on HTML.
  scores[0].innerText = playerScore;

  // Create card and append it to HTML.
  const cardImg = document.createElement('img');
  cardImg.src = `./assets/cards/${card}.png`;
  cardImg.classList.add('blackjack-card');
  playerCardsDiv.append( cardImg );

  // Check if player has won.
  if ( playerScore > 21 ) {
    btnTakeCard.disabled    = true;
    btnStopPlaying.disabled = true;
    computersTurn( playerScore );
  } else if ( playerScore === 21 ) {
    computersTurn( playerScore );
    btnStopPlaying.disabled = true;
  }
});

btnStopPlaying.addEventListener('click', () => {

  btnTakeCard.disabled    = true;
  btnStopPlaying.disabled = true;
  computersTurn( playerScore );
});