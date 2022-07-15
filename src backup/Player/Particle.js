import Matter from 'matter-js';

class Particle {
    // const PHYSICS = {
    //     label: 'Ball', // ball group identifier
    //     restitution: 1, // no speed loss when colliding
    //     inertia: Infinity, // no speed loss due to torque in a collision
    //     friction: 0, // perfect slide in a collision
    //     frictionAir: 0, // no air resistance
    //     frictionStatic: 0, // never stop moving
    //     collisionFilter: { group: -1 } // no collision to other balls
    //   };

    constructor(x, y, radius, color, canvas, ctx, engine) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.canvas = canvas;
        this.ctx = ctx;
        this.engine = engine;
        this.position = Matter.Bodies.circle(x, y, radius);
        Matter.World.add(engine.world, this.position);
    }

    getRandom(min, max) {
        return (min + Math.random()*(max - min + 1))
    }

    draw() {

        //this.position.position.x += this.getRandom(-1, 1);
        //this.position.position.y += this.getRandom(-1, 1);
        
        this.x = this.position.position.x;
        this.y = this.position.position.y;

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }


}
export default Particle;