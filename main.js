// 🐍 Snake Inside-Out
// Built for the Remix Jam — "Flip the Script"
// Instead of growing, the snake shrinks when eating regular food.
// Goal: survive by balancing shrink and growth.

// 🎨 Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 📐 Grid settings
const gridSize = 20; // Each tile is 20x20 pixels
const tileCount = canvas.width / gridSize; // Number of tiles per row/column

// 🐍 Snake state
let snake = [{ x: 10, y: 10 }]; // Snake starts in the middle
let direction = { x: 0, y: 0 }; // Initial direction is stationary
let food = spawnFood(); // First food spawn
let grow = 0; // Tracks how many segments to grow (used for special blocks)

// 🎮 Controls — Arrow keys or WASD
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'w') direction = { x: 0, y: -1 };
  if (e.key === 'ArrowDown' || e.key === 's') direction = { x: 0, y: 1 };
  if (e.key === 'ArrowLeft' || e.key === 'a') direction = { x: -1, y: 0 };
  if (e.key === 'ArrowRight' || e.key === 'd') direction = { x: 1, y: 0 };
});

// 🔁 Game loop — runs every 150ms
function gameLoop() {
  update(); // Update snake position and game state
  draw();   // Render everything on canvas

  // 🧨 Game over condition: snake has no segments left
  if (snake.length > 0) {
    setTimeout(gameLoop, 150); // Recursion with delay
  } else {
    alert('Game Over — You vanished!');
  }
}

// 🧩 Update logic
function update() {
  // 🐍 Move snake head in current direction
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head); // Add new head to front of array

  // 🍎 Check if head touches food
  if (head.x === food.x && head.y === food.y) {
    grow += 1; // Instead of growing, we shrink less
    food = spawnFood(); // Spawn new food
  }

  // 🧬 Shrink snake unless we have grow buffer
  if (grow > 0) {
    grow--; // Use up one grow point
  } else {
    snake.pop(); // Remove tail segment
  }

  // 🚧 Wall collision = instant game over
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    snake = []; // Trigger game over
  }
}

// 🎨 Draw everything
function draw() {
  // 🧼 Clear canvas
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 🐍 Draw snake segments
  ctx.fillStyle = '#0f0';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });

  // 🍎 Draw food
  ctx.fillStyle = '#f00';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// 🎲 Random food spawn
function spawnFood() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

// 🚀 Start the game
gameLoop();