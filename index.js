let player;
let projectiles = [];
let enemies = [];
let particles = [];
const friction = 0.99;

const scoreEl = document.querySelector("#scoreEl");
const bigScoreEl = document.querySelector("#bigScoreEl");
const startGameBtn = document.querySelector("#startGameBtn");
const modelEl = document.querySelector("#modelEl");
let score = 0;

function setup() {
  createCanvas(innerWidth, innerHeight);
  frameRate(60);
  const x = width / 2;
  const y = height / 2;
  player = new Player(x, y, 10, "white");
  spawnEnemies();

  // Stop the game until the user clicks the button
  noLoop();
}

function resetGame() {
  player = new Player(width / 2, height / 2, 10, "white");
  projectiles = [];
  enemies = [];
  particles = [];
  score = 0;
  scoreEl.innerHTML = score;
}

function draw() {
  fill("rgba(0,0,0,0.1)"); // apply fade effect to canvas
  rect(0, 0, width, height);

  player.update();
  projectiles.forEach((projectile, index) => {
    projectile.update();

    // remove the projectile if it is out of window
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > height
    ) {
      setTimeout(() => {
        // delete the projectile
        projectiles.splice(index, 1);
      }, 0);
    }
  });

  enemies.forEach((enemy, index) => {
    enemy.update();
    const enemyDist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    // end game
    if (enemyDist - enemy.radius - player.radius < 1) {
      noLoop();
      modelEl.style.display = "flex";
      bigScoreEl.innerHTML = score;
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const projectileDist = Math.hypot(enemy.x - projectile.x, enemy.y - projectile.y);

      // when projectiles touch enemy
      if (projectileDist - projectile.radius - enemy.radius < 1) {
        // increase the score
        score += 100;
        scoreEl.innerHTML = score;

        // create explosions
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {
              x: (Math.random() - 0.5) * (Math.random() * 6),
              y: (Math.random() - 0.5) * (Math.random() * 6),
            })
          );
        }

        if (enemy.radius - 10 > 5) {
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          enemy.radius -= 10;
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          // remove from scene altogether
          score += 250;
          scoreEl.innerHTML = score;
          setTimeout(() => {
            // get rid of the flash animation
            enemies.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });

  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
}

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : width + radius;
      y = Math.random() * height;
    } else {
      x = Math.random() * width;
      y = Math.random() < 0.5 ? 0 - radius : height + radius;
    }
    const hue = Math.floor(Math.random() * 361) % 361;
    const color = `hsl(${hue},50%,50%)`;
    const angle = Math.atan2(height / 2 - y, width / 2 - x);
    const velocity = { x: Math.cos(angle), y: Math.sin(angle) };
    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}

function mousePressed() {
  const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
  const velocity = { x: Math.cos(angle), y: Math.sin(angle) };
  projectiles.push(new Projectile(player.x, player.y, 5, "white", velocity));
}

startGameBtn.addEventListener("click", function () {
  modelEl.style.display = "none";
  resetGame();
  loop();
});

addEventListener("keydown", ({ key }) => {
  if (key === "w") {
    player.velocity.y -= 1;
  } else if (key === "a") {
    player.velocity.x -= 1;
  } else if (key === "s") {
    player.velocity.y += 1;
  } else if (key === "d") {
    player.velocity.x += 1;
  }
});
