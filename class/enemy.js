class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.pos = createVector(x, y);
    // this.x = x;
    // this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.isVisible = false;
    // this.maxSpeed = random(0.3, 0.5);
  }

  show() {
    if (this.isVisible) {
      noStroke();
      fill(this.color);
      ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
    }
    const angle = Math.atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);
    this.velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    this.pos.x = this.pos.x + this.velocity.x;
    this.pos.y = this.pos.y + this.velocity.y;
  }

  update(player, walls) {
    this.isVisible = player.isInViewField(this.pos.x, this.pos.y, this.radius);
    // let desired = p5.Vector.sub(player.pos, this.pos);
    // desired.normalize();
    // desired.mult(this.maxSpeed);

    // let steer = p5.Vector.sub(desired, this.velocity);
    // steer.limit(this.maxSpeed);

    // if (!this.collidesIn(walls, this.velocity.x + steer.x, this.velocity.y + steer.y, this.radius)) {
    //   this.velocity.add(steer);
    //   this.pos.add(this.velocity);
    // }
  }

  // collidesIn(walls, xOffset, yOffset, radius) {
  //   for (let wall of walls) {
  //     let isColliding = collideLineCircle(
  //       wall.a.x,
  //       wall.a.y,
  //       wall.b.x,
  //       wall.b.y,
  //       this.pos.x + xOffset,
  //       this.pos.y + yOffset,
  //       radius
  //     );
  //     if (isColliding) return true;
  //   }
  //   return false;
  // }
}
