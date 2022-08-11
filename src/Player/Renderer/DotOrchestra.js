import Matter from 'matter-js';
import Particle from './Particle.js';
import chroma from "chroma-js";

import Conductor from '../Conductor.js';

import DroneSource from '../SoundSource/DroneSource.js';
import PadSource from '../SoundSource/PadSource.js';
import RhythmSource from '../SoundSource/RhythmSource.js';

import Performer from '../Performer/Performer.js';
import DronePerformer from '../Performer/DronePerformer.js';
import PadPerformer from '../Performer/PadPerformer.js';
import RhythmPerformer from '../Performer/RhythmPerformer.js';
import WaveRenderer from '../Renderer/WaveRenderer.js';
import Renderer from '../Renderer/Renderer.js';

import { ethers } from "ethers";
import contractABI from '../../abi/InterdimensionalOne.json';
import * as Tone from "tone"

class DotOrchestra extends Renderer {

    constructor(x, y, width, height, ctx, bgColor, colors, engine, demoMode) {
        super(x, y, width, height);
        this.ctx = ctx; // TODO DO I NEED THIS?
        this.bgColor = bgColor;
        this.colors = colors;
        this.engine = engine;
        this.globalAlpha = 1;
        this.demoMode = demoMode;

        this.performerRadius = 50;

        this.resize();
        this.setupWalls();
        this.setupEvents();

        this.performers  = [];
        this.particles = [];
        this.soundSources = [];
        this.conductor = new Conductor(this, this.performers, this.particles, this.engine);
        window.$CONDUCTOR = this.conductor;

        if(demoMode) this.setupDemo();
        else this.setupFromNFTs();
    }

    setupDemo() {
        let x = Math.random() * (window.innerWidth-(2*this.performerRadius)) + (2*this.performerRadius);
        let y = Math.random() * (window.innerHeight-(2*this.performerRadius)) + (2*this.performerRadius);

        // drone first
        let droneSoundSource = new DroneSource(this, this.conductor);
        let dronePerformer = new DronePerformer(x, 
                                                y,
                                                this.performerRadius,
                                                this.bgColor,
                                                this.colors[0],
                                                this.ctx,
                                                this.engine,
                                                droneSoundSource);
        this.performers.push(dronePerformer);
        this.conductor.registerActor(dronePerformer);   

        x = Math.random() * (window.innerWidth-(2*this.performerRadius)) + (2*this.performerRadius);
        y = Math.random() * (window.innerHeight-(2*this.performerRadius)) + (2*this.performerRadius);
        // pad next
        let padSoundSource = new PadSource(this, this.conductor, 'pad-canyon');
        let padPerformer = new PadPerformer(x, 
                                            y,
                                            this.performerRadius,
                                            this.colors[1],
                                            this.ctx,
                                            this.engine,
                                            padSoundSource);
        console.log('padPerformer ', padPerformer);                                       
        this.performers.push(padPerformer);
        this.conductor.registerActor(padPerformer);     
        
        let rhythmSource1 = new RhythmSource(this, this.conductor, 'mallet-marimba');
        let rhythmPerformer1 = new RhythmPerformer(x, 
                                                   y,
                                                   this.performerRadius,
                                                   this.colors[2],
                                                   this.ctx,
                                                   this.engine,
                                                   rhythmSource1);   
        this.performers.push(rhythmPerformer1);
        this.conductor.registerActor(rhythmPerformer1); 

        let rhythmSource2 = new RhythmSource(this, this.conductor, 'mallet-mellow');
        let rhythmPerformer2 = new RhythmPerformer(x, 
                                                   y,
                                                   this.performerRadius,
                                                   this.colors[3],
                                                   this.ctx,
                                                   this.engine,
                                                   rhythmSource2);   
        this.performers.push(rhythmPerformer2);
        this.conductor.registerActor(rhythmPerformer2);     
        
        this.conductor.play();
        window.$music_playing = true;
    }

    async setupFromNFTs() {

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        let accounts = await provider.send("eth_requestAccounts", []);
        let account = accounts[0];
        provider.on('accountsChanged', function (accounts) {
            account = accounts[0];
            console.log('new address:', address); // Print new address
        });
    
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log('DotOrchestra logged in address=', address);

        const nftContract = new ethers.Contract(window.$CONTRACT_ADDRESS, contractABI, signer);
        console.log("nftContract ", nftContract)
        let myNFTs = [];
        try{ myNFTs = await nftContract.getMyNFTS(); }
        catch(error) {console.log("error when querying for getMyNFTS ", error)}
        console.log("curNFTs ", myNFTs);

        let myPrototypes = [];
        try{ myPrototypes = await nftContract.getPrototypesForCollectionId(1); }
        catch(error) {console.log("error when querying for allNFTs ", error)}
        console.log("myPrototypes ", myPrototypes);

        // not the best state mgmt, need to figure out better way
        // assign to a local variable first to make it easier to change later
        for(let i=0; i<myNFTs.length; i++) {
            const prototype = this.getPrototypePrototypeId(myNFTs[i].prototypeId.toString(), myPrototypes);
            console.log("prototype ", prototype)
            const nftType = prototype.part;
            const soundFiles = prototype.soundFiles;
            const color = prototype.color;
            const instrument = prototype.instrument;

            console.log("soundFiles ", soundFiles)
            let sounds = soundFiles.toString();
            // FOR SOME STRANGE ASS REASON, this string comes through as encoded when I get it from 
            // wagmi hooks and as plain text when I query it directly via ethers. 
            // NO CLUE WHY, but I'm leaving this comment and the following line in as
            // I have a feeling things will change in the future and maybe leaving this here
            // will save me from banging my head against my desk too much ... maybe
            //sounds = ethers.utils.toUtf8String(sounds);
            let soundOBJ = JSON.parse(sounds);
            console.log("soundOBJ ", soundOBJ)
            const x = Math.random() * (window.innerWidth-(2*this.performerRadius)) + (2*this.performerRadius);
            const y = Math.random() * (window.innerHeight-(2*this.performerRadius)) + (2*this.performerRadius);

            if(nftType === 'drone') {
                let droneSoundSource = new DroneSource(this, this.conductor, soundOBJ);
                console.log("droneSoundSource=", droneSoundSource);
                let dronePerformer = new DronePerformer(x, 
                                                        y,
                                                        this.performerRadius,
                                                        this.bgColor,
                                                        color,
                                                        this.ctx,
                                                        this.engine,
                                                        droneSoundSource);
                console.log("dronePerformer=", dronePerformer);
                this.performers.push(dronePerformer);
                this.conductor.registerActor(dronePerformer);   
                console.log("registered actor");
            }
            else if(nftType === 'pad') {
                let padSoundSource = new PadSource(this, this.conductor, instrument, soundOBJ);
                let padPerformer = new PadPerformer(x, 
                                                    y,
                                                    this.performerRadius,
                                                    color,
                                                    this.ctx,
                                                    this.engine,
                                                    padSoundSource);
                console.log('padPerformer ', padPerformer);                                       
                this.performers.push(padPerformer);
                this.conductor.registerActor(padPerformer);     
            }
            else if(nftType === 'rhythm') {
                let rhythmSource2 = new RhythmSource(this, this.conductor, instrument, soundOBJ);
                let rhythmPerformer2 = new RhythmPerformer(x, 
                                                           y,
                                                           this.performerRadius,
                                                           color,
                                                           this.ctx,
                                                           this.engine,
                                                           rhythmSource2);   
                this.performers.push(rhythmPerformer2);
                this.conductor.registerActor(rhythmPerformer2);     
            }
        }

        this.conductor.play();
        window.$music_playing = true;
    }

    getPrototypePrototypeId(prototypeId, prototypes) {
        for(let i=0; i<prototypes.length; i++) {
            if(prototypes[i].prototypeId.toString() == prototypeId) {
                return prototypes[i];
            }
        }
    }


    setupEvents() {
        window.addEventListener('resize', this.resize.bind(this), false);

        // store a reference to this so we can access from within the event
        const self = this;
        Matter.Events.on(this.engine, 'collisionStart', function(event) {
            // console.log("collision");
             const pairs = event.pairs;
     
             // change object colours to show those starting a collision
             for (let i = 0; i < pairs.length; i++) {
                 //console.log(pairs[i].bodyA);
                 //console.log(pairs[i].bodyA.position);
                 
                 // if two particles hit eachother
                 if(pairs[i].bodyA.label === 'particle' && pairs[i].bodyB.label === 'particle') {
                    // when merge happens, change color of bodyA and delete bodyB
                    const idA = pairs[i].bodyA.id;
                    const idB = pairs[i].bodyB.id;
                    let indexA = -1;
                    let indexB = -1;
                    // find the array indexes of the particles given their ids
                    for(let j=0; j<self.particles.length; j++) {
                        if(self.particles[j].id == idA) indexA = j;
                        else if(self.particles[j].id == idB) indexB = j;
                    }
                    // change color of particle A to a mix of A & B
                    const newColor = self.evolveColor(self.particles[indexA].color, self.particles[indexB].color);
                    self.particles[indexA].updateColor(newColor);

                    // retire particle B
                    self.particles[indexB].retire();
                 }
                 // if a particle hits an performer, merge both of their colors
                 else if ( (pairs[i].bodyA.label === 'particle' && pairs[i].bodyB.label === 'performer') ||
                           (pairs[i].bodyA.label === 'performer' && pairs[i].bodyB.label === 'particle')) {
                    let particleId = -1;
                    let performerId = -1;
                    if(pairs[i].bodyA.label === 'particle') {
                        // bodyA is particle, bodyB is performer
                        particleId = pairs[i].bodyA.id;
                        performerId = pairs[i].bodyB.id;
                    }
                    else {
                         // bodyA is performer, bodyB is particle
                         performerId = pairs[i].bodyA.id;
                         particleId = pairs[i].bodyB.id;    
                    }
                    let indexParticle = -1;
                    let indexPerformer = -1;
                    // find the array index of the particle
                    for(let j=0; j<self.particles.length; j++) {
                        if(self.particles[j].id == particleId) indexParticle = j;
                    }
                    // find the array index of the performer                    
                    for(let j=0; j<self.performers.length; j++) {
                        if(self.performers[j].id == performerId) indexPerformer = j;
                    }
               
                    const newColor = self.evolveColor(self.particles[indexParticle].color, 
                        self.performers[indexPerformer].color);
                    self.particles[indexParticle].updateColor(newColor); 
                    self.performers[indexPerformer].updateColor(newColor); 
                 }
             }
         });
    }

    /**
     * @notice Logic for evolving a color on collision
     * Most of the time uses chroma.mix and mixes them, some of the time
     * a totally random color is sent back. Encapsualted the logic
     * into this function as it will likely change lots as the app develops.
     */
    evolveColor(c1, c2) {
        const rnd = Math.random();
        if(rnd >= 0.5) return chroma.mix(c1, c2);
        return chroma.random();
    }

    setupWalls() {
        const wallOptions = {
            isStatic: true
        }
        const thickness = 50;
        const navBarHeight = 90;
        const width = window.innerWidth;
        const height = window.innerHeight;
        Matter.Composite.add(this.engine.world, [
            Matter.Bodies.rectangle(width/2, height, width, thickness, wallOptions), // bottom
            Matter.Bodies.rectangle(width, height/2, thickness, height, wallOptions), // right
            Matter.Bodies.rectangle(width/2, navBarHeight, width, thickness, wallOptions), // top
            Matter.Bodies.rectangle(0, height/2, thickness, height, wallOptions) // left
        ]);
    }

    resize() {
        this.width =  window.innerWidth;
        this.height =  window.innerHeight;
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;

        // // intro screen
        // for(let i=0; i<this.colors.length; i++) {
        //     const p = {
        //         x: Math.random() * this.width,
        //         y:  Math.random() * this.height,
        //         vx: 0,
        //         vy: 0,
        //         color: this.colors[i]
        //         };
        //     this.points.push(p);
        // }


        // todo remove old walls
        //this.setupWalls();
        // todo check if resize moved performers off screen
    }

    getRandom(min, max) {
        return (min + Math.random()*(max - min + 1))
    }

    draw(ctx) {
        // this is kinda messy, probably slows stuff down with too many calls. 
        // TODO; reorganize
        if(window.$music_playing) {
            this.conductor.play();
        }
        else {
            this.conductor.pause();
        }

        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);

        for(let i=0; i<this.performers.length; i++) {
            this.performers[i].draw(ctx);
        }

        for(let i=0; i<this.particles.length; i++) {
            // since we want the retirement fade away animation to finish, 
            // we constantly check if it's done and then we remove from the master array.
            if(this.particles[i].isRetired) {
                this.particles.splice(i, 1);
                i++; // increase i since our array is now i shorter
            }
            else {
                this.particles[i].draw(ctx);
            }
        }
    }
}

export default DotOrchestra;