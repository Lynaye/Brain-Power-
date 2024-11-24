let lives = 3;  

/* Start game1 */
function startGame() {
  /* Hide the start screen */
  document.getElementById('startScreen').style.display = 'none';

  /* Show the game container */
  document.querySelector('.container').style.display = 'flex';

  /* Fetch game data from the server */
  fetch('/start-game')
    .then(response => response.json())
    .then(data => {
      const { animals, targetAnimal } = data;

      /* Store the targetAnimal globally for later comparison */
      window.targetAnimal = targetAnimal;

      // Assign animals to buttons
      assignAnimalsToButtons(animals);

      console.log('Target Animal:', window.targetAnimal); // Debugging line
    })
    .catch(error => console.error('Error fetching game data:', error));
}

/* Assign the shuffled animals to the buttons */
function assignAnimalsToButtons(animals) {
  const buttons = document.querySelectorAll('.btn'); 

  /* Assign images to the four choice buttons */
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];

    /* This is for the animal being guessed */
    if (i === 0) {  
      const targetAnimal = window.targetAnimal;
      button.style.backgroundImage = `url(${targetAnimal.image})`;
      button.style.backgroundSize = 'cover';
      button.style.backgroundPosition = 'center';
      button.style.backgroundRepeat = 'no-repeat';
      button.dataset.animal = targetAnimal.image; /* This saves it to confirm later when animal being guessed */

      /* Play the sound associated with the target animal when the target button is clicked */
      button.addEventListener('click', function() {
        playSound(targetAnimal.sound);  // Play the sound associated with the target animal
      });

      // Ensure the target button is hidden initially
      button.style.filter = 'brightness(0)';  // Hide it by darkening
    } else {  // Assign images to the other buttons (choices)
      const animal = animals[i - 1];  // Skip the first one, since it's the target button
      button.style.backgroundImage = `url(${animal.image})`;
      button.style.backgroundSize = 'cover';
      button.style.backgroundPosition = 'center';
      button.style.backgroundRepeat = 'no-repeat';
      button.dataset.animal = animal.image;  /* This saves it to confirm later when animal being guessed */
    }
  }
}

/* Hint function, plays a sound when animal being guessed is clicked */
function playSound(animalSoundId) {
  const sound = document.getElementById(animalSoundId); // Get the audio element by ID
  if (sound) {
    sound.play();  // Play the sound associated with the animal
  }
}

// Guess the selected button
function guess(buttonIndex) {
  const guessedButton = document.getElementById(buttonIndex);
  const guessedAnimal = guessedButton.dataset.animal; // Get the guessed animal from the dataset

  console.log('Guessed Animal:', guessedAnimal);  // Debugging line

  // Compare the guessed animal with the target animal
  if (guessedAnimal === window.targetAnimal.image) {
    handleCorrectGuess(guessedButton);
  } else {
    handleIncorrectGuess();
  }
}

// Handle correct guess
function handleCorrectGuess(guessedButton) {
  // First, reveal the target button by removing the filter
  const targetButton = document.querySelector('.target-button');
  targetButton.style.filter = 'none';  // Unveil the target button

  // Play the sound associated with the target animal
  playSound(window.targetAnimal.sound);

  // Add the 'correct' class for animation (shake and enlarge)
  guessedButton.classList.add('correct');  // Add 'correct' class to guessed button

  // Trigger animation on the target button
  targetButton.classList.add('correct');  // Add 'correct' class to the target button for animation

  // After animation ends, move to the next level
  setTimeout(() => {
    alert('Correct!');
    // Show level 2 screen with next button
    document.querySelector('.container').style.display = 'none';
    document.getElementById('level2Screen').style.display = 'flex';
  }, 2000);  // Wait for the animation to finish (2 seconds to allow for animations)
}

/* Handle incorrect guess */
function handleIncorrectGuess() {
  /* This will show an image of "x" when incorrect guess made */
  const incorrectImage = document.createElement('img');
  incorrectImage.src = 'img/incorrect.png';
  incorrectImage.classList.add('incorrect-overlay');
  document.body.appendChild(incorrectImage);

  // Make sure the image stays on top and visible
  incorrectImage.style.position = 'absolute';
  incorrectImage.style.top = '50%';
  incorrectImage.style.left = '50%';
  incorrectImage.style.transform = 'translate(-50%, -50%)';
  incorrectImage.style.zIndex = '9999';  // Ensure it's above other elements
  incorrectImage.style.opacity = '1';
  incorrectImage.style.animation = 'fadeOut 1s forwards';  // Apply fade-out animation

  // Remove the image after a brief timeout
  setTimeout(() => {
    document.body.removeChild(incorrectImage);  // Remove incorrect image after 1 second
  }, 1000);

  // Deduct a life
  loseLife();
}

/* Losing a life function*/
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

/* Game over function*/
function gameOver() {
  document.getElementById('gameOverScreen').style.display = 'block';
  document.querySelector('.container').style.display = 'none';  
}

/* Restart the game function*/
function restartGame() {
  /* Reset lives */
  lives = 3;
  document.getElementById('life1').style.display = 'block';
  document.getElementById('life2').style.display = 'block';
  document.getElementById('life3').style.display = 'block';
  
  /* Hide the game over screen and goes back to start screen */
  document.getElementById('gameOverScreen').style.display = 'none';
  startGame();
}

/* Wait for the DOM content to be loaded and then initialize the start button */
document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('startButton');

  if (startButton) {
    startButton.addEventListener('click', startGame());
  } else {
    console.error('Start button not found!');
  }
});

export { startGame, guess, loseLife };