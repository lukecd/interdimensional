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
        this.renderer = null;

        // maintain the two way relationship between Performer and SoundSource
        this.soundSource.setPerformer(this);

        // create our position and add to matter.js
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
    
    getRenderer() {
      return this.renderer;
    }

    getSoundsource() {
      return this.soundSource;
    }
}

export default Performer;
