import WatercolorRenderer from "../Renderer/WatercolorRenderer";
import Performer from "./Performer";

class RhythmPerformer extends Performer {
    constructor(x, y, radius, color, ctx, engine, rhythmSoundSource) {
        super(x, y, radius, color, ctx, engine, 'rhythm', rhythmSoundSource);
        this.frameCounter = 0;
        this.renderer = new WatercolorRenderer(x-radius, y-radius, radius*2, radius*2, this.color);
    }

    init(scaleNotes, rhythm, tempo = '8n', duration = '8n', offset = 0) {
        this.soundSource.init(scaleNotes, rhythm, tempo, duration, offset);
    }

    draw(ctx) {        
        this.x = this.position.position.x;
        this.y = this.position.position.y;

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

export default RhythmPerformer;