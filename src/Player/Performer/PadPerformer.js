import Performer from "./Performer";
import WaveRenderer from "../Renderer/WaveRenderer";

class PadPerformer extends Performer {
    constructor(x, y, radius, color, ctx, engine, padSoundSource) {
        super(x, y, radius, color, ctx, engine, 'pad', padSoundSource);
        this.frameCounter = 0;
        this.renderer = new WaveRenderer(x-radius, y-radius, radius*2, radius*2, this.colorScale);
    }

    init(scaleNotes, chords) {
        this.soundSource.init(scaleNotes, chords);
    }

    draw(ctx) {        
        this.x = this.position.position.x;
        this.y = this.position.position.y;
        // this.renderer.x = this.x;
        // this.renderer.y = this.y;

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

export default PadPerformer;