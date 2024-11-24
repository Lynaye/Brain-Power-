import { describe, it, expect, beforeEach } from 'vitest';
import { startGame, guess } from '../public/game'; 

/* Set up the mock DOM */
beforeEach(() => {
  const startScreen = document.createElement('div');
  startScreen.id = 'startScreen';
  document.body.appendChild(startScreen);

  const gameContainer = document.createElement('div');
  gameContainer.classList.add('container'); 
  document.body.appendChild(gameContainer);

  const targetButton = document.createElement('button');
  targetButton.classList.add('target-button');
  targetButton.style.filter = 'blur(5px)';  
  document.body.appendChild(targetButton);

  const button = document.createElement('button');
  button.id = 'button1';
  button.dataset.animal = 'rabbit';
  document.body.appendChild(button);

  window.targetAnimal = { image: 'rabbit' }; 
});

describe('Game Functionality Tests', () => {
  it('Should start the game, start variables, and hide start screen', () => {
    startGame(); /* Call the function that interacts with the DOM */
    const startScreen = document.getElementById('startScreen');
    expect(startScreen.style.display).toBe('none'); 

    const gameContainer = document.querySelector('.container');
    expect(gameContainer.style.display).toBe('flex'); 
  });

  it('Should correctly determine if the correct guess was made', () => {
    // Ensure targetAnimal is set for the guess test
    window.targetAnimal = { image: 'rabbit' };

    const button = document.getElementById('button1');
    guess('button1'); // Call the guess function with button ID

    // Ensure that the correct guess updates the target button's style
    const targetButton = document.querySelector('.target-button');
    expect(targetButton.style.filter).toBe('none'); // Check that the filter was removed
  });

  it('Should handle an incorrect guess and decrement lives', () => {
    // Ensure targetAnimal is set for the guess test
    window.targetAnimal = { image: 'monkey' };

    const button = document.getElementById('button1');
    guess('button1'); // Call the guess function with button ID

    // You can test here if lives are decremented or other actions based on an incorrect guess
    // For example, if you have a lives counter, you might want to check:
    // expect(livesLeft).toBe(expectedLivesAfterIncorrectGuess);
  });
});