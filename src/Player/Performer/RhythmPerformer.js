import Performer from "./Performer";

class RhythmPerformer extends Performer {
    constructor(x, y, radius, color, ctx, engine, rhythmSoundSource) {
        super(x, y, radius, color, ctx, engine, 'rhythm', rhythmSoundSource);
        this.frameCounter = 0;
        this.renderer = null;
    }

    init(scaleNotes, rhythm, tempo = '8n', duration = '8n', offset = 0) {
        this.soundSource.init(scaleNotes, rhythm, tempo, duration, offset);
    }

    draw(ctx) {        
        this.x = this.position.position.x;
        this.y = this.position.position.y;

        if(this.shouldAnimate) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill();
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