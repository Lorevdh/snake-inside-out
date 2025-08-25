// 🐍 Snake Inside-Out
// Remix Jam — "Flip the Script"
// The snake starts long and SHRINKS when eating food.
// Survive as long as you can. Collisions end the game.

// 🎨 Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 📐 Grid settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// 🐍 Snake state
let snake;
let direction;
let food;
let gameRunning = false;
let score = 0;
let startTime = 0;

// 🎮 Controls — Arrow keys or WASD
document.addEventListener('keydown', (e) => {
  if ((e.key === 'ArrowUp' || e.key === 'w') && direction.y !== 1) direction = { x: 0, y: -1 };
  if ((e.key === 'ArrowDown' || e.key === 's') && direction.y !== -1) direction = { x: 0, y: 1 };
  if ((e.key === 'ArrowLeft' || e.key === 'a') && direction.x !== 1) direction = { x: -1, y: 0 };
  if ((e.key === 'ArrowRight' || e.key === 'd') && direction.x !== -1) direction = { x: 1, y: 0 };
});

// 🔄 Restart button
document.getElementById('restartBtn').addEventListener('click', startGame);

// 🚀 Start the game
function startGame() {
  // Create a snake of length 20 in the middle
  snake = [];
  for (let i = 0; i < 20; i++) {
    snake.push({ x: 10 + i, y: 10 }); // horizontal snake
  }

  direction = { x: -1, y: 0 }; // moving left initially
  food = spawnFood();
  gameRunning = true;

  score = 0;
  startTime = Date.now();

  gameLoop();
}

// 🔁 Main game loop
function gameLoop() {
  if (!gameRunning) return;

  update();
  draw();

  if (gameRunning) {
    setTimeout(gameLoop, 150);
  }
}

// 🧩 Update logic
function update() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // 🚧 Wall collision
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    return gameOver();
  }

  // 💀 Self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    return gameOver();
  }

  // Add new head to the snake
  snake.unshift(head);

  // 🍎 Food eaten
  if (head.x === food.x && head.y === food.y) {
    // Shrink instead of grow
    if (snake.length > 2) {
      snake.pop();
      snake.pop(); // remove extra segment
    } else {
      return gameOver();
    }
    food = spawnFood();
  } else {
    // Normal movement — remove last segment
    snake.pop();
  }

  // 🧨 Snake disappeared completely
  if (snake.length <= 0) {
    return gameOver();
  }

  // ⏱ Update score (seconds survived)
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

  // Score
  ctx.fillStyle = '#fff';
  ctx.font = '16px Courier New';
  ctx.fillText(`Time Survived: ${score}s`, 10, 20);
}

// 🎲 Random food spawn
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
  alert(`Game Over! You survived ${score} seconds.\nPress Restart to try again.`);
}
