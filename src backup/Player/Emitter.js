import Matter from 'matter-js';
import Particle from './Particle.js';

class Emitter {

    constructor(x, y, radius, color, canvas, ctx, engine) {
        this.x = x; 
        this.y = y;
        this.radius = radius;
        this.canvas = canvas;
        this.ctx = ctx;
        this.engine = engine;
        this.maxParticles = 9;
        this.position = Matter.Bodies.circle(x, y, radius, {isStatic: true});
        
        Matter.World.add(engine.world, this.position);

        this.color = color;
        this.particles = [];
    }

    draw() {        
        this.x = this.position.position.x;
        this.y = this.position.position.y;
        
        if(this.particles.length < this.maxParticles) {
            this.particles.push(new Particle(this.x, 
                this.y, 
                this.radius / 2, 
                this.color,
                this.canvas,
                this.ctx,
                this.engine));
        }

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

        for(let i=0; i<this.particles.length; i++) {
            this.particles[i].draw();
        }
    }
}

export default Emitter;