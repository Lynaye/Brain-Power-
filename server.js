const express = require('express');
const app = express();
const port = 3000;

/* Array of animals for the game and associated sound */
const animals = [
  { image: "img/capybara.png", sound: "capybara-sound" },
  { image: "img/cat.png", sound: "cat-sound" },
  { image: "img/monkey.png", sound: "monkey-sound" },
  { image: "img/rabbit.png", sound: "bunny-sound" }  
];

/* Pulls game1 files from public folder*/
app.use(express.static('public'));

// Serve index.html when someone accesses the root URL
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/game.html');
});

// Endpoint to start the game and get shuffled animals for buttons
app.get('/start-game', (req, res) => {
  // Shuffle animals for the buttons (excluding the target button)
  const shuffledAnimals = [...animals];
  shuffleArray(shuffledAnimals);

  // Randomly select one animal for the target button
  const randomTargetIndex = Math.floor(Math.random() * shuffledAnimals.length);
  const targetAnimal = shuffledAnimals[randomTargetIndex];

  // Send the animals and the target animal in the response
  res.json({
    animals: shuffledAnimals,
    targetAnimal: targetAnimal // Send the full target animal object
  });
});

// Endpoint to check if the guess is correct
app.post('/guess', express.json(), (req, res) => {
  const { guess, targetAnimal } = req.body;

  console.log('Received Guess:', guess);  // Log the guess URL
  console.log('Target Animal:', targetAnimal);  // Log the target animal object

  /* Compare guessed image URL with the target animal image URL */
  if (guess === targetAnimal.image) {
    console.log('Correct guess!');
    res.json({ correct: true });
  } else {
    console.log('Incorrect guess!');
    res.json({ correct: false });
  }
});
