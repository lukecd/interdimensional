import Emitter from './Emitter.js';
import Matter from 'matter-js';
import Particle from './Particle.js';
import chroma from "chroma-js";

/**
 * Ok, honestly this seem a bit kludgy to have this one draw method 
 * here that then instantiates the objects needed for my design.
 * But seems like this is how to integrate Canvas stuff into
 * React? I need to study up on this some more. 
 * 
 * @param {*} ctx A reference to the site's ctx
 * @param {*} canvas A reference to the site's canvas
 */

 const draw = (ctx, canvas, engine) => {
    new Player(ctx, canvas, engine);
}
export default draw;


class Player {
    constructor(ctx, canvas, engine) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.engine = engine;

        this.bgColor = '#12082D';
        this.colors = ['#8F0380', '#EC205B', '#FC7208', '#D00204', '#7701AD'];
        this.maxParticles = 30;
        this.emitterRadius = 50;
        this.numEmitters = 5;
        
        // no, this not bad OOP, it's just the easiest way to manage things. 
        // both particles and emitters are both at the same level as we need an 
        // easy way to handle merging particles made by different emitters. 
        // if particles were a child class of emitters, it would be tricky to handle
        // cross-emitter merges.
        this.particles = [];
        let emitters = [];
        for(let i=0; i<this.colors.length; i++) {
            // random, but giving room so we don't go off screen
            let x = Math.random()* (window.innerWidth-(2*this.emitterRadius)) + (2*this.emitterRadius);
            let y = Math.random()* (window.innerHeight-(2*this.emitterRadius)) + (2*this.emitterRadius);
            emitters[i] = new Emitter(x, 
                                      y,
                                      this.emitterRadius,
                                      //this.colors[Math.floor(Math.random() * this.numEmitters)],
                                      this.colors[i],
                                      this.ctx,
                                      this.engine);
        }
        this.emitters = emitters;

        //todo: for some reason if i pass window.innerWidth, the width isn't long enough
        this.setupWalls();

        this.cDetector = Matter.Detector.create();

        // handle collisions
        this.setupEvents();

        // setup our particle array
        this.initParticles();

        // handle resizing
        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();
        requestAnimationFrame(this.animate.bind(this));
    }

    setupEvents() {
        // store a reference to this so we can access from within the event
        const self = this;
        Matter.Events.on(this.engine, 'collisionStart', function(event) {
            // console.log("collision");
             const pairs = event.pairs;
     
             // change object colours to show those starting a collision
             for (let i = 0; i < pairs.length; i++) {
                 //console.log(pairs[i].bodyA);
                 //console.log(pairs[i].bodyA.position);
                 
                 // if two particles hit eachother
                 if(pairs[i].bodyA.label === 'particle' && pairs[i].bodyB.label === 'particle') {
                    // when merge happens, change color of bodyA and delete bodyB
                    const idA = pairs[i].bodyA.id;
                    const idB = pairs[i].bodyB.id;
                    let indexA = -1;
                    let indexB = -1;
                    // find the array indexes of the particles given their ids
                    for(let j=0; j<self.particles.length; j++) {
                        if(self.particles[j].id == idA) indexA = j;
                        else if(self.particles[j].id == idB) indexB = j;
                    }
                    // change color of particle A to a mix of A & B
                    const newColor = chroma.mix(self.particles[indexA].color, self.particles[indexB].color);
                    self.particles[indexA].updateColor(newColor);

                    // kill off particle B
                    self.particles[indexB].kill();
                    self.particles.splice(indexB, 1);
                 }
                 // if a particle hits an emitter, merge both of their colors
                 else if ( (pairs[i].bodyA.label === 'particle' && pairs[i].bodyB.label === 'emitter') ||
                           (pairs[i].bodyA.label === 'emitter' && pairs[i].bodyB.label === 'particle')) {
                    let particleId = -1;
                    let emitterId = -1;
                    if(pairs[i].bodyA.label === 'particle') {
                        // bodyA is particle, bodyB is emitter
                        particleId = pairs[i].bodyA.id;
                        emitterId = pairs[i].bodyB.id;
                    }
                    else {
                         // bodyA is emitter, bodyB is particle
                         emitterId = pairs[i].bodyA.id;
                         particleId = pairs[i].bodyB.id;    
                    }
                    let indexParticle = -1;
                    let indexEmitter = -1;
                    // find the array index of the particle
                    for(let j=0; j<self.particles.length; j++) {
                        if(self.particles[j].id == particleId) indexParticle = j;
                    }
                    // find the array index of the emitter                    
                    for(let j=0; j<self.emitters.length; j++) {
                        if(self.emitters[j].id == emitterId) indexEmitter = j;
                    }
               
                    const newColor = chroma.mix(self.particles[indexParticle].color, 
                        self.emitters[indexEmitter].color);
                    self.particles[indexParticle].updateColor(newColor); 
                    self.emitters[indexEmitter].updateColor(newColor); 
                 }
             }
         });
    }


    setupWalls() {
        const wallOptions = {
            isStatic: true
        }
        const thickness = 50;
        const navBarHeight = 90;
        const width = window.innerWidth;
        const height = window.innerHeight;
        Matter.Composite.add(this.engine.world, [
            Matter.Bodies.rectangle(width/2, height, width, thickness, wallOptions), // bottom
            Matter.Bodies.rectangle(width, height/2, thickness, height, wallOptions), // right
            Matter.Bodies.rectangle(width/2, navBarHeight, width, thickness, wallOptions), // top
            Matter.Bodies.rectangle(0, height/2, thickness, height, wallOptions) // left
        ]);
      
    }

    initParticles() {
        if(this.particles.length < this.maxParticles) {
            // randomally select an emitter
            const emitterId = Math.floor(Math.random() * this.emitters.length);
            this.emitters[emitterId].emit();
            this.particles.push(new Particle(this.emitters[emitterId].x, 
                this.emitters[emitterId].y, 
                this.emitters[emitterId].radius / 2, 
                this.emitters[emitterId].color,
                this.ctx,
                this.engine));

        }
    }

    addParticle() {

    }

    resize() {
        this.width =  window.innerWidth;
        this.height =  window.innerHeight;
        // todo check if resize moved emitters off screen
    }

    getRandom(min, max) {
        return (min + Math.random()*(max - min + 1))
    }


    animate(t) {
        // call initParticles each time in case we just deleted one
        this.initParticles();

        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        for(let i=0; i<this.numEmitters; i++) {
            this.emitters[i].draw();
        }

        for(let i=0; i<this.particles.length; i++) {
            this.particles[i].draw();
        }
        requestAnimationFrame(this.animate.bind(this));
    }
}
