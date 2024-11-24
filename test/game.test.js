import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app } from 'server.js';

// Mock the DOM and necessary elements to simulate the game environment
beforeEach(() => {
  // Clear all previous DOM elements
  document.body.innerHTML = `
    <div id="startScreen" class="start-screen">
        <h1>Brain Power!</h1>
        <button id="startButton" class="start-button">Start</button>
    </div>

    <div class="container" style="display: none;">
        <div class="life-container">
            <img id="life1" src="img/life.png" class="life-icon" alt="Life 1">
            <img id="life2" src="img/life.png" class="life-icon" alt="Life 2">
            <img id="life3" src="img/life.png" class="life-icon" alt="Life 3">
        </div>
        <div class="game">
            <div class="toguess">
                <button class="btn target-button" id="targetButton"></button>
            </div>
            <button class="btn" id="0"></button>
            <button class="btn" id="1"></button>
            <button class="btn" id="2"></button>
            <button class="btn" id="3"></button>
        </div>
    </div>

    <div id="gameOverScreen" class="game-over-screen" style="display: none;">
        <h2>Game Over!</h2>
        <button onclick="restartGame()">Restart</button>
    </div>

    <div id="level2Screen" class="level2-screen" style="display: none;">
        <h2>Level 2!</h2>
        <button id="nextButton" onclick="nextLevel()">Next</button>
    </div>
  `;
});

// Mock the `playSound` function to prevent audio play during tests
vi.stubGlobal('playSound', vi.fn());

// Test startGame function
describe('startGame()', () => {
  it('should hide the start screen and show the game container', async () => {
    // Simulate clicking the start button
    const startButton = document.getElementById('startButton');
    startButton.click();

    // Test that start screen is hidden
    expect(document.getElementById('startScreen').style.display).toBe('none');

    // Test that the game container is displayed
    const gameContainer = document.querySelector('.container');
    expect(gameContainer.style.display).toBe('flex');
  });

  it('should fetch game data from the server and assign animals', async () => {
    // Mock the fetch response
    const mockResponse = {
      animals: [
        { image: 'img/capybara.png', sound: 'capybara-sound' },
        { image: 'img/cat.png', sound: 'cat-sound' },
        { image: 'img/monkey.png', sound: 'monkey-sound' },
        { image: 'img/rabbit.png', sound: 'bunny-sound' },
      ],
      targetAnimal: { image: 'img/capybara.png', sound: 'capybara-sound' },
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    // Call startGame function
    await startGame();

    // Test if the target animal is stored correctly
    expect(window.targetAnimal).toEqual(mockResponse.targetAnimal);

    // Test if the correct number of buttons are assigned with animals
    const buttons = document.querySelectorAll('.btn');
    expect(buttons.length).toBe(4); // Should be 4 buttons
  });
});

// Test guess function
describe('guess()', () => {
  it('should handle correct guess', () => {
    // Set up a mock target animal
    window.targetAnimal = { image: 'img/capybara.png', sound: 'capybara-sound' };
    const guessedButton = document.createElement('button');
    guessedButton.dataset.animal = 'img/capybara.png'; // Set the guessed animal to the target animal

    // Mock the playSound function
    vi.spyOn(window, 'playSound');

    // Call the guess function with the correct button
    guess(guessedButton);

    // Check if playSound was called with the correct sound
    expect(playSound).toHaveBeenCalledWith('capybara-sound');
  });

  it('should handle incorrect guess and reduce lives', () => {
    // Set up a mock target animal
    window.targetAnimal = { image: 'img/capybara.png', sound: 'capybara-sound' };

    // Create an incorrect guessed button
    const guessedButton = document.createElement('button');
    guessedButton.dataset.animal = 'img/cat.png'; // Incorrect guess

    // Mock the loseLife function
    vi.spyOn(window, 'loseLife');

    // Call the guess function with the incorrect button
    guess(guessedButton);

    // Check if loseLife was called
    expect(loseLife).toHaveBeenCalled();
  });
});

// Test loseLife function
describe('loseLife()', () => {
  it('should decrement lives and hide the correct life icon', () => {
    // Set initial lives to 3
    lives = 3;

    // Call loseLife function
    loseLife();

    // Check if the life icon for the first life is hidden
    const lifeIcon = document.getElementById('life2');
    expect(lifeIcon.style.display).toBe('none');

    // Check if lives is correctly decremented
    expect(lives).toBe(2);
  });

  it('should end the game when lives reach 0', () => {
    // Set lives to 1
    lives = 1;

    // Mock game over function
    vi.spyOn(window, 'gameOver');

    // Call loseLife function (should trigger game over)
    loseLife();

    // Check if gameOver function is called
    expect(gameOver).toHaveBeenCalled();
  });
});