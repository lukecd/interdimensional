import Matter from 'matter-js';
import Particle from './Particle.js';
import chroma from "chroma-js";

import Conductor from '../Conductor.js';

import DroneSource from '../SoundSource/DroneSource.js';
import PadSource from '../SoundSource/PadSource.js';
import RhythmSource from '../SoundSource/RhythmSource.js';
import AtmosphereSource from '../SoundSource/AtmosphereSource.js';
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

        this.droneSoundSource = null;
        this.padSoundSource = null;
        this.rhythmSource1 = null;
        this.rhythmSource2 = null;

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
        let droneSoundSource = new DroneSource(this.conductor, this.colors[0]);
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
        let padSoundFiles = {
            urls: {
                C3: "pad-e-canyon-C3.mp3",
                D3: "pad-e-canyon-D3.mp3",
                E3: "pad-e-canyon-E3.mp3",
                F3: "pad-e-canyon-F3.mp3",
                G3: "pad-e-canyon-G3.mp3",
                A3: "pad-e-canyon-A3.mp3",
                B3: "pad-e-canyon-B3.mp3",
            },
            baseUrl: "/audio/pads/pad-canyon/",
            envelope: {
                attack: 1,
                release: 4
            }
        };
        let padSoundSource = new PadSource(this.conductor, 'pad-canyon', padSoundFiles, this.colors[1]);
        let padPerformer = new PadPerformer(x, 
                                            y,
                                            this.performerRadius,
                                            this.colors[1],
                                            this.ctx,
                                            this.engine,
                                            padSoundSource);
        this.performers.push(padPerformer);
        this.conductor.registerActor(padPerformer);     
        
        // rhytms
        let rhythmSoundFiles1 = {
            urls: {
                C3: "mallet-marimba-C3.mp3",
                D3: "mallet-marimba-D3.mp3",
                E3: "mallet-marimba-E3.mp3",
                F3: "mallet-marimba-F3.mp3",
                G3: "mallet-marimba-G3.mp3",
                A3: "mallet-marimba-A3.mp3",
                B3: "mallet-marimba-B3.mp3",
            },
            baseUrl: "/audio/mallets/mallet-marimba/",
            envelope: {
                attack: .25,
                release: 2
            }
        };
        let rhythmSource1 = new RhythmSource(this.conductor, 'mallet-marimba', rhythmSoundFiles1, this.colors[2]);
        let rhythmPerformer1 = new RhythmPerformer(x, 
                                                   y,
                                                   this.performerRadius,
                                                   this.colors[2],
                                                   this.ctx,
                                                   this.engine,
                                                   rhythmSource1);   
        this.performers.push(rhythmPerformer1);
        this.conductor.registerActor(rhythmPerformer1); 
        
        let rhythmSoundFiles2 = {
            urls: {
                C3: "mallet-mellow-C3.mp3",
                D3: "mallet-mellow-D3.mp3",
                E3: "mallet-mellow-E3.mp3",
                F3: "mallet-mellow-F3.mp3",
                G3: "mallet-mellow-G3.mp3",
                A3: "mallet-mellow-A3.mp3",
                B3: "mallet-mellow-B3.mp3",
            },
            baseUrl: "/audio/mallets/mallet-mellow/",
            envelope: {
                attack: .25,
                release: 2
        }};
        let rhythmSource2 = new RhythmSource(this.conductor, 'mallet-mellow', rhythmSoundFiles2, this.colors[3]);
        let rhythmPerformer2 = new RhythmPerformer(x, 
                                                   y,
                                                   this.performerRadius,
                                                   this.colors[3],
                                                   this.ctx,
                                                   this.engine,
                                                   rhythmSource2);   
        this.performers.push(rhythmPerformer2);
        this.conductor.registerActor(rhythmPerformer2);   
          
        this.atmosphereSource = new AtmosphereSource(this.conductor);
        this.conductor.registerAtmosphere(this.atmosphereSource);     

        this.conductor.play();
        window.$music_playing = true;
    }

    async setupFromNFTs() {

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        let accounts = await provider.send("eth_requestAccounts", []);
        let account = accounts[0];
        provider.on('accountsChanged', function (accounts) {
            account = accounts[0];
        });
    
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        const nftContract = new ethers.Contract(window.$CONTRACT_ADDRESS, contractABI, signer);
        let myNFTs = [];
        while(myNFTs.length == 0) {
            try{ myNFTs = await nftContract.getMyNFTS(); }
            catch(error) {console.log("error when querying for getMyNFTS ", error)}
        }

        let myPrototypes = [];
        while(myPrototypes.length == 0) {
            try{ myPrototypes = await nftContract.getPrototypesForCollectionId(1); }
            catch(error) {console.log("error when querying for allNFTs ", error)}
        }

        // not the best state mgmt, need to figure out better way
        // assign to a local variable first to make it easier to change later
        for(let i=0; i<myNFTs.length; i++) {
            const prototype = this.getPrototypePrototypeId(myNFTs[i].prototypeId.toString(), myPrototypes);
            const nftType = prototype.part;
            const soundFiles = prototype.soundFiles;
            const color = prototype.color;
            const instrument = prototype.instrument;

            let sounds = soundFiles.toString();
            // FOR SOME STRANGE ASS REASON, this string comes through as encoded when I get it from 
            // wagmi hooks and as plain text when I query it directly via ethers. 
            // NO CLUE WHY, but I'm leaving this comment and the following line in as
            // I have a feeling things will change in the future and maybe leaving this here
            // will save me from banging my head against my desk too much ... maybe
            //sounds = ethers.utils.toUtf8String(sounds);
            let soundOBJ = JSON.parse(sounds);
            const x = Math.random() * (window.innerWidth-(2*this.performerRadius)) + (2*this.performerRadius);
            const y = Math.random() * (window.innerHeight-(2*this.performerRadius)) + (2*this.performerRadius);

            if(nftType === 'drone') {
                if(this.droneSoundSource) {
                    this.droneSoundSource.addSoundFiles(soundOBJ, color);
                }
                else {
                    this.droneSoundSource = new DroneSource(this.conductor, soundOBJ);
                    let dronePerformer = new DronePerformer(x, 
                                                            y,
                                                            this.performerRadius,
                                                            this.bgColor,
                                                            color,
                                                            this.ctx,
                                                            this.engine,
                                                            this.droneSoundSource);
                    this.performers.push(dronePerformer);
                    this.conductor.registerActor(dronePerformer);  
                }
 
            }
            else if(nftType === 'pad') {
                // if we already have the performer, just add a new source
                if(this.padSoundSource) {
                    this.padSoundSource.addSoundFiles(soundOBJ, color);
                }
                else {
                    // first time through, create everything
                    this.padSoundSource = new PadSource(this.conductor, instrument, soundOBJ, color);
                    let padPerformer = new PadPerformer(x, 
                                                        y,
                                                        this.performerRadius,
                                                        color,
                                                        this.ctx,
                                                        this.engine,
                                                        this.padSoundSource);                                    
                    this.performers.push(padPerformer);
                    this.conductor.registerActor(padPerformer);     
                }

            }
            else if(nftType === 'rhythm') {
                if(this.rhythmSource1) {
                    this.rhythmSource1.addSoundFiles(soundOBJ, color);
                }
                if(this.rhythmSource2) {
                    this.rhythmSource2.addSoundFiles(soundOBJ, color);
                }

                if(!this.rhythmSource1) {
                    this.rhythmSource1 = new RhythmSource(this.conductor, instrument, soundOBJ, color);
                    let rhythmPerformer = new RhythmPerformer(x, 
                                                               y,
                                                               this.performerRadius,
                                                               color,
                                                               this.ctx,
                                                               this.engine,
                                                               this.rhythmSource1);   
                    this.performers.push(rhythmPerformer);
                    this.conductor.registerActor(rhythmPerformer);     
                }
                else if(!this.rhythmSource2) {
                    this.rhythmSource2 = new RhythmSource(this.conductor, instrument, soundOBJ, color);
                    let rhythmPerformer = new RhythmPerformer(x, 
                                                               y,
                                                               this.performerRadius,
                                                               color,
                                                               this.ctx,
                                                               this.engine,
                                                               this.rhythmSource2);   
                    this.performers.push(rhythmPerformer);
                    this.conductor.registerActor(rhythmPerformer);     
                }

            }
        }
        this.atmosphereSource = new AtmosphereSource(this.conductor);
        this.conductor.registerAtmosphere(this.atmosphereSource);     
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