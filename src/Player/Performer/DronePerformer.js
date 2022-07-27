import Performer from "./Performer";

class DronePerformer extends Performer {

    constructor(x, y, radius, color, ctx, engine, droneSoundSource) {
        super(x, y, radius, color, ctx, engine, 'drone', droneSoundSource);
        this.frameCounter = 0;
    }

    draw(ctx) {        
        this.x = this.position.position.x;
        this.y = this.position.position.y;

        if(this.shouldAnimate) {
          this.frameCounter++;
          const circleCount = this.colorScale.length;
          let startRadius = this.radius;
          for(let i=0; i<circleCount; i++) {
    
            ctx.beginPath();
            ctx.arc(this.x, this.y, startRadius, 0, 2 * Math.PI);
            ctx.fillStyle = this.colorScale[i];
            ctx.fill();           
            startRadius -= (this.radius / circleCount);
          }
          // shift the colors every 9 renders (so people have time to see)
          if(this.frameCounter % 9 == 0) {
            const colorToMove = this.colorScale.shift();
            this.colorScale.push(colorToMove);
          }

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