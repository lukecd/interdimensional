import Performer from './Performer.js';
import Matter from 'matter-js';
import Particle from './Particle.js';
import chroma from "chroma-js";
import Conductor from './Conductor.js';

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
        this.maxParticles = 5;
        this.performerRadius = 50;
        this.numPerformers = 5;
        
        // no, this not bad OOP, it's just the easiest way to manage things. 
        // both particles and performers are both at the same level as we need an 
        // easy way to handle merging particles made by different performers. 
        // if particles were a child class of performers, it would be tricky to handle
        // cross-performer merges.
        this.particles = [];
        let performers = [];
        for(let i=0; i<this.colors.length; i++) {
            // random, but giving room so we don't go off screen
            let x = Math.random()* (window.innerWidth-(2*this.performerRadius)) + (2*this.performerRadius);
            let y = Math.random()* (window.innerHeight-(2*this.performerRadius)) + (2*this.performerRadius);
            performers[i] = new Performer(x, 
                                      y,
                                      this.performerRadius,
                                      //this.colors[Math.floor(Math.random() * this.numPerformers)],
                                      this.colors[i],
                                      this.ctx,
                                      this.engine);
        }
        this.performers = performers;

        this.conductor = new Conductor(this.performers, this.particles);

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
                    const newColor = self.evolveColor(self.particles[indexA].color, self.particles[indexB].color);
                    self.particles[indexA].updateColor(newColor);

                    // retire particle B
                    self.particles[indexB].retire();
                 }
                 // if a particle hits an performer, merge both of their colors
                 else if ( (pairs[i].bodyA.label === 'particle' && pairs[i].bodyB.label === 'performer') ||
                           (pairs[i].bodyA.label === 'performer' && pairs[i].bodyB.label === 'particle')) {
                    let particleId = -1;
                    let performerId = -1;
                    if(pairs[i].bodyA.label === 'particle') {
                        // bodyA is particle, bodyB is performer
                        particleId = pairs[i].bodyA.id;
                        performerId = pairs[i].bodyB.id;
                    }
                    else {
                         // bodyA is performer, bodyB is particle
                         performerId = pairs[i].bodyA.id;
                         particleId = pairs[i].bodyB.id;    
                    }
                    let indexParticle = -1;
                    let indexPerformer = -1;
                    // find the array index of the particle
                    for(let j=0; j<self.particles.length; j++) {
                        if(self.particles[j].id == particleId) indexParticle = j;
                    }
                    // find the array index of the performer                    
                    for(let j=0; j<self.performers.length; j++) {
                        if(self.performers[j].id == performerId) indexPerformer = j;
                    }
               
                    const newColor = self.evolveColor(self.particles[indexParticle].color, 
                        self.performers[indexPerformer].color);
                    self.particles[indexParticle].updateColor(newColor); 
                    self.performers[indexPerformer].updateColor(newColor); 
                 }
             }
         });
    }

    /**
     * @notice Logic for evolving a color on collision
     * Most of the time uses chroma.mix and mixes them, some of the time
     * a totally random color is sent back. Encapsualted the logic
     * into this function as it will likely change lots as the app develops.
     */
    evolveColor(c1, c2) {
        const rnd = Math.random();
        if(rnd >= 0.5) return chroma.mix(c1, c2);
        return chroma.random();
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
            // randomally select an performer
            const performerId = Math.floor(Math.random() * this.performers.length);
            this.performers[performerId].emit();
            this.particles.push(new Particle(this.performers[performerId].x, 
                this.performers[performerId].y, 
                this.performers[performerId].radius / 2, 
                this.performers[performerId].color,
                this.ctx,
                this.engine));

        }
    }

    resize() {
        this.width =  window.innerWidth;
        this.height =  window.innerHeight;
        // todo check if resize moved performers off screen
    }

    getRandom(min, max) {
        return (min + Math.random()*(max - min + 1))
    }


    animate(t) {
        if(window.$music_playing) {
            this.conductor.play();
        }
        // call initParticles each time in case we just deleted one
        this.initParticles();

        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        for(let i=0; i<this.numPerformers; i++) {
            this.performers[i].draw();
        }

        for(let i=0; i<this.particles.length; i++) {
            // since we want the retirement fade away animation to finish, 
            // we constantly check if it's done and then we remove from the master array.
            if(this.particles[i].isRetired) {
                this.particles.splice(i, 1);
                i++; // increase i since our array is now i shorter
            }
            else {
                this.particles[i].draw();
            }
        }
        requestAnimationFrame(this.animate.bind(this));
    }
}
