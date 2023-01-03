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

  update() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);

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
