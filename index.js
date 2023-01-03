let player;
let projectiles = [];
let enemies = [];

function setup() {
  createCanvas(innerWidth, innerHeight);
  frameRate(60);
  const x = width / 2;
  const y = height / 2;
  player = new Player(x, y, 30, "blue");
  spawnEnemies();
}

function draw() {
  background(0);

  player.update();
  projectiles.forEach((projectile) => {
    projectile.update();
  });
  enemies.forEach((enemy, index) => {
    enemy.update();
    const enemyDist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    // end game
    if (enemyDist - enemy.radius - player.radius < 1) {
      noLoop();
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const projectileDist = Math.hypot(enemy.x - projectile.x, enemy.y - projectile.y);
      if (projectileDist - projectile.radius - enemy.radius < 1) {
        enemies.splice(index, 1);
        projectiles.splice(projectileIndex, 1);
      }
    });
  });
}

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  update() {
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
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
  update() {
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
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
  update() {
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
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
    const color = "green";
    const angle = Math.atan2(height / 2 - y, width / 2 - x);
    const velocity = { x: Math.cos(angle), y: Math.sin(angle) };
    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}

function mousePressed() {
  const angle = Math.atan2(mouseY - height / 2, mouseX - width / 2);
  const velocity = { x: Math.cos(angle), y: Math.sin(angle) };
  projectiles.push(new Projectile(width / 2, height / 2, 5, "red", velocity));
}
