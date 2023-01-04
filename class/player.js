class Player {
  constructor(radius, color) {
    this.pos = createVector(width / 2, height / 2);
    this.radius = radius;
    this.color = color;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.friction = 1;
    this.lightConeInDegree = 70;
    this.rays = [];
    this.createRaysFromAngle(0, this.lightConeInDegree, 1);
  }

  show() {
    noStroke();
    // fill(this.color);
    // ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);

    let flickerPossiblity = 0.03;
    noStroke(255);
    fill(244, 206, 66, random(1) < flickerPossiblity ? 200 : 255);
    beginShape();
    vertex(this.pos.x, this.pos.y);

    for (let ray of this.rays) {
      if (ray.end) {
        vertex(ray.end.x, ray.end.y);
      }
    }
    endShape(CLOSE);

    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
    // fill(255);
    // circle(this.pos.x, this.pos.y, this.radius);

    // Check if the player's new x position is within the bounds of the canvas
    if (
      (this.pos.x - this.radius + this.velocity.x > 0 || this.velocity.x > 0) &&
      (this.pos.x + this.radius + this.velocity.x < width || this.velocity.x < 0)
    ) {
      // If within bounds, update the player's x position
      this.pos.x = this.pos.x + this.velocity.x;
    } else {
      // If outside bounds, set the velocity to 0 to prevent the player from moving off the canvas
      this.velocity.x = 0;
    }

    // Check if the player's new y position is within the bounds of the canvas
    if (
      (this.pos.y - this.radius + this.velocity.y > 0 || this.velocity.y > 0) &&
      (this.pos.y + this.radius + this.velocity.y < height || this.velocity.y < 0)
    ) {
      // If within bounds, update the player's y position
      this.pos.y = this.pos.y + this.velocity.y;
    } else {
      // If outside bounds, set the velocity to 0 to prevent the player from moving off the canvas
      this.velocity.y = 0;
    }

    // // Update the player's position by adding the velocity to the x and y position
    // this.pos.x = this.pos.x + this.velocity.x;
    // this.pos.y = this.pos.y + this.velocity.y;
  }

  createRaysFromAngle(angle, lightConeInDegree, steps) {
    this.rays = [];
    let halfCone = lightConeInDegree / 2;
    for (let a = -halfCone; a < halfCone; a += steps) {
      this.rays.push(new Ray(this.pos, angle + radians(a)));
    }
  }

  update(walls) {
    this.castRays(walls);
  }

  lookAt(x, y) {
    let angle = atan2(y - this.pos.y, x - this.pos.x);
    this.createRaysFromAngle(angle, this.lightConeInDegree, 1);
  }

  castRays(walls) {
    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      let closest = null;
      let record = Infinity;
      for (let wall of walls) {
        const pt = ray.cast(wall);
        if (pt) {
          const d = p5.Vector.dist(this.pos, pt);
          if (d < record) {
            record = d;
            closest = pt;
            ray.end = pt;
          }
        }
      }
    }
  }

  collidesIn(walls, xOffset, yOffset) {
    for (let wall of walls) {
      let isColliding = collideLineCircle(
        wall.a.x,
        wall.a.y,
        wall.b.x,
        wall.b.y,
        this.pos.x + xOffset,
        this.pos.y + yOffset,
        this.radius
      );
      if (isColliding) return true;
    }
    return false;
  }

  // collidesWith(mob) {
  //   return collideCircleCircle(
  //     this.pos.x,
  //     this.pos.y,
  //     this.radius,
  //     mob.pos.x,
  //     mob.pos.y,
  //     mob.radius
  //   );
  // }

  isInViewField(x, y, radius) {
    for (let ray of this.rays) {
      if (!ray || !ray.pos || !ray.end) return;

      if (collideLineCircle(ray.pos.x, ray.pos.y, ray.end.x, ray.end.y, x, y, radius)) {
        return true;
      }
    }
    return false;
  }

  shoot(mouse) {
    const angle = Math.atan2(mouse.y - this.pos.y, mouse.x - this.pos.x);
    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5,
    };
    projectiles.push(new Projectile(this.pos.x, this.pos.y, 5, "white", velocity));
  }
}
