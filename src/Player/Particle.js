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

    constructor(x, y, radius, color, ctx, engine) {
        this.x = x;
        this.y = y;
        this.vx = 0.0;
        this.vy = 0.0;
        this.radius = radius;
        this.spring = .5;
        this.gravity = 0.03;
        this.friction = 2;
        this.moveIncrement = Math.random() / 100;

        // each particle moves along it's own unique vector
        this.xVector = 0;
        this.yVector = 0;
        let rndSeed = Math.floor(this.getRandom(1,10));
        if(rndSeed > 5) this.xVector = this.moveIncrement;
        else this.xVector = -this.moveIncrement;
        rndSeed = Math.floor(this.getRandom(1,10));
        if(rndSeed > 5) this.yVector = this.moveIncrement;
        else this.yVector = -this.moveIncrement;



        this.color = color;
        this.ctx = ctx;
        this.engine = engine;
        this.position = Matter.Bodies.circle(x, y, radius, {
          mass: 0.005,
          friction: 0,
          frictionAir: 0.02,
          label: 'particle',
          color: color
        });
        //const velocity = Matter.Vector.create(this.getRandom(0, window.innerWidth), this.getRandom(0, window.innerHeight));
        // const velocity = Matter.Vector.create(this.getRandom(-1, 1), this.getRandom(-1, 1));
        // Matter.Body.setVelocity(this.position, velocity)
        Matter.Composite.add(this.engine.world, this.position);

        this.id = this.position.id;
    }

    /**
     * @notice Removes particle from matter.js
     */
    kill() {
        Matter.Composite.remove(this.engine.world, this.position); 
    }

    updateColor(color) {
        this.color = color;
        this.position.color = color;
    }

    getRandom(min, max) {
        return (min + Math.random()*(max - min + 1))
    }

    move() {

        // has it hit left wall
        if(this.position.position.x - this.radius <= 10) {
            this.xVector = this.moveIncrement;
        }// has it hit right wall
        else if(this.position.position.x + this.radius >= (window.innerWidth-10)) {
            this.xVector = -this.moveIncrement;
        }
        
        // has it hit top wall
        if(this.position.position.y - this.radius <= 90) {
            this.yVector = this.moveIncrement;
        }// has it hit bottom wall
        else if(this.position.position.y + this.radius >= (window.innerHeight-10)) {
            this.yVector = -this.moveIncrement;
        }
        this.position.position.x += this.xVector;
        this.position.position.y += this.yVector;
    }

    draw() {
        this.move();
        this.x = this.position.position.x;
        this.y = this.position.position.y;

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }


}
export default Particle;