import Performer from "./Performer";
import BlackHoleRenderer from "../Renderer/BlackHoleRenderer.js";

class DronePerformer extends Performer {

    constructor(x, y, radius, bgColor, color, ctx, engine, droneSoundSource) {
        super(x, y, radius, color, ctx, engine, 'drone', droneSoundSource);
        this.frameCounter = 0;
        this.renderer = new BlackHoleRenderer(x-radius, y-radius, radius*2, radius*2, bgColor, this.color, ctx);
//        this.renderer = new BlackHoleRenderer(x, y, radius, radius, this.color);
    }

    draw(ctx) {        
        this.x = this.position.position.x;
        this.y = this.position.position.y;

        // TEMP FOR TESTING
        this.shouldAnimate = true;

        if(this.shouldAnimate) {
          ctx.save();
          ctx.translate(this.x-this.radius, this.y-this.radius); 
          ctx.beginPath();
          ctx.arc(0+this.radius, 0+this.radius, this.radius, 0, 2 * Math.PI);
          ctx.clip();
          this.renderer.draw(ctx);
          ctx.fillStyle = this.color;

          ctx.beginPath();
          ctx.strokeStyle = this.color;  
          ctx.lineWidth = 10;
          ctx.arc(0+this.radius, 0+this.radius, this.radius, 0, 2 * Math.PI);
          ctx.stroke();

          ctx.restore();
        }
        else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
    }
}

export default DronePerformer;