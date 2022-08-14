import Renderer from "./Renderer";
import Matter from 'matter-js';
import chroma from "chroma-js";

/**
 * Renders the opening splash screen.
 * Gives user option to launch in Demo mode or NFT mode.
 */
class GenerativeSpaceRenderer extends Renderer {

    constructor(x, y, width, height, bgColor, ctx) {
        super(x, y, width, height);
        this.bgColor = bgColor;
        this.ctx = ctx;
        this.color = chroma.random();
        this.mouseX = 0;
        this.mouseY = 0;
        this.sunRadius = 50;
        const numPlanets = this.randomIntFromRange(3, 5);
        const numOrbits = this.randomIntFromRange(numPlanets+1, numPlanets*1.6);
        this.orbits = this.bresenhamEuclidean(numPlanets, numOrbits);
        this.circles = [];
        this.shouldReveal = true;

        this.colorAlpha = 1;

        this.init();
        this.animate();
    }

    resize() {
        this.width =  window.innerWidth;
        this.height =  window.innerHeight;
    }

    /**
     * @notice Initial setup
     */
    init() {
        // the "sun"
        this.circles.push({
            x: this.width/2,
            y: this.width / 2,
            radius: this.sunRadius,
            color: this.color,
            fill: true,
            isPlanet: false
        });

        // planet colors
        // make the scale 6 longer than we need so we can ignore the first 3 and last 3
        const colorScale = chroma.scale([this.bgColor,this.color]).mode('lch').colors(this.orbits.length+6);

        // draw the orbital paths
        const radiusIncrease = (this.width/2 - this.sunRadius) / this.orbits.length;
        let curRadius = this.sunRadius + radiusIncrease;
        for(let i=0; i<this.orbits.length; i++) {
            if(this.orbits[i] === 1) {
                // orbital path
                this.circles.push({
                    x: this.width / 2,
                    y: this.width / 2,
                    radius: curRadius,
                    color: this.color,
                    fill: false,
                    isPlanet: false,
                    lineWidth: 1+i
                });

                const angle = Math.random() * Math.PI*2;
                const x = Math.cos(angle) * curRadius;
                const y = Math.sin(angle) * curRadius;
                const planetRadius = this.randomIntFromRange(10, 40);

                // planet
                this.circles.push({
                    x: (this.width / 2) - x,
                    y: (this.height / 2) - y,
                    radius: planetRadius,
                    color: colorScale[i+3],
                    fill: true,
                    isPlanet: true,
                    angle: angle,
                    parentRadius: curRadius
                });          
            }
            curRadius += radiusIncrease;           
        }

    }

    /**
     * 
     * @notice Main animation loop. Called ~60x a second
     */
    animate(time) {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        for(let i=0; i<this.circles.length; i++) {
            if(this.circles[i].fill) {
                // if we are a planet, update orbit
                if(this.circles[i].isPlanet) {
                    // make items closer to the "sun" move faster
                    // lazy orbital math
                    this.circles[i].angle += 0.001 + ( (this.circles.length - i) / 1000);
                    const x = Math.cos(this.circles[i].angle) * this.circles[i].parentRadius;
                    const y = Math.sin(this.circles[i].angle) * this.circles[i].parentRadius;

                    this.circles[i].x = (this.width / 2) - x;
                    this.circles[i].y = (this.height / 2) - y;
                }
                // draw planet
                this.ctx.beginPath();
                this.ctx.arc(this.circles[i].x, this.circles[i].y, this.circles[i].radius, 0, 2 * Math.PI);
                this.ctx.fillStyle = this.circles[i].color;
                this.ctx.fill();
            }
            else {
                // draw orbital path
                this.ctx.beginPath();
                this.ctx.arc(this.circles[i].x, this.circles[i].y, this.circles[i].radius, 0, 2 * Math.PI);
                this.ctx.lineWidth = this.circles[i].lineWidth; 
                this.ctx.strokeStyle = this.circles[i].color;
                this.ctx.stroke();
            }
        }

        // then cover it up ... or slowly reveal
        if(this.shouldReveal && this.colorAlpha > 0) {
            this.ctx.fillStyle = this.bgColor;
            this.ctx.globalAlpha = this.colorAlpha;
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.colorAlpha -= 0.01;
            this.ctx.globalAlpha = 1;
        }
        if(!this.shouldReveal) {
            this.ctx.fillStyle = this.bgColor;
            this.ctx.fillRect(0, 0, this.width, this.height);  
        }

        requestAnimationFrame(this.animate.bind(this));
    }

    /**
     * @notice At launch we cover the design with a solid color, then we slowly fade that away.
     */
    beginReveal() {
        this.shouldReveal = true;
    }

   /**
    * @notice Helper method to generate euclidean rhythms using the Bresenham Line method
    * Based on code in https://medium.com/code-music-noise/euclidean-rhythms-391d879494df
    * Returns an array representing a binary sequence. Play on a 1, rest on a 0.
    * 
    * This is the same alrorithm I use to generate rhythms, realized it works well to create visuals too
    */
    bresenhamEuclidean(onsets, totalPulses) {
        let previous = null;
        let pattern = [];

        for (let i = 0; i < totalPulses; i++) {
            var xVal = Math.floor((onsets  / totalPulses) * i);
            pattern.push(xVal === previous ? 0 : 1);
            previous = xVal;
        }
        return pattern;
    }

    /**
     * @notice Helper function to shift a binary sequence representing a rhythm a total of numShifts shifts
     */
    shiftRhythm(rhythm, numShifts) {
        for(let i=0; i<numShifts; i++) {
            const shiftee = rhythm.shift();
            rhythm.push(shiftee);
        }
        return rhythm;
    } 

    /**
     * @notice converts the current design array to SVG data
     */
    toSVG() {
        let svgVersion =  `<svg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' viewBox='0 0 400 400' style='background-color:${this.bgColor}'>`;

        //let svgVersion = `<svg height='400' width='400' style='background-color:${this.bgColor}'>`;

        for(let i=0; i<this.circles.length; i++) {
            if(this.circles[i].fill) {
                svgVersion += `<circle cx='${this.circles[i].x}' cy='${this.circles[i].y}' r='${this.circles[i].radius}' fill='${this.circles[i].color}' />`;
            }
            else {
                svgVersion += `<circle cx='${this.circles[i].x}' cy='${this.circles[i].y}' r='${this.circles[i].radius}' stroke='${this.circles[i].color}' stroke-width='${this.circles[i].lineWidth}' fill-opacity='0' />`;
            }
        }

        svgVersion += '</svg>';
        return svgVersion;
    }
}

export default GenerativeSpaceRenderer;