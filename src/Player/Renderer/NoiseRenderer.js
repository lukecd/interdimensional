import Renderer from "./Renderer";

class NoiseRenderer extends Renderer {

    // colors should be rgba(36, 92, 129, 0.4) array
    constructor(x, y, width, height, colors) {
        super(x, y, width, height);
        this.waveGroup = new WaveGroup(colors);
        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();
    }

    resize() {
        this.width =  window.innerWidth;
        this.height =  window.innerHeight;
        this.waveGroup.resize(this.width, this.height);
    }

    draw(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);
        this.waveGroup.draw(ctx);
    }
}

export default NoiseRenderer;