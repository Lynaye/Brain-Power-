import { describe, it, expect, beforeEach, vi } from 'vitest';
import { startGame, guess } from '../public/game';

// Set up the mock DOM before each test
beforeEach(() => {
  const startScreen = document.createElement('div');
  startScreen.id = 'startScreen';
  document.body.appendChild(startScreen);

  const gameContainer = document.createElement('div');
  gameContainer.classList.add('container'); 
  document.body.appendChild(gameContainer);

  const targetButton = document.createElement('button');
  targetButton.classList.add('target-button');
  targetButton.style.filter = 'brightness(0)';  
  document.body.appendChild(targetButton);

  // Set up buttons for the guesses
  const button = document.createElement('button');
  button.id = 'button1';
  button.dataset.animal = 'rabbit';
  document.body.appendChild(button);

  // Set up the life icons
  const life1 = document.createElement('div');
  life1.id = 'life1';
  document.body.appendChild(life1);

  const life2 = document.createElement('div');
  life2.id = 'life2';
  document.body.appendChild(life2);

  const life3 = document.createElement('div');
  life3.id = 'life3';
  document.body.appendChild(life3);

  // Set initial game state with a valid image URL
  window.targetAnimal = { image: 'images/rabbit.jpg', sound: 'rabbit-sound' }; 
  window.lives = 3; // Set initial lives
});

// Mock the sound element to avoid actually playing audio during tests
vi.stubGlobal('playSound', vi.fn()); // Create a mock function for playSound

// Mock the fetch to return predefined game data
vi.mock('fetch', () => {
  return vi.fn().mockResolvedValue({
    json: () => Promise.resolve({
      animals: [{ image: 'images/rabbit.jpg' }, { image: 'images/cat.jpg' }],
      targetAnimal: { image: 'images/rabbit.jpg', sound: 'rabbit-sound' }
    })
  });
});

describe('Game Functionality Tests', () => {

  it('Should start the game, hide the start screen, and show the game container', async () => {
    await startGame(); // Wait for the game setup to finish

    const startScreen = document.getElementById('startScreen');
    expect(startScreen.style.display).toBe('none'); // Check that start screen is hidden

    const gameContainer = document.querySelector('.container');
    expect(gameContainer.style.display).toBe('flex'); // Check that the game container is displayed
  });

  it('Should have 3 life icons populated initially', () => {
    startGame(); // Call the function to start the game

    // Check that the life icons are present in the DOM
    const life1 = document.getElementById('life1');
    const life2 = document.getElementById('life2');
    const life3 = document.getElementById('life3');
    
    // Assert that all three life elements exist
    expect(life1).toBeDefined();
    expect(life2).toBeDefined();
    expect(life3).toBeDefined();
  });

  it('Should handle an incorrect guess and not play sound for wrong guesses', () => {
    startGame(); // Call the function that interacts with the DOM

    // Set up a wrong guess scenario by changing the target animal
    window.targetAnimal = { image: 'cat', sound: 'cat-sound' };
    
    const button = document.getElementById('button1');
    button.dataset.animal = 'rabbit';  // Set the guess to a different animal

    // Spy on the playSound function
    vi.spyOn(window, 'playSound'); 
    
    // Make a guess
    guess('button1');

    expect(playSound).not.toHaveBeenCalled();
  });

});