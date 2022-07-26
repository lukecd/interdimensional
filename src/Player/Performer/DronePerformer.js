import Performer from "./Performer";

class DronePerformer extends Performer {

    constructor(x, y, radius, color, ctx, engine) {
        super(x, y, radius, color, ctx, engine);
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.ctx.clip();
        
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}

export default DronePerformer;