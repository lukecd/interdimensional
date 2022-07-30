import Renderer from "./Renderer";

class BlackHoleRenderer extends Renderer {

    // colors should be rgba(36, 92, 129, 0.4) array
    constructor(x, y, width, height, bgColor, color, ctx) {
        super(x, y, width, height);
        this.bgColor = bgColor;
        this.color = color;
        
        this.particles = [];
        const numParticles = 50;

        for(let i=0; i<numParticles; i++) {
            const radius = 7;
            this.particles.push(new Particle(this.width/2, this.height/2, this.width, this.height, radius, color));
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.bgColor;
        ctx.globalAlpha = 0.5;
        //ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, 0, this.width, this.height);
        for(let i=0; i<this.particles.length; i++) {
            this.particles[i].update();
            this.particles[i].draw(ctx);
        }
        ctx.globalAlpha = 1;
    }
}

class Particle {
    constructor(x, y, width, height, radius, color) {
        this.x = x;
        this.y = y;
        this.xStart = x;
        this.yStart = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.radians = Math.random() * (2 * Math.PI);
        this.velocity = Math.random() * 0.01;
        this.distanceFromCenter = this.randomIntFromRange(1, this.width/2);
        this.radius = this.scale(this.distanceFromCenter, 1, this.width/2, 1, 10);
    }

    /**
     * @notice Goal is to move all particles to the center
     */
    update() {
        // move points over time
        this.radians += this.velocity;
        this.x = this.xStart + Math.cos(this.radians) * this.distanceFromCenter;
        this.y = this.yStart + Math.sin(this.radians) * this.distanceFromCenter;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();        
    }

    randomIntFromRange(min, max) {
        return Math.floor(Math.random() * (max-min +1) + min);
    }

    /**
    * 
    * @notice Helper function to map one scale to another
    * Currently used to make circles smaller as they move toward the center
    */
    scale (number, inMin, inMax, outMin, outMax) {
        return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }   
}

export default BlackHoleRenderer;