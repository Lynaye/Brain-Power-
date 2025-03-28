/**
Introduction to Computing: A Net-centric Approach
================ EECS Fall 2024 ================
======== Lassonde School of Engineering ========

================ Description ================
 * Javascript file document for the Term Project. 
 * Animal Guessing Game by Lynda Trinh. 
 */

let lives = 3;  

// Start the game and display the Level 1 screen
function level1() {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('level1Screen').style.display = 'flex'; // Correct the ID to match the HTML
}

// When the "Next" button in Level 1 is clicked, proceed to the game container
function startGame() {
  document.getElementById('level1Screen').style.display = 'none';  // Hide Level 1 screen
  document.querySelector('.container').style.display = 'flex';  // Show the actual game container

  // Fetch game data from the server
  fetch('/start-game')
      .then(response => response.json())
      .then(data => {
          const { animals, targetAnimal } = data;

          // Store the targetAnimal globally for later comparison
          window.targetAnimal = targetAnimal;

          // Assign animals to buttons
          assignAnimalsToButtons(animals);
      })
      .catch(error => console.error('Error fetching game data:', error));
}

// Function to assign the shuffled animals to the buttons
function assignAnimalsToButtons(animals) {
  const buttons = document.querySelectorAll('.btn'); 

  // Assign images to the four choice buttons 
  for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];

      // This is for the animal being guessed 
      if (i === 0) {  
          const targetAnimal = window.targetAnimal;
          button.style.backgroundImage = `url(${targetAnimal.image})`;
          button.style.backgroundSize = 'cover';
          button.style.backgroundPosition = 'center';
          button.style.backgroundRepeat = 'no-repeat';
          button.dataset.animal = targetAnimal.image; // This saves it to confirm later when animal being guessed 

          /* Play the sound associated with the target animal when the target button is clicked */
          button.addEventListener('click', function() {
              playSound(targetAnimal.sound); 
          });

          // Ensure the target button is hidden initially
          button.style.filter = 'brightness(0)';  
      } else {  // Assign images to the other buttons (choices)
          const animal = animals[i - 1];  // Skip the first one, since it's the target button
          button.style.backgroundImage = `url(${animal.image})`;
          button.style.backgroundSize = 'cover';
          button.style.backgroundPosition = 'center';
          button.style.backgroundRepeat = 'no-repeat';
          button.dataset.animal = animal.image;  // This saves it to confirm later when animal being guessed 
      }
  }
}

// Hint function, plays a sound when animal being guessed is clicked
function playSound(animalSoundId) {
  const sound = document.getElementById(animalSoundId); // Get the audio element by ID
  if (sound) {
      sound.play();  // Play the sound associated with the animal
  }
}

// Function to compare correct answer
function guess(buttonIndex) {
  const guessedButton = document.getElementById(buttonIndex);
  const guessedAnimal = guessedButton.dataset.animal; // Get the guessed animal from the dataset

  // Compare the guessed animal with the target animal
  if (guessedAnimal === window.targetAnimal.image) {
      handleCorrectGuess(guessedButton);
  } else {
      handleIncorrectGuess();
  }
}

// Correct guess
function handleCorrectGuess(guessedButton) {

  const targetButton = document.querySelector('.target-button');
  targetButton.style.filter = 'none';  // Unveil the target button

  // Play the sound associated with the target animal
  playSound(window.targetAnimal.sound);

  // Add the 'correct' class for animation
  guessedButton.classList.add('correct');  

  // Trigger animation on the target button
  targetButton.classList.add('correct'); 

  // After animation ends, move to the next level
  setTimeout(() => {
      // Show level 2 screen with next button
      document.querySelector('.container').style.display = 'none';
      document.getElementById('level2Screen').style.display = 'flex';
  }, 2000);  // Wait for the animation to finish (2 seconds to allow for animations)
}

// Incorrect guess
function handleIncorrectGuess() {
  // This will show an image of "x" when incorrect guess made 
  const incorrectImage = document.createElement('img');
  incorrectImage.src = 'img/incorrect.png';
  incorrectImage.classList.add('incorrect-overlay');
  document.body.appendChild(incorrectImage);

  // Make sure the image stays on top and visible
  incorrectImage.style.position = 'absolute';
  incorrectImage.style.top = '50%';
  incorrectImage.style.left = '50%';
  incorrectImage.style.transform = 'translate(-50%, -50%)';
  incorrectImage.style.zIndex = '10';  // Ensure it's above other elements
  incorrectImage.style.opacity = '1';
  incorrectImage.style.animation = 'fadeOut 1s forwards';  // Apply fade-out animation

  // Remove the image after a brief timeout
  setTimeout(() => {
      document.body.removeChild(incorrectImage); 
  }, 1000);

  // Deduct a life
  loseLife();
}

// Losing a life function
function loseLife() {
  if (lives > 0) {
      lives--; 
      const lifeIcon = document.getElementById(`life${lives}`);
      if (lifeIcon) {
          lifeIcon.style.display = 'none';
      }

      if (lives === 0) {
          gameOver();
      }
  }
}

// Game over function
function gameOver() {
  document.getElementById('gameOverScreen').style.display = 'block';
  document.querySelector('.container').style.display = 'none';  
}

// Restart the game function
function restartGame() {
  // Reset lives 
  lives = 3;
  document.getElementById('life1').style.display = 'block';
  document.getElementById('life2').style.display = 'block';
  document.getElementById('life3').style.display = 'block';
  
  // Hide the game over screen and go back to the start screen 
  document.getElementById('gameOverScreen').style.display = 'none';
  startGame();
}

function nextLevel() {
  // Redirect to the Game 2 page
  window.location.href = '/maingame.html';  // Level 2
}

// Wait for the DOM content to be loaded and then initialize the start button 
document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('startButton');

  if (startButton) {
      
      startButton.addEventListener('click', level1);  // Ensure the start button triggers the level1 function
  } else {
      console.error('Start button not found!');
  }
});