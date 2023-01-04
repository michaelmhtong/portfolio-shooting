class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  update() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    this.x = this.x + this.velocity.x * 8;
    this.y = this.y + this.velocity.y * 8;
  }

  collidesIn(walls, xOffset, yOffset, radius) {
    for (let wall of walls) {
      let isColliding = collideLineCircle(
        wall.a.x,
        wall.a.y,
        wall.b.x,
        wall.b.y,
        this.x + xOffset,
        this.y + yOffset,
        radius * 2
      );
      if (isColliding) return true;
    }
    return false;
  }
}
