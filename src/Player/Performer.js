import Matter from 'matter-js';
import Particle from './Particle.js';
import chroma from "chroma-js";

class Performer {

    constructor(x, y, radius, color, ctx, engine) {
        this.x = x; 
        this.y = y;
        this.radius = radius;
        this.ctx = ctx;
        this.engine = engine;
        this.shouldAnimate = false;

        this.position = Matter.Bodies.circle(x, y, radius, {
            isStatic: false,
            label: 'emitter',
            plugin: {
              attractors: [
                function(bodyA, bodyB) {
                  return {
                    x: (bodyA.position.x - bodyB.position.x) * 1e-6,
                    y: (bodyA.position.y - bodyB.position.y) * 1e-6,
                  };
                }
              ]
            }           
        });

        const mouse = Matter.Mouse.create(ctx.canvas);
        const mConstraint = Matter.MouseConstraint.create(engine, ctx.canvas, {
          mouse: mouse
        });
        Matter.Composite.add(engine.world, [this.position, mConstraint]);

        this.color = color;
        // get 5 colors in a scale realted to our main color
        //this.colorScale = chroma.scale(color).colors(5);
        this.colorScale = chroma.scale([color, '#d90166']).colors(6);
        this.id = this.position.id;
    }

    /**
     * @notice Called when a new particle is being generated from our x,y
     * lets us know we should animate.
     */
    emit() {
      this.shouldAnimate = true;
      this.frameCounter = 0;
    }

    updateColor(color) {
      this.color = color;
      this.position.color = color;
    }

    draw() {        
        this.x = this.position.position.x;
        this.y = this.position.position.y;

        // change this value to modify the length of the animation
        if(this.frameCounter > 200) this.shouldAnimate = false;

        if(this.shouldAnimate) {
          this.frameCounter++;
          const circleCount = this.colorScale.length;
          let startRadius = this.radius;
          for(let i=0; i<circleCount; i++) {
    
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, startRadius, 0, 2 * Math.PI);
            this.ctx.fillStyle = this.colorScale[i];
            this.ctx.fill();           
            startRadius -= (this.radius / circleCount);
          }
          // shift the colors every 9 renders (so people have time to see)
          if(this.frameCounter % 9 == 0) {
            const colorToMove = this.colorScale.shift();
            this.colorScale.push(colorToMove);
          }

        }
        else {
          this.ctx.beginPath();
          this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
          this.ctx.fillStyle = this.color;
          this.ctx.fill();
        }
    }
}

export default Performer;
