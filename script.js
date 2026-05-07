const game = document.getElementById("game");
const player = document.getElementById("player");
const menu = document.getElementById("menu");
const playBtn = document.getElementById("playBtn");
const scoreText = document.getElementById("score");
const levelText = document.getElementById("level");
const gameOverScreen = document.getElementById("gameOver");
const skinNameText = document.getElementById("skinName");

let state = "menu";
let score = 0;
let level = 1;
let speed = 6;
let delay = 1400;
let playerY = 0;
let velocity = 0;
let jumping = false;
let skin = "#facc15";

// ---- START ----
playBtn.onclick = () => {
  menu.style.display = "none";
  state = "playing";
  loop();
  spawnLoop();
};

// ---- SKINS ----
const skins = document.querySelectorAll(".skin");
skins.forEach(btn => {
  btn.addEventListener("click", () => {
    skins.forEach(s => s.classList.remove("selected"));
    btn.classList.add("selected");
    skin = btn.dataset.color;
    player.style.background = skin;
    skinNameText.textContent = btn.dataset.name;
    if (navigator.vibrate) navigator.vibrate(20);
  });
});
player.style.background = skin;

// ---- INPUT ----
document.addEventListener("touchstart", jump);
document.addEventListener("mousedown", jump);

function jump() {
  if (state !== "playing") return;
  if (!jumping) {
    velocity = 18;
    jumping = true;
    createParticles();
    if (navigator.vibrate) navigator.vibrate(20);
  }
}

// ---- PARTICULAS ----
function createParticles() {
  for (let i = 0; i < 10; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");
    p.style.background = skin;
    p.style.left = (player.offsetLeft + 20) + "px";
    p.style.bottom = (parseFloat(player.style.bottom) + 20) + "px";
    const dx = (Math.random() - 0.5) * 100 + "px";
    const dy = -Math.random() * 100 + "px";
    p.style.setProperty("--dx", dx);
    p.style.setProperty("--dy", dy);
    game.appendChild(p);
    setTimeout(() => p.remove(), 500);
  }
}

// ---- PLAYER ----
function updatePlayer() {
  velocity -= 0.6;
  playerY += velocity;
  if (playerY <= 0) {
    playerY = 0;
    velocity = 0;
    jumping = false;
  }
  player.style.bottom = (100 + playerY) + "px";
}

// ---- DIFFICULTY + MODO FURIA ----
function updateDifficulty() {
  level = Math.floor(score / 10) + 1;
  speed = 6 + score * 0.2;
  delay = Math.max(400, 1400 - score * 15);
  levelText.textContent = "LVL " + level;

  if (score >= 30) {
    player.classList.add("furia");
    document.body.style.background = "radial-gradient(circle at top, #ff00ff, #00ffff)";
  } else {
    player.classList.remove("furia");
    document.body.style.background = "radial-gradient(circle at top, #1e293b, #050816)";
  }
}
// ---- OBSTÁCULOS ----
function createObstacle() {
  const o = document.createElement("div");
  o.classList.add("obstacle");
  let x = window.innerWidth;
  o.style.left = x + "px";
  game.appendChild(o);

  const move = setInterval(() => {
    if (state !== "playing") {
      clearInterval(move);
      return;
    }

    x -= speed;
    o.style.left = x + "px";

    const p = player.getBoundingClientRect();
    const r = o.getBoundingClientRect();

    const hit =
      p.left < r.right &&
      p.right > r.left &&
      p.top < r.bottom &&
      p.bottom > r.top;

    if (hit) gameOver();

    if (x < -60) {
      o.remove();
      clearInterval(move);
      score++;
      scoreText.textContent = score;
      updateDifficulty();
    }
  }, 20);
}

// ---- SPAWN LOOP ----
function spawnLoop() {
  if (state !== "playing") return;

  createObstacle();

  setTimeout(spawnLoop, delay);
}

// ---- GAME LOOP ----
function loop() {
  if (state !== "playing") return;
  updatePlayer();
  requestAnimationFrame(loop);
}

// ---- GAME OVER ----
function gameOver() {
  state = "gameover";
  gameOverScreen.innerHTML = `
    <h1>GAME OVER</h1>
    <p>Score: ${score}</p>
    <p>Toca para reiniciar</p>
  `;
  gameOverScreen.classList.remove("hidden");

  gameOverScreen.onclick = () => location.reload();
}
