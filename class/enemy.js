class Enemy {
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
    const angle = Math.atan2(player.y - this.y, player.x - this.x);
    this.velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
