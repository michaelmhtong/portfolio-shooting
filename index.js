let player;
const startGameBtn = document.querySelector("#startGameBtn");

function setup() {
  createCanvas(innerWidth, innerHeight);
}

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.friction = 1;
  }
  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }

  update() {
    // Draw the player on the canvas
    this.draw();

    // Check if the player's new x position is within the bounds of the canvas
    if (
      (this.x - this.radius + this.velocity.x > 0 || this.velocity.x > 0) &&
      (this.x + this.radius + this.velocity.x < width || this.velocity.x < 0)
    ) {
      // If within bounds, update the player's x position
      this.x = this.x + this.velocity.x;
    } else {
      // If outside bounds, set the velocity to 0 to prevent the player from moving off the canvas
      this.velocity.x = 0;
    }

    // Check if the player's new y position is within the bounds of the canvas
    if (
      (this.y - this.radius + this.velocity.y > 0 || this.velocity.y > 0) &&
      (this.y + this.radius + this.velocity.y < height || this.velocity.y < 0)
    ) {
      // If within bounds, update the player's y position
      this.y = this.y + this.velocity.y;
    } else {
      // If outside bounds, set the velocity to 0 to prevent the player from moving off the canvas
      this.velocity.y = 0;
    }

    // Update the player's position by adding the velocity to the x and y position
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }

  update() {
    this.draw();
    const angle = Math.atan2(player.y - this.y, player.x - this.x);
    this.velocity.x = Math.cos(angle) * 3;
    this.velocity.y = Math.sin(angle) * 3;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Game {
  constructor() {
    startGameBtn.addEventListener("click", () => {
      this.startGame();
    });
  }
  startGame() {
    this.score = 0;
    this.projectiles = [];
    this.enemies = [];
    player = new Player(innerWidth / 2, innerHeight / 2, 25, "#fff"); // Assign an instance of the Player class to the player variable
    this.gameLoop();
  }
  gameLoop() {
    setInterval(() => {
      c.clearRect(0, 0, canvas.width, canvas.height);
      player.update();
      for (let projectile of projectiles) {
        projectile.update();
      }
      for (let enemy of enemies) {
        enemy.update();
      }
      scoreEl.textContent = score;
      bigScoreEl.textContent = score;
    }, 1000 / 60);
  }
}

const game = new Game();

document.addEventListener("keydown", (e) => {
  if (e.keyCode === 37) {
    player.velocity.x = -5;
  } else if (e.keyCode === 39) {
    player.velocity.x = 5;
  } else if (e.keyCode === 38) {
    player.velocity.y = -5;
  } else if (e.keyCode === 40) {
    player.velocity.y = 5;
  }
});

document.addEventListener("mousedown", (e) => {
  const projectile = new Projectile(player.x, player.y, 5, "#fff", {
    x: e.offsetX - player.x,
    y: e.offsetY - player.y,
  });
  projectiles.push(projectile);
});

const enemyGeneration = setInterval(() => {
  const enemy = new Enemy(Math.random() * innerWidth, Math.random() * innerHeight, 25, "#f00", {
    x: 0,
    y: 0,
  });
  enemies.push(enemy);
}, 1000);

const collisionDetection = setInterval(() => {
  for (let i = 0; i < enemies.length; i++) {
    if (
      player.x < enemies[i].x + enemies[i].radius &&
      player.x + player.radius > enemies[i].x &&
      player.y < enemies[i].y + enemies[i].radius &&
      player.y + player.radius > enemies[i].y
    ) {
      console.log("Collision!");
      modelEl.classList.add("show-model");
      clearInterval(enemyGeneration);
      clearInterval(collisionDetection);
    }
    for (let j = 0; j < projectiles.length; j++) {
      if (
        projectiles[j].x < enemies[i].x + enemies[i].radius &&
        projectiles[j].x + projectiles[j].radius > enemies[i].x &&
        projectiles[j].y < enemies[i].y + enemies[i].radius &&
        projectiles[j].y + projectiles[j].radius > enemies[i].y
      ) {
        console.log("Hit!");
        score++;
        enemies.splice(i, 1);
        projectiles.splice(j, 1);
      }
    }
  }
}, 1000 / 60);

function draw() {
  background(0);
  player.update();
  for (let projectile of projectiles) {
    projectile.update();
  }
  for (let enemy of enemies) {
    enemy.update();
  }
  scoreEl.textContent = score;
  bigScoreEl.textContent = score;
}
