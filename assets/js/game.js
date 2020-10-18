// Module pattern
const game = (() => {
  'use strict';

  /*
   * VARIABLES
   *************/

  let deck    = [];

  // Creates an array with all cards possible of a deck (52).
  const cards = (() => {
    
    let cards          = [];
    const suits        = ["C", "D", "H", "S"],
          specialCards = ["A", "J", "Q", "K"];

    for (let i = 2; i <= 10; i++) {
      for (let suit of suits) {
        cards.push(i + suit);
      }
    }

    for (let suit of suits) {
      for (let specialCard of specialCards) {
        cards.push(specialCard + suit);
      }
    }

    return cards;
  })();

  const numOfPlayers = 2;
  let playersScores  = new Array( numOfPlayers );



  /*
   * HTML REFERENCES
   *******************/

  // Buttons
  const btnNewGame     = document.querySelector( '#btnNewGame' ),
        btnTakeCard    = document.querySelector( '#btnTakeCard' ),
        btnStopPlaying = document.querySelector( '#btnStopPlaying' );

  // Scores and cards containers
  const scores             = document.querySelectorAll( 'small' ),
        playersCardsDivs   = document.querySelectorAll( '.cards-container' );



  /*
   * FUNCTIONS
   *************/

  // IIFE that preloads all images in order them to be cached.
  (() => {

    cards.forEach( ( card ) => {
      const img = new Image();
      img.src = `./assets/cards/${card}.png`;
      // img.onload = () => console.log(`${card} loaded`);
    });
  })();

  // Function that initializes / resets the game.
  const startGame = () => {
    
    deck = shuffleDeck( cards );
    
    // Reset scores to zero for each player (internal scores and HTML).
    for ( let i = 0; i < numOfPlayers; i++ ) {
      playersScores[i] = 0;
      scores[i].innerText = 0;
      playersCardsDivs[i].innerHTML = '';
    }

    // Enable game buttons.
    btnTakeCard.disabled    = false;
    btnStopPlaying.disabled = false;
  };

  // Function that shuffles all cards.
  const shuffleDeck = ( cards ) => {

    return _.shuffle( cards );
  };

  // Function to take a card from the deck.
  const takeCard = () => {

    if ( deck.length === 0 ) {
      throw 'There are no cards on the deck';
    }

    return deck.pop();
  };

  // Function checking the card's value.
  const cardValue = ( card ) => {
    
    const value = card.substring( 0, card.length - 1 );

    return ( isNaN( value ) )
           ? ( value === "A" )
             ? 11
             : 10
           : parseInt( value );
  };

  // Turns: 0 = 1st player, 1 = 2nd player, ... and last = computer.
  const accumulatePoints = ( card, turn ) => {

    // Sum points for the current player.
    playersScores[turn] += cardValue( card );
    // Display score on scoreboard for the current player.
    scores[turn].innerText = playersScores[turn];
    
    // Return updated score for current player.
    return playersScores[turn];
  };

  // Function displaying the cards for each player on the board.
  const displayCard = ( card, turn ) => {

    // Create card and append it to the HTML.
    const cardImg = document.createElement('img');
    cardImg.src = `./assets/cards/${card}.png`;
    cardImg.classList.add("blackjack-card");
    playersCardsDivs[turn].append(cardImg);
  };

  // Computer's turn
  const computersTurn = ( minimumPoints ) => {

    let computerScore = 0;

    do {

      // Take card from deck.
      const card = takeCard();
      // Sum points to computer's score and display them on scoreboard.
      computerScore += accumulatePoints( card, playersScores.length - 1);
      // Display the card for the computer on the board.
      displayCard( card, playersCardsDivs.length - 1 );

    } while (computerScore < minimumPoints && minimumPoints <= 21);

    whoWins();
  };

  // Function that checks for a winner.
  const whoWins = () => {

    const [ minimumPoints, computerScore ] = playersScores;

    setTimeout(() => {
      computerScore === minimumPoints
        ? alert("Tie!")
        : minimumPoints > 21
        ? alert("Computer wins!")
        : computerScore > minimumPoints && computerScore <= 21
        ? alert("Computer wins!")
        : alert("You win!");
    }, 100);
  };



  /*
   * EVENTS
   **********/

  btnTakeCard.addEventListener( "click", () => {

    // Take card from deck.
    const card = takeCard();
    // Add points to the current player's score and display it on scoreboard.
    const playerScore = accumulatePoints( card, 0 );
    // Display the card for the player on the board.
    displayCard( card, 0 );

    // Every time the player draws a card, check for computer's turn to start.
    if ( playerScore >= 21 ) {
      btnTakeCard.disabled = true;
      btnStopPlaying.disabled = true;
      computersTurn(playerScore);
    }

  });

  btnStopPlaying.addEventListener( "click", () => {

    btnTakeCard.disabled = true;
    btnStopPlaying.disabled = true;
    computersTurn(scores[0]);

  });

  btnNewGame.addEventListener( "click", () => {

    startGame();

  });

  // The "startGame" function is public and can be called as "newGame", which is
  // a method of the "game" function (automatically called with module pattern).
  return {
    newGame: startGame,
  }

})();
