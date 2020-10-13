// Module pattern
const game = (() => {

  "use strict";

  let deck = [];
  const suits        = ["C", "D", "H", "S"],
        specialCards = ["A", "J", "Q", "K"];

  let playersScores = [];

  // HTML References
  // Buttons
  const btnTakeCard    = document.querySelector("#btnTakeCard"),
        btnStopPlaying = document.querySelector("#btnStopPlaying"),
        btnNewGame     = document.querySelector("#btnNewGame");

  // Scores and cards containers
  const scores             = document.querySelectorAll("small"),
        playersCardsDivs   = document.querySelectorAll(".cards-container");

  // Function that initializes the game.
  const startGame = ( players = 2 ) => {
    
    deck = createDeck();
    
    playersScores = [];
    for (let i = 0; i < players; i++) {
      playersScores.push(0);
      scores[i].innerText = 0;
      playersCardsDivs[i].innerHTML = '';
    }

    btnTakeCard.disabled    = false;
    btnStopPlaying.disabled = false;
  };

  // Function that creates a new shuffled deck.
  const createDeck = () => {
    
    deck = [];

    for (let i = 2; i <= 10; i++) {
      for (let suit of suits) {
        deck.push(i + suit);
      }
    }

    for (let suit of suits) {
      for (let specialCard of specialCards) {
        deck.push(specialCard + suit);
      }
    }

    return _.shuffle(deck);
  };

  // Function to take a card from the deck.
  const takeCard = () => {

    if (deck.length === 0) {
      throw "There are no cards on the deck";
    }

    return deck.pop();
  };

  // Function checking the card's value.
  const cardValue = ( card ) => {
    
    const value = card.substring(0, card.length - 1);

    return ( isNaN( value ) ) ?
            ( value === "A" ) ? 11 : 10
            : parseInt(value);
  };

  // Function displaying the cards for each player on the board.
  const displayCard = ( card, turn ) => {

    // Create card and append it to HTML.
    const cardImg = document.createElement("img");
    cardImg.src = `./assets/cards/${card}.png`;
    cardImg.classList.add("blackjack-card");
    playersCardsDivs[turn].append(cardImg);
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

  // Turn: 0 = 1st player and last = computer.
  const accumulatePoints = ( card, turn ) => {

    // Sum points for the current player.
    playersScores[turn] += cardValue(card);
    // Display score on scoreboard for the current player.
    scores[turn].innerText = playersScores[turn];
    
    // Return updated score for current player.
    return playersScores[turn];
  };

  // Computer's turn
  const computersTurn = ( minimumPoints ) => {

    let computerScore = 0;

    do {

      // Take card from deck.
      const card = takeCard();
      // Sum points to computer's score and display them on scoreboard.
      computerScore = accumulatePoints( card, playersScores.length - 1);
      // Display the card for the computer on the board.
      displayCard( card, playersCardsDivs.length - 1 );

    } while (computerScore < minimumPoints && minimumPoints <= 21);

    whoWins();
  };

  // Eventos
  btnTakeCard.addEventListener("click", () => {

    // Take card from deck.
    const card = takeCard();
    // Add points to the current player's score and display it on scoreboard.
    const playerScore = accumulatePoints( card, 0 );
    // Display the card for the player on the board.
    displayCard( card, 0 );

    // Check if player has won.
    if (playerScore > 21) {
      btnTakeCard.disabled = true;
      btnStopPlaying.disabled = true;
      computersTurn(playerScore);
    } else if (playerScore === 21) {
      computersTurn(playerScore);
      btnStopPlaying.disabled = true;
    }

  });

  btnStopPlaying.addEventListener("click", () => {

    btnTakeCard.disabled = true;
    btnStopPlaying.disabled = true;
    computersTurn(scores[0]);

  });

  btnNewGame.addEventListener("click", () => {

    startGame();

  });

  // The startGame funtion is now public as the method "newGame" of the game
  // function (which is automatically called whit the module pattern).
  return {
    newGame: startGame,
  }

})();
