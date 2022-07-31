import Renderer from "./Renderer";

class WatercolorRenderer extends Renderer {

    // colors should be rgba(36, 92, 129, 0.4) array
    constructor(x, y, width, height, color) {
        super(x, y, width, height);
        this.color = color;
        
        this.particles = [];
        const maxParticles = 100;       
    }

    draw(ctx) {
        ctx.globalAlpha = 0.5;
        //ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, 0, this.width, this.height);
        for(let i=0; i<this.particles.length; i++) {
            this.particles[i].draw(ctx);
        }
        ctx.globalAlpha = 1;
    }

    addParticle() {
        // we've got a small drawing space, no need to keep around old stuff
        if(this.particles.length == this.maxParticles) this.particles.shift();
        const x = Math.random() * (this.width-20);
        const y = Math.random() * (this.width-20);
        const radius = Math.random() * 10;
        this.particles.push(new Particle(x, y, radius, this.color));
    }
}

class Particle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();        
    }

}

export default WatercolorRenderer;