import Matter from 'matter-js';
import Particle from '../Renderer/Particle.js';
import chroma from "chroma-js";

class Performer {

    constructor(x, y, radius, color, ctx, engine, type, soundSource) {
        this.x = x; 
        this.y = y;
        this.radius = radius;
        this.ctx = ctx;
        this.engine = engine;
        this.type = type;
        this.soundSource = soundSource;
        this.shouldAnimate = false;
        this.position = Matter.Bodies.circle(x, y, radius, {
            isStatic: false,
            label: 'emitter'        
        });
        Matter.Composite.add(engine.world, this.position);

        this.color = color;
        // get 5 colors in a scale realted to our main color
        //this.colorScale = chroma.scale(color).colors(5);
        this.colorScale = chroma.scale([color, '#d90166']).colors(6);
        this.id = this.position.id;
    }

    getType() {
      return this.type;
    }

    /**
     * @notice Called when a new particle is being generated from our x,y
     * lets us know we should animate.
     */
    emit() {
    }

    updateColor(color) {
      this.color = color;
      this.position.color = color;
    }

    init(calldata) {
      this.soundSource.init(calldata);
    }

    play() {
      this.soundSource.play();
      this.shouldAnimate = true;
    }

    pause() {
      this.soundSource.pause();
      this.shouldAnimate = false;
    }
 
}

export default Performer;
