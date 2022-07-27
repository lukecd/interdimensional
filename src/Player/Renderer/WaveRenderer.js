import Renderer from "./Renderer";

class WaveRenderer extends Renderer {

    // colors should be rgba(36, 92, 129, 0.4) array
    constructor(x, y, width, height, colors) {
        super(x, y, width, height);
        this.waveGroup = new WaveGroup(colors);
        // window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();
    }

    resize() {
        this.waveGroup.resize(this.width, this.height);
    }

    draw(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);

        this.waveGroup.draw(ctx);
    }
}

export default WaveRenderer;

/**
 * A single point along with math to modulate its y position
 */
class Point {
    constructor(index, x, y) {
        this.x = x;
        this.y = y;
        this.fixedY = y;
        this.speed = 0.005;
        this.cur = index;
        this.max = 50; //Math.random() * 100 + 550; 
        this.waveSpeed = 0.005;
    }

    update() {
        this.cur += this.waveSpeed;

        // move y up and down along a sin curve
        this.y = this.fixedY + (Math.sin(this.cur) * this.max);  
    }
}

/**
 * A wave is a grouping of n points connected using quadraticCurveTo
 */
class Wave {
    constructor(index, totalPoints, color) {
        this.index = index;
        this.totalPoints = totalPoints;
        this.color = color;
        this.points = [];
        this.resize();
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.centerX = width / 2;
        this.centerY = height / 2;
        // how much to space out points along the sine curve  
        this.pointGap = this.width / (this.totalPoints - 1);
        
        this.init();
    }

    init() {
        this.points = [];
        for(let i=0; i<this.totalPoints; i++) {
            const point = new Point(this.index+i, this.pointGap * i, this.centerY); 
            this.points[i] = point;
        }
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        let prevX = this.points[0].x;
        let prevY = this.points[0].y;
        
        // START i=1 so we don't update the first point
        for(let i=1; i<this.totalPoints; i++) {
            // don't update the last point
            if(i < this.totalPoints-1) this.points[i].update();

            const cx = (prevX + this.points[i].x) / 2;
            const cy = (prevY + this.points[i].y) / 2;

            context.quadraticCurveTo(prevX, prevY, cx, cy);

            prevX = this.points[i].x;
            prevY = this.points[i].y;
        }

        context.lineTo(prevX, prevY);
        context.lineTo(this.width, this.height);
        context.lineTo(this.points[0].x, this.height);

        context.fill();
        context.closePath();
    }
     
}

/**
 * Used to group n waves into one class. 
 * Right now it's hard-coded to 3, but that could be changed easily.
 */
class WaveGroup {
    constructor(colors) {
        this.totalWaves = 1;
        this.totalPoints = 6;
        
        this.colors = colors;
        this.waves = [];

        // create our waves and add to the wave group class
        for(let i=0; i<this.totalWaves; i++) {
            const wave = new Wave (i, this.totalPoints, this.colors[i]);
            this.waves[i] = wave;
        }
    }

    resize(width, height) {
        for(let i=0; i<this.totalWaves; i++) {
            const wave = this.waves[i];
            wave.resize(width, height);
        }
    }

    draw(context) {
        for(let i=0; i<this.totalWaves; i++) {
            const wave = this.waves[i];
            wave.draw(context);
        }     
    }
    
}