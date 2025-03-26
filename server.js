const express = require('express');
const app = express();
const port = 8080;

/* Array of animals for the game and associated sound */
const animals = [
  { image: "img/capybara.png", sound: "capybara-sound" },
  { image: "img/cat.png", sound: "cat-sound" },
  { image: "img/monkey.png", sound: "monkey-sound" },
  { image: "img/rabbit.png", sound: "bunny-sound" }  
];

/* Add the shuffleArray function */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; 
  }
}

/* Pulls game files from the public folder */
app.use(express.static('public'));

// Serve game.html when someone accesses the root URL
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/game.html');
});

// Endpoint to start the game and get shuffled animals for buttons
app.get('/start-game', (req, res) => {
  const shuffledAnimals = [...animals];
  shuffleArray(shuffledAnimals);

  // Randomly select one animal for the target button
  const randomTargetIndex = Math.floor(Math.random() * shuffledAnimals.length);
  const targetAnimal = shuffledAnimals[randomTargetIndex];

  // Send the animals and the target animal in the response
  res.json({
    animals: shuffledAnimals,
    targetAnimal: targetAnimal 
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

app.get('/game2', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'maingame.html'));
});

app.get('/game3', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sudoku.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});