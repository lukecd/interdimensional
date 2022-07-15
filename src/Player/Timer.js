import Emitter from './Emitter.js';
import Matter from 'matter-js';
import Particle from './Particle.js';

// eventuall this will incorporate stuff from tone.js

class Timer {

    constructor(emitters, particles) {
        this.emitters = emitters;
        this.particles = particles;
        this.maxParticles = 30;
    }

    async initParticles() {
        if(this.particles.length < this.maxParticles) {
            // randomally select an emitter
            const emitterId = Math.floor(Math.random() * this.emitters.length);

            this.particles.push(new Particle(this.emitters[emitterId].x, 
                this.emitters[emitterId].y, 
                this.emitters[emitterId].radius / 2, 
                this.emitters[emitterId].color,
                this.ctx,
                this.engine));

        }
    }
}