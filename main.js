// 🐍 Snake Inside-Out
// Remix Jam — "Flip the Script"
// The snake starts long and SHRINKS when eating food.
// Survive as long as you can. Collisions end the game.
// ---
// Fully commented so others can remix & learn from it.

// 🎨 Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 📐 Grid settings
const gridSize = 20; // size of each square
const tileCount = canvas.width / gridSize; // number of squares per row/column

// 🐍 Snake state
let snake;
let direction;
let food;
let gameRunning = false;
let score = 0;
let startTime = 0;

// 🖼 Overlay elements (for Start + Game Over screens)
const overlay = document.getElementById('overlay');
const overlayMessage = document.getElementById('overlayMessage');
const overlayScore = document.getElementById('overlayScore');
const overlayBtn = document.getElementById('overlayBtn');

// 🎮 Controls — Arrow keys or WASD
document.addEventListener('keydown', (e) => {
  if ((e.key === 'ArrowUp' || e.key === 'w') && direction.y !== 1) direction = { x: 0, y: -1 };
  if ((e.key === 'ArrowDown' || e.key === 's') && direction.y !== -1) direction = { x: 0, y: 1 };
  if ((e.key === 'ArrowLeft' || e.key === 'a') && direction.x !== 1) direction = { x: -1, y: 0 };
  if ((e.key === 'ArrowRight' || e.key === 'd') && direction.x !== -1) direction = { x: 1, y: 0 };
});

// ▶ Overlay button starts or restarts the game
overlayBtn.addEventListener('click', () => {
  overlay.style.display = 'none'; // hide overlay
  startGame(); // reset and start
});

// 🚀 Start the game
function startGame() {
  // Create a snake of length 20 in the middle
  snake = [];
  for (let i = 0; i < 20; i++) {
    snake.push({ x: 10 + i, y: 10 }); // horizontal snake
  }

  // Initial movement direction
  direction = { x: -1, y: 0 };

  // Spawn first piece of food
  food = spawnFood();

  gameRunning = true;
  score = 0;
  startTime = Date.now();

  gameLoop();
}

// 🔁 Main game loop
function gameLoop() {
  if (!gameRunning) return;

  update(); // update game state
  draw();   // draw everything

  if (gameRunning) {
    setTimeout(gameLoop, 150); // loop again after 150ms
  }
}

// 🧩 Update game logic
function update() {
  // New head position
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // 🚧 Wall collision
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    return gameOver();
  }

  // 💀 Self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    return gameOver();
  }

  // Add new head
  snake.unshift(head);

  // 🍎 Food eaten → snake shrinks
  if (head.x === food.x && head.y === food.y) {
    if (snake.length > 2) {
      snake.pop();
      snake.pop(); // remove extra segment → shrinking effect
    } else {
      return gameOver(); // snake too small = death
    }
    food = spawnFood();
  } else {
    // Normal movement → remove last segment
    snake.pop();
  }

  // 🧨 Snake disappeared completely
  if (snake.length <= 0) {
    return gameOver();
  }

  // ⏱ Score = seconds survived
  score = Math.floor((Date.now() - startTime) / 1000);
}

// 🎨 Draw everything
function draw() {
  // Background
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Snake
  ctx.fillStyle = '#0f0';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });

  // Food
  ctx.fillStyle = '#f00';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Score HUD
  ctx.fillStyle = '#fff';
  ctx.font = '16px Courier New';
  ctx.fillText(`Time Survived: ${score}s`, 10, 20);
}

// 🎲 Spawn food at random location
function spawnFood() {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
    // Ensure food does not spawn inside the snake
    if (!snake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) {
      return newFood;
    }
  }
}

// ☠️ Game over
function gameOver() {
  gameRunning = false;

  // Update overlay message
  overlayMessage.textContent = "Game Over!";
  overlayScore.textContent = `You survived ${score} seconds`;
  overlayBtn.textContent = "🔄 Restart";

  // Show overlay (now centered over canvas)
  overlay.style.display = "flex";
}
