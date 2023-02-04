<img src="https://github.com/michaelmhtong/portfolio-shooting/blob/master/demo/ShadowStrike.png" width="100">


# ShadowStrike

2D shooting game utilizing a ray-casting algorithm for the game mechanics. The player must use a limited angle and view to shoot enemies, with randomly generated wall blocks that change the gameplay experience each time.

## 👨‍🏫 Demo

[ShadowStrike Demo](https://game.mhtong.tech/)

![game](https://github.com/michaelmhtong/portfolio-shooting/blob/master/demo/game.gif)

## 🧰 Tech Stack

HTML, CSS, Javascript, p5.js, Algorithm

## 💡 Lightcasting Logic


1. Cast rays by offsetting angle (trigonometry)
1. Find the intersection point between ray and wall (line-line intersection) 
1. Find the closest intersection point (pythagorean Theorem)
1. Draw the areas by points (p5.js)
1. Draw the flashlight by clip (p5 clip function)

<img src="https://github.com/michaelmhtong/portfolio-shooting/blob/master/demo/formular.jpg" width="300">
<img src="https://github.com/michaelmhtong/portfolio-shooting/blob/master/demo/logic%202.jpg" width="300">
<img src="https://github.com/michaelmhtong/portfolio-shooting/blob/master/demo/logic%203.jpg" width="300">
<img src="https://github.com/michaelmhtong/portfolio-shooting/blob/master/demo/logic%204.jpg" width="300">

## 📚 Appendix

 - [Ray casting in 2D Game Engines by Sebastian Szczepański](https://www.sszczep.dev/blog/ray-casting-in-2d-game-engines/)
 - [Sight and light by Nicky Case](https://ncase.me/sight-and-light/)
