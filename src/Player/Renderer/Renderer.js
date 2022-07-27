
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


}

export default Renderer;