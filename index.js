let player;
let projectiles = [];
let enemies = [];
let particles = [];
const friction = 0.99;

let walls = [];
const NUMBER_OF_WALLS = 3;

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
  player = new Player(10, "white");
  // Stop the game until the user clicks the button
  noLoop();
}

function resetGame() {
  player = new Player(10, "white");
  projectiles = [];
  enemies = [];
  particles = [];
  score = 0;
  scoreEl.innerHTML = score;
  walls = [];
  spawnEnemies();
  // Boundary random lines
  for (let i = 0; i < NUMBER_OF_WALLS; i++) {
    walls.push(new Boundary(random(width), random(height), random(width), random(height)));
  }

  // Boundary borders
  walls.push(new Boundary(0, 0, width, 0));
  walls.push(new Boundary(width, 0, width, height));
  walls.push(new Boundary(width, height, 0, height));
  walls.push(new Boundary(0, height, 0, 0));
}

function draw() {
  fill("rgba(0,0,0,0.1)"); // apply fade effect to canvas
  rect(0, 0, width, height);

  updateControlls();
  player.update(walls);
  player.show();

  // Check if mouseIsPressed and shoot 6 times every second
  if (mouseIsPressed && frameCount % 20 == 0) {
    player.shoot({ x: mouseX, y: mouseY });
  }

  // Check if the mouse has moved
  if (mouseX !== pmouseX || mouseY !== pmouseY) {
    player.lookAt(mouseX, mouseY);
  }

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
    enemy.update(player, walls);
    enemy.show();
    const enemyDist = Math.hypot(player.pos.x - enemy.pos.x, player.pos.y - enemy.pos.y);
    // end game
    if (enemyDist - enemy.radius - player.radius < 1) {
      enemy.isVisible = true;
      noLoop();
      modelEl.style.display = "flex";
      bigScoreEl.innerHTML = score;
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const projectileDist = Math.hypot(enemy.pos.x - projectile.x, enemy.pos.y - projectile.y);

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

  projectiles.forEach((projectile, projectileIndex) => {
    // Check if the projectile collides with any wall
    if (projectile.collidesIn(walls, 0, 0, projectile.radius)) {
      setTimeout(() => {
        // If it collides, remove it from the projectiles array
        projectiles.splice(projectileIndex, 1);
      }, 0);
      // create explosions
      for (let i = 0; i < projectile.radius * 2; i++) {
        particles.push(
          new Particle(projectile.x, projectile.y, Math.random() * 2, projectile.color, {
            x: (Math.random() - 0.5) * (Math.random() * 1),
            y: (Math.random() - 0.5) * (Math.random() * 1),
          })
        );
      }
    }
  });

  // explosions
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
}

// addEventListener("keydown", ({ key }) => {
//   if (key === "w") {
//     player.velocity.y -= 1;
//   } else if (key === "a") {
//     player.velocity.x -= 1;
//   } else if (key === "s") {
//     player.velocity.y += 1;
//   } else if (key === "d") {
//     player.velocity.x += 1;
//   }
// });

function moveByTo(keys, x, y) {
  for (let key of keys) {
    if (keyIsDown(key) && !player.collidesIn(walls, x, y)) {
      if (x === 0) {
        player.pos.y += y;
      } else {
        player.pos.x += x;
      }
    }
  }
}

function updateControlls() {
  let speed = 5;
  moveByTo([UP_ARROW, 87], 0, -speed);
  moveByTo([DOWN_ARROW, 83], 0, speed);
  moveByTo([LEFT_ARROW, 65], -speed, 0);
  moveByTo([RIGHT_ARROW, 68], speed, 0);
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
  }, 2000);
}

startGameBtn.addEventListener("click", function () {
  modelEl.style.display = "none";
  resetGame();
  loop();
});
