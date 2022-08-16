import Performer from "./Performer";
import WaveRenderer from "../Renderer/WaveRenderer";

class PadPerformer extends Performer {
    constructor(x, y, radius, color, ctx, engine, padSoundSource) {
        super(x, y, radius, color, ctx, engine, 'pad', padSoundSource);
        this.frameCounter = 0;
        this.renderer = new WaveRenderer(x-radius, y-radius, radius*2, radius*2);
    }

    init(scaleNotes) {
        this.soundSource.init(scaleNotes);
    }

    addSoundSource(soundSource) {
        
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
            this.renderer.draw(ctx, this.soundSource.getColor());
            ctx.fillStyle = this.soundSource.getColor();

            ctx.beginPath();
            ctx.strokeStyle = this.soundSource.getColor();  
            ctx.lineWidth = 10;
            ctx.arc(0+this.radius, 0+this.radius, this.radius, 0, 2 * Math.PI);
            ctx.stroke();

            ctx.restore();
        }
        else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
          ctx.fillStyle = this.soundSource.getColor();
          ctx.fill();
        }
    }
}

export default PadPerformer;