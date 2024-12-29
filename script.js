// DOM Elements
const regionEl = document.getElementById("region");
const ingredientEl = document.getElementById("ingredient");
const guessInput = document.getElementById("guess");
const submitButton = document.getElementById("submit");
const messageEl = document.getElementById("message");

// Game keys for localStorage
const lastPlayedKey = "lastPlayedDate";
const foodIndexKey = "dailyFoodIndex";

// Game variables
let currentFood = null;

// Calculate the daily question based on the user's local date
function getDailyFood() {
  const today = new Date();
  const startDate = new Date(2024, 0, 1); // Start date: January 1, 2023
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
  guessInput.value = "";
  guessInput.disabled = false;
  submitButton.disabled = false;
}

// Check the user's guess
function checkGuess() {
  const userGuess = guessInput.value.trim().toLowerCase();
  guessInput.disabled = true;
  submitButton.disabled = true;

  if (userGuess === currentFood.name.toLowerCase()) {
    messageEl.textContent = `Correct! It's ${currentFood.name}! 🎉`;
    messageEl.style.color = "green";
  } else {
    messageEl.textContent = `Game Over! The correct answer was ${currentFood.name}.`;
    messageEl.style.color = "red";
  }
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
