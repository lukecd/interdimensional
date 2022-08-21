import Renderer from "./Renderer";
import Matter from 'matter-js';
import * as Tone from "tone"


/**
 * Renders the opening splash screen.
 * Gives user option to launch in Demo mode or NFT mode.
 */
class SplashScreenRenderer extends Renderer {

    constructor(x, y, width, height, bgColor, colors, engine, player, ctx) {
        super(x, y, width, height);
        this.colors = colors;
        this.engine = engine;
        this.player = player;
        this.maxDots = 3000;
        this.numDots = 0;
        this.centerButtonRadius = 100;
        this.mouseX = 0;
        this.mouseY = 0;
        this.globalAlpha = 1;
        this.isDemoMode = true;

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
        
        //TODO FIGURE OUT WHY mouse isn't working on spalsh screen
        // const mMouse = Matter.Mouse.create(ctx.canvas);
        // let options = {
        //   mouse: mMouse
        // }
        // const mConstraint = Matter.MouseConstraint.create(engine, options);
        // Matter.Composite.add(engine.world, mConstraint);
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
       
                self.launchNFTMode();
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

    /**
     * @notice Triggers the exit animation and sets parameters for demo mode
     *         On completion of the animation, a callback will be made to launch the app
     */
    launchDemoMode() {
        this.isDemoMode = true;
        this.engine.gravity.y = 0.1;
        super.setFadeOut(true);
        Tone.Transport.start();
    }

    /**
    * @notice Triggers the exit animation and sets parameters for demo mode
    *         On completion of the animation, a callback will be made to launch the app
    */
    launchNFTMode() {
        this.isDemoMode = false;
        this.engine.gravity.y = 0.1;
        super.setFadeOut(true);
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
                const width = ctx.measureText("NFT Mode");
                ctx.fillRect(0-this.centerButtonRadius+54, 60-15, width.width+5, 17);

        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText("Demo Mode", 0-this.centerButtonRadius+50, 30);
        ctx.fillText("NFT Mode", 0-this.centerButtonRadius+55, 60);
        ctx.restore();
        
        if(this.getFadeOut()) {
            ctx.globalAlpha = this.globalAlpha;
            this.globalAlpha -= 0.009;
            if(this.globalAlpha <= 0) {
                // this actually launches the app, clicking the button just triggers the animation
                this.player.launchApp(this.isDemoMode);
                this.engine.gravity.y = 0.0;
            }
        }
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

export default SplashScreenRenderer;