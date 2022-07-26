import Renderer from "./Renderer";
import Matter from 'matter-js';

class BlackHoleRenderer extends Renderer {

    constructor(x, y, width, height, bgColor, colors, engine) {
        super(x, y, width, height);
        this.colors = colors;
        this.engine = engine;
        this.maxDots = 3000;
        this.numDots = 0;
        this.centerButtonRadius = 100;
        this.mouseX = 0;
        this.mouseY = 0;

        // so i'm hosting this font locally, not sure it's the best way
        // TODO: figure it out
        let myFont = new FontFace(
            "Orbitron",
            "url(/fonts/orbitron/orbitron-v25-latin-regular.woff2)"
        );
        myFont.load().then((font) => {
            document.fonts.add(font);
        });

        const allBodies = Matter.Composite.allBodies(this.engine.world)
        console.log('allBodies ', allBodies)

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();
        this.setupEvents();
        this.composite = Matter.Composite.create();
        this.engine.gravity.x = 0.0;
        this.engine.gravity.y = 0.0;
        Matter.Composite.add(this.engine.world, this.composite);

        this.demoModeButton = Matter.Bodies.circle(0, 0, this.centerButtonRadius, {
            mass: 0.005,
            friction: 0,
            frictionAir: 0.02,
            label: 'blackhole',
            color: bgColor,
            radius: this.centerButtonRadius,
            isStatic: true
        });
        Matter.Composite.add(this.composite, this.demoModeButton);

        // this.demoModeButton = new Path2D()
        // this.demoModeButton.rect(this.width/2-100, this.height/2-37, 200, 75);
        // this.demoModeButton.closePath();
    }

    setupEvents() {
        const self = this;

        document.addEventListener("mousemove",  function (e) {
            // e.x, e.y is based on 0,0 being in top left
            // during draw we translate to center (width / 2, height 2)
            // since I need to know mouse position relative to center, adjust here
            self.mouseX = e.x - (self.width/2);
            self.mouseY = e.y - (self.height/2);
            //console.log("x, y="+self.mouseX+", "+self.mouseY)
        }, false)

        document.addEventListener("click",  function (e) {
            self.mouseX = e.x - (self.width/2);
            self.mouseY = e.y - (self.height/2);

            if((self.mouseX > 0-self.centerButtonRadius+50) &&
                (self.mouseX < self.centerButtonRadius) &&
                (self.mouseY < 30) &&
                (self.mouseY > -5)) {
                    
                self.launchDemoMode();
            }
            else if((self.mouseX > 0-self.centerButtonRadius+50) &&
                    (self.mouseX < self.centerButtonRadius) &&
                    (self.mouseY < 60) &&
                    (self.mouseY > 31)) {
                self.launchWalletMode();
    
            }
            
        }, false)
    }

    getXY(canvas, event){ //adjust mouse click to canvas coordinates
        const rect = this.ctx.canvas.getBoundingClientRect()
        const y = event.clientY - rect.top
        const x = event.clientX - rect.left
        return {x:x, y:y}
    }

    resize() {
        this.width =  window.innerWidth;
        this.height =  window.innerHeight;
    }

    launchDemoMode() {
        this.engine.gravity.y = 0.1;
    }

    launchWalletMode() {

    }

    draw(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);

        const blackHoleSize  = 1000 ;//Math.abs(this.randnBm()) * 20;
        ctx.save();
        ctx.translate(this.width / 2, this.height / 2); // move x, y to center
        // each call to draw() we do one trip around the circle and add to the array of particles
        if(this.numDots <= this.maxDots) {
            for(let a=0; a< 2*Math.PI; a+=0.05) {
                const x = blackHoleSize * Math.cos(a) * Math.abs(this.randnBm());
                const y = blackHoleSize * Math.sin(a) * Math.abs(this.randnBm());
                const colorIndex = Math.floor(Math.random() * this.colors.length);
                const dotSize = Math.abs(this.scale(Math.abs(x), 0, this.width / 2, 15, 1));
    
                const particle = Matter.Bodies.circle(x, y, dotSize, {
                    mass: 0.005,
                    friction: 0,
                    frictionAir: 0.02,
                    label: 'blackhole',
                    color: this.colors[colorIndex],
                    radius: dotSize
                });
                Matter.Composite.add(this.composite, particle);
                this.numDots++;
            }
        }

        // then we iterate over the particles and draw them
        const allBodies = Matter.Composite.allBodies(this.composite);
        for(let i=0; i<allBodies.length; i++) {
            if(allBodies[i].label === 'blackhole') {
                ctx.beginPath();
                ctx.arc(allBodies[i].position.x, allBodies[i].position.y, allBodies[i].radius, 0, 2 * Math.PI);
                ctx.fillStyle = allBodies[i].color;
                ctx.fill();
            }
        }

        // then add text to the middle button
        ctx.font = "35px Orbitron";
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText("Ready?", 0-this.centerButtonRadius+35, 0);

        ctx.font = "15px Orbitron";
        if((this.mouseX > 0-this.centerButtonRadius+50) &&
           (this.mouseX < this.centerButtonRadius) &&
           (this.mouseY < 30) &&
           (this.mouseY > -5)) {

            ctx.fillStyle = this.colors[1];
            const width = ctx.measureText("Demo Mode");
            ctx.fillRect(0-this.centerButtonRadius+48, 30-15, width.width+5, 17);
        }
        else if((this.mouseX > 0-this.centerButtonRadius+50) &&
                (this.mouseX < this.centerButtonRadius) &&
                (this.mouseY < 60) &&
                (this.mouseY > 31)) {
                ctx.fillStyle = this.colors[1];
                const width = ctx.measureText("Wallet Mode");
                ctx.fillRect(0-this.centerButtonRadius+48, 60-15, width.width+5, 17);

        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText("Demo Mode", 0-this.centerButtonRadius+50, 30);
        ctx.fillText("Wallet Mode", 0-this.centerButtonRadius+50, 60);
        ctx.restore();
        //console.log("x, y"+this.mouseX+", "+this.mouseY)
        //var width = ctx.measureText("text")
    }

    // Standard Normal variate using Box-Muller transform.
    // Most of the generated numbers (around 99.7%) should fall into the range of -3.0 to +3.0
    randnBm() {
        var u = 0, v = 0;
        while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    }

    /**
     * 
     * @notice Helper function to map one scale to another
     * Currently used to make circles smaller as they move away from the center
     */
    scale (number, inMin, inMax, outMin, outMax) {
        return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }
}

class BlackHoleParticle {
    constructor(x, y) {

    }
}

export default BlackHoleRenderer;