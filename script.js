// DOM Elements
const regionEl = document.getElementById("region");
const ingredientEl = document.getElementById("ingredient");
const guessInput = document.getElementById("guess");
const submitButton = document.getElementById("submit");
const messageEl = document.getElementById("message");
const attemptsEl = document.getElementById("attempts");

// Game keys for localStorage
const lastPlayedKey = "lastPlayedDate";
const foodIndexKey = "dailyFoodIndex";

// Game variables
let currentFood = null;
let attempts = 3;

// Calculate the daily question based on the user's local date
function getDailyFood() {
  const startDate = new Date(2023, 0, 1); // Start date: January 1, 2023
  const today = new Date();
  const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  return foodList[daysSinceStart % foodList.length]; // Cycle through food list
}

// Initialize the game
function initializeGame() {
  const todayLocal = new Date().toLocaleDateString(); // Get local date in "MM/DD/YYYY" format
  const lastPlayedDate = localStorage.getItem(lastPlayedKey);

  if (lastPlayedDate === todayLocal) {
    // If already played today, disable the game
    disableGame();
  } else {
    // Store today's date and initialize the game
    localStorage.setItem(lastPlayedKey, todayLocal);
    currentFood = getDailyFood();
    setupGame();
  }
}

// Setup the game (first and only attempt)
function setupGame() {
  ingredientEl.textContent = `Ingredients: ${currentFood.ingredients.join(", ")}`;
  regionEl.textContent = "";
  messageEl.textContent = "";
  attemptsEl.textContent = `Attempts left: ${attempts}`;
  guessInput.value = "";
  guessInput.disabled = false;
  submitButton.disabled = false;
}

// Check the user's guess
function checkGuess() {
  const userGuess = guessInput.value.trim().toLowerCase();
  if (userGuess === currentFood.name.toLowerCase()) {
    // Correct guess
    messageEl.textContent = `Correct! It's ${currentFood.name}! 🎉`;
    messageEl.style.color = "green";
    endGame();
  } else {
    // Wrong guess
    attempts--;
    if (attempts === 2) {
      // Reveal the region after the first incorrect guess
      regionEl.textContent = `Region: ${currentFood.region}`;
      messageEl.textContent = "Wrong! Here's another clue.";
    } else if (attempts === 1) {
      // Reveal the hint after the second incorrect guess
      regionEl.textContent = `Hint: ${currentFood.hint}`;
      messageEl.textContent = "Wrong again! Here's your final clue.";
    } else {
      // Out of attempts
      messageEl.textContent = `Game Over! The correct answer was ${currentFood.name}.`;
      messageEl.style.color = "red";
      endGame();
    }
    messageEl.style.color = "red";
    attemptsEl.textContent = `Attempts left: ${attempts}`;
  }
}

// End the game after 3 guesses or a correct answer
function endGame() {
  guessInput.disabled = true;
  submitButton.disabled = true;
}

// Disable the game (if already played)
function disableGame() {
  const lastFood = getDailyFood();
  ingredientEl.textContent = `Ingredients: ${lastFood.ingredients.join(", ")}`;
  regionEl.textContent = "You’ve already played today! Come back tomorrow.";
  guessInput.disabled = true;
  submitButton.disabled = true;
}

// Event listeners
submitButton.addEventListener("click", checkGuess);
window.addEventListener("load", initializeGame);
