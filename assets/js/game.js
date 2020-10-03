let deck = [];
const suits = ["C", "D", "H", "S"];
const specialCards = ["A", "J", "Q", "K"];

let playerScore = 0,
  computerScore = 0;

// HTML References
const btnTakeCard = document.querySelector("#btnTakeCard");
btnTakeCard.disabled = true; // Button disabled on game start.
const btnStopPlaying = document.querySelector("#btnStopPlaying");
btnStopPlaying.disabled = true; // Button disabled on game start.
const btnNewGame = document.querySelector("#btnNewGame");


const scores = document.querySelectorAll("small");
const playerCardsDiv = document.querySelector("#player-cards");
const computerCardsDiv = document.querySelector("#computer-cards");

// Function that creates a new shuffled deck.
const createDeck = () => {
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

  deck = _.shuffle(deck);

  return deck;
};

// Function that initializes the game.
const startGame = (players = 2) => {

  deck = createDeck();

  playersScore = [];
  for (let i = 0; i < players; i++) {
    playersScore.push(0);
  }

  scores.forEach((elem) => (elem.innerText = 0));
  playerScore = 0;
  computerScore = 0;
  playerCardsDiv.innerHTML = "";
  computerCardsDiv.innerHTML = "";

  btnTakeCard.disabled = false;
  btnStopPlaying.disabled = false;
};

// Function to take a card from the deck.
const takeCard = () => {
  if (deck.length === 0) {
    throw "There are no cards on the deck";
  }

  const card = deck.pop();
  return card;
};

// Function checking the card's value
const cardValue = (card) => {
  const value = card.substring(0, card.length - 1);

  return isNaN(value) ? (value === "A" ? 11 : 10) : parseInt(value);
};

// Computer's turn
const computersTurn = (minimumPoints) => {
  do {
    // Take card from deck.
    const card = takeCard();
    computerScore += cardValue(card);
    // Display score on HTML.
    scores[1].innerText = computerScore;

    // Create card and append it to HTML.
    const cardImg = document.createElement("img");
    cardImg.src = `./assets/cards/${card}.png`;
    cardImg.classList.add("blackjack-card");
    computerCardsDiv.append(cardImg);

    if (minimumPoints > 21) {
      break;
    }
  } while (computerScore < minimumPoints && minimumPoints <= 21);

  setTimeout(() => {
    computerScore === playerScore
      ? alert("Tie!")
      : playerScore > 21
      ? alert("Computer wins!")
      : computerScore > playerScore && computerScore <= 21
      ? alert("Computer wins!")
      : alert("You won!");
  }, 100);
};

// Eventos
btnTakeCard.addEventListener("click", () => {
  // Take card from deck.
  const card = takeCard();
  playerScore += cardValue(card);
  // Display score on HTML.
  scores[0].innerText = playerScore;

  // Create card and append it to HTML.
  const cardImg = document.createElement("img");
  cardImg.src = `./assets/cards/${card}.png`;
  cardImg.classList.add("blackjack-card");
  playerCardsDiv.append(cardImg);

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
  computersTurn(playerScore);
});

btnNewGame.addEventListener("click", () => {
  startGame();
});