
class Renderer {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.fadeIn = false;
        this.fadeOut = false;
    }

    setFadeIn() {
        this.fadeIn = true;
    }

    setFadeOut() {
        this.fadeOut = true;
    }

    getFadeIn() {
        return this.fadeIn;
    }

    getFadeOut() {
        return this.fadeOut;
    }

    draw(ctx) {
        
    }

    randomIntFromRange(min, max) {
        return Math.floor(Math.random() * (max-min +1) + min);
    }

    /**
     * 
     * @notice Helper function to map one scale to another
     * Currently used to make circles smaller as they move away from the center
     */
    scale (number, inMin, inMax, outMin, outMax) {
        return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }


    // Standard Normal variate using Box-Muller transform.
    // Most of the generated numbers (around 99.7%) should fall into the range of -3.0 to +3.0
    randnBm() {
        var u = 0, v = 0;
        while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    }


}

export default Renderer;