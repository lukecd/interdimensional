import Matter from 'matter-js';
import chroma from "chroma-js";


import SplashScreenRenderer from './Renderer/SplashScreenRenderer.js';
import DotOrchestra from './Renderer/DotOrchestra.js';


/**
 * Ok, honestly this seem a bit kludgy to have this one draw method 
 * here that then instantiates the objects needed for my design.
 * But seems like this is how to integrate Canvas stuff into
 * React? I need to study up on this some more. 
 * 
 * @param {*} ctx A reference to the site's ctx
 * @param {*} canvas A reference to the site's canvas
 */

 const draw = (ctx, canvas, engine, play, setPlay, setDemoMode) => {
    new Player(ctx, canvas, engine, play, setPlay, setDemoMode);
}
export default draw;

/**
 * Player is a simple class that stores visual defaults and changes the 
 * active scene (Renderer). Right now it show the SplashScreenRenderer
 * on load and the DotOchestra screen when that's active.
 * 
 * My thought is that as I design different visualizers, I'll create new Renderer
 * sub-classes and swap between them here.
 */
class Player {
    constructor(ctx, canvas, engine, play, setPlay, setDemoMode) {
        console.log("new player")
        this.ctx = ctx;
        this.canvas = canvas;
        this.engine = engine;
        this.play = play;
        this.setPlay = setPlay;
        this.setDemoMode = setDemoMode;

        this.bgColor = '#12082D';
        this.colors = ['#8F0380', '#EC205B', '#FC7208', '#D00204', '#7701AD'];
        this.colorsRGBA = ['rgba(143, 3, 128, 1)', 'rgba(236, 32, 91, 0.9)', 'rgba(252, 114, 8, 0.9)', 'rgba(208, 2, 4, 0.5)', 'rgba(119, 1, 173, 0.5)']

        this.points = [];

        // handle resizing
        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();
        requestAnimationFrame(this.animate.bind(this));

        this.renderer = new SplashScreenRenderer(0, 0, this.width, this.height, this.bgColor, this.colors, this.engine, this, ctx);
        console.log('created renderered  this.renderer=',  this.renderer);
        console.log("ctx=", ctx)
    }

    /**
     * @notice Callback method used for the splashscreen to let us know it's time to launch the actual app.
     *         In the future, will probably be used to change visualizers.
     * @param {*} shouldDemo True if we should launch in demo mode
     */
    launchApp(shouldDemo) {
        // reset gravity
        this.engine.gravity.scale = 0.004;
        this.engine.gravity.x = 0.0;
        this.engine.gravity.y = 0.0;
        this.engine.frictionAir = 0;
        this.engine.frictionStatic = 0;
        this.engine.inertia = Infinity;
        this.engine.restitution = 1;

        this.setPlay(true);
        this.setDemoMode(shouldDemo);
        this.renderer = new DotOrchestra(0, 0, this.width, this.height, this.ctx, this.bgColor, 
                                         this.colors, this.engine, shouldDemo, this.play, this.setPlay);
    }

    resize() {
        this.width =  window.innerWidth;
        this.height =  window.innerHeight;
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;
    }

    /**
     * In animate, check if wallet is connected. If not, prompt to use in demo mode
     */
    animate(t) {
        this.renderer.draw(this.ctx);
        requestAnimationFrame(this.animate.bind(this));
    }

    getValue(x, y) {
        return (x + y) * 0.001 * Math.PI * 2;
        return (Math.sin(x * 0.01) + Math.sin(y * 0.0001)) * Math.PI * 2;
    }


}
