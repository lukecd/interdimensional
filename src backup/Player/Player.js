import Emitter from './Emitter.js';
import Matter from 'matter-js';


/**
 * Ok, honestly this seem a bit kludgy to have this one draw method 
 * here that then instantiates the objects needed for my design.
 * But seems like this is how to integrate Canvas stuff into
 * React? I need to study up on this some more. 
 * 
 * @param {*} context A reference to the site's context
 * @param {*} canvas A reference to the site's canvas
 */

 const draw = (context, canvas, engine) => {
    new Player(context, canvas, engine);
}
export default draw;


class Player {
    constructor(context, canvas, engine) {
        this.context = context;
        this.canvas = canvas;
        this.engine = engine;

        this.bgColor = '#12082D';
        this.colors = ['#8F0380', '#EC205B', '#FC7208', '#D00204', '#7701AD'];

        this.numEmitters = 5; //TEMP
        this.emitterRadius = 50;
        
        let emitters = [];
        for(let i=0; i<this.numEmitters; i++) {
            // random, but giving room so we don't go off screen

            let x = Math.random()* (window.innerWidth-(2*this.emitterRadius)) + (2*this.emitterRadius);
            let y = Math.random()* (window.innerHeight-(2*this.emitterRadius)) + (2*this.emitterRadius);
            emitters[i] = new Emitter(x, 
                                      y,
                                      this.emitterRadius,
                                      this.colors[Math.floor(Math.random() * this.numEmitters)],
                                      this.canvas,
                                      this.context,
                                      this.engine);
        }
        this.emitters = emitters;
        console.log(window.innerWidth);
        //todo: for some reason if i pass window.innerWidth, the width isn't long enough
        const ground = Matter.Bodies.rectangle(0, window.innerHeight, 3000, 10, { isStatic: true });
        Matter.World.add(engine.world, ground);

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();
        requestAnimationFrame(this.animate.bind(this));
    }

    resize() {
        this.width =  window.innerWidth;
        this.height =  window.innerHeight;
        // todo check if resize moved emitters off screen
    }

    animate(t) {
        this.context.fillStyle = this.bgColor;
        this.context.fillRect(0, 0, this.width, this.height);
        for(let i=0; i<this.numEmitters; i++) {
            this.emitters[i].draw();
        }
        requestAnimationFrame(this.animate.bind(this));
    }
}
