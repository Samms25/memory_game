const themes = {
  fruits: ['apple.jpg', 'banana.jpg', 'grapes.jpg', 'watermelon.jpg', 'cherry.jpg', 'pineapple.jpg', 'strawberry.jpg', 'orange.jpg'],
  flowers: ['rose.jpg', 'tulip.jpg', 'lily.jpg', 'sunflower.jpg', 'adenium.jpg', 'dandelion.jpg', 'plumeria.jpg', 'lotus.jpg'],
  fish: ['blue.jpg', 'butterfly.jpg', 'clownfish.jpg', 'elegant.jpg', 'idol.jpg', 'lionfish.jpg', 'orental.jpg', 'fighter.jpg']
};

// Get selected theme from localStorage or default to 'fruits'
const selectedTheme = localStorage.getItem("selectedTheme") || "fruits";

// Update background based on selected theme
window.addEventListener('DOMContentLoaded', function() {
  const selectedTheme = localStorage.getItem("selectedTheme");

  // Remove previous theme classes
  document.body.classList.remove('fruits-theme', 'flowers-theme', 'fish-theme');
  
  // Apply new theme class
  if (selectedTheme) {
      document.body.classList.add(`${selectedTheme}-theme`);
  }
});

const cardImages = themes[selectedTheme];  // Get the images for the selected theme
let shuffledCards = [...cardImages, ...cardImages];  // Double the images for pairs
shuffledCards = shuffle(shuffledCards);  // Shuffle the images

let flippedCards = [];
let matchedCards = [];
let score = 0;
let timer;
let time = 0;
let timerInterval;
let totalPairs = cardImages.length; // Total pairs in the game

// Create the game board
function createBoard() {
  const board = document.getElementById('game-board');
  board.innerHTML = '';  // Clear the board

  shuffledCards.forEach((image, index) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.value = image;
      card.dataset.index = index;

      const front = document.createElement('div');
      front.classList.add('front');

      const img = document.createElement('img');
      img.src = `images/${image}`;
      img.alt = "card image";
      front.appendChild(img);

      card.appendChild(front);
      card.addEventListener('click', flipCard);

      board.appendChild(card);
  });
}

// Shuffle function to randomize the cards
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];  // Swap elements
  }
  return array;
}

// Flip the card
function flipCard() {
  if (flippedCards.length < 2 && !this.classList.contains('flipped') && !matchedCards.includes(this.dataset.index)) {
      this.classList.add('flipped');
      flippedCards.push(this);

      if (flippedCards.length === 2) {
          checkMatch();
      }
  }
}

// Check if the flipped cards match
function checkMatch() {
  const [firstCard, secondCard] = flippedCards;
  const firstValue = firstCard.dataset.value;
  const secondValue = secondCard.dataset.value;

  if (firstValue === secondValue) {
      score += 10;
      matchedCards.push(firstCard.dataset.index, secondCard.dataset.index);
      flippedCards = [];
      updateScore();
      checkGameOver(); // Check if the game is over
  } else {
      setTimeout(() => {
          firstCard.classList.remove('flipped');
          secondCard.classList.remove('flipped');
          flippedCards = [];
      }, 1000);
  }
}

// Update score
function updateScore() {
  document.getElementById('score').textContent = score;
}

// Timer function
function startTimer() {
  timerInterval = setInterval(() => {
      time++;
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      document.getElementById('timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, 1000);
}

// Check if the game is over (all pairs matched)
function checkGameOver() {
  if (matchedCards.length === shuffledCards.length) {
      clearInterval(timerInterval); // Stop the timer
      setTimeout(() => {
          displayCongratulations(); // Show congratulations message
      }, 500); // Delay to allow final match to flip
  }
}

// Display the congratulations message
function displayCongratulations() {
  const message = document.createElement('div');
  message.classList.add('congratulations');
  message.innerHTML = `
      <h2>Congratulations!</h2>
      <p>You have completed the game!</p>
      <p>Time: ${document.getElementById('timer').textContent}</p>
      <p>Score: ${score}</p>
  `;
  document.body.appendChild(message);
}

// Start the game
function startGame() {
  createBoard();
  startTimer();
}

// Initialize the game
startGame();
