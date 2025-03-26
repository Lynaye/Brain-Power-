/**
Introduction to Computing: A Net-centric Approach
================ EECS Fall 2024 ================
======== Lassonde School of Engineering ========

================== Description ==================
 * JavaScript file document for the Term Project. 
 * Guess the Colour by Areta Ahmed. 
 */

const gameGrid = document.getElementById("game-grid");
const roundNumberDisplay = document.getElementById("round-number");
const messageDisplay = document.getElementById("message");
const restartButton = document.getElementById("restart-button");
const livesDisplay = document.getElementById("lives");

let round = 1;
let lives = 3;
const totalRounds = 3;


function startGame() {
    round = 1;
    lives = 3;

    updateLivesDisplay();
    roundNumberDisplay.textContent = round;
    restartButton.classList.add("hidden");

    messageDisplay.textContent = "";
    setupRound();
}


function setupRound() {
    gameGrid.innerHTML = ""; 
    const baseColor = generateRandomColor();
    const differentColor = adjustColorShade(baseColor, 15);
    const squares = createSquares(baseColor, differentColor);

    squares.forEach(square => gameGrid.appendChild(square));
}


function createSquares(baseColor, differentColor) {
    const squares = [];
    const differentIndex = Math.floor(Math.random() * 6); 
    
    for (let i = 0; i < 6; i++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.style.backgroundColor = i === differentIndex ? differentColor : baseColor;

        square.addEventListener("click", () => handleSquareClick(i === differentIndex));
        squares.push(square);
    }


    return squares.sort(() => Math.random() - 0.5);
}


function handleSquareClick(isCorrect) {
    if (isCorrect) {
        if (round < totalRounds) {
            round++;
            roundNumberDisplay.textContent = round;
            setupRound();
        }
        
        else {
            messageDisplay.textContent = "Congratulations! You won!";
            restartButton.classList.remove("hidden");

            document.querySelector('.container').style.display = 'none';
            document.getElementById('level3Screen').style.display = 'flex';
        }
    } 
    
    else {
        loseLife();
    }
}


function updateLivesDisplay() {
    livesDisplay.textContent = "❤️".repeat(lives) + "🖤".repeat(3 - lives);
}


function loseLife() {
    lives--;
    updateLivesDisplay();

    if (lives === 0) {
        gameOver();
    } 
    
    else {
        messageDisplay.textContent = "Try again!";
    }
}


function gameOver() {
    messageDisplay.textContent = "Game Over! You've run out of lives.";
    restartButton.classList.remove("hidden");
    gameGrid.innerHTML = ""; 
}


function generateRandomColor() {
    const r = Math.floor(Math.random() * 200); // Avoid very light colors
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    return `rgb(${r}, ${g}, ${b})`;
}


function adjustColorShade(color, amount) {
    const [r, g, b] = color
        .match(/\d+/g)
        .map(Number)
        .map(value => Math.min(255, value + amount));
    return `rgb(${r}, ${g}, ${b})`;
}


restartButton.addEventListener("click", startGame);

function nextLevel() {
    // Redirect to the Game 2 page
    window.location.href = '/sudoku.html';  // Level 3
  }


startGame();
