import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";
import SoundSource from "./SoundSource";
import chroma from "chroma-js";

class PadSource extends SoundSource {
    constructor(conductor, performerInstrument, soundFiles, color) {
        super(conductor, soundFiles, color);
        this.performerInstrument = performerInstrument;
        this.soundFiles = soundFiles;
        this.setType('pad');

        this.setCrossfadeA();
        this.setCrossfadeB();
    }

    setCrossfadeA() {
        // clear the old one
        if(this.crossFade.a) this.crossFade.a.dispose();
        this.idA = this.randomIntFromRange(0, this.soundFileSorces.length-1);

        console.log("setting crossfade a=", this.soundFileSorces[this.idA]);
        this.samplerA = new Tone.Sampler(this.soundFileSorces[this.idA]);
        this.samplerA.volume.value = -15;
        const verb = new Tone.Reverb('2');
        const delay = new Tone.Delay(1);
        this.samplerA.chain(delay, verb);
        verb.toDestination();
        //this.samplerA.chain(delay, verb, this.crossFade.a);
        this.samplerA.connect(this.crossFade.a);

        // colors and stuff
        this.idA = 0;
        this.idB = 0;
        this.updateColorArray();

    }

    setCrossfadeB() {
        // clear the old one
        if(this.crossFade.b) this.crossFade.b.dispose();
        this.idB = this.randomIntFromRange(0, this.soundFileSorces.length-1);
        console.log("setting crossfade b=", this.soundFileSorces[this.idB]);
        this.samplerB = new Tone.Sampler(this.soundFileSorces[this.idB]);

        this.samplerB.volume.value = -15;
        const verb = new Tone.Reverb('2');
        const delay = new Tone.Delay(1);
        this.samplerB.chain(delay, verb);
        verb.toDestination();
        //this.samplerB.chain(delay, verb, this.crossFade.b);
        this.samplerB.connect(this.crossFade.b);
    }

    updateColorArray() {
        const colorA = this.colors[this.idA];
        const colorB = this.colors[this.idB];
        this.colorScale = chroma.scale([colorA, colorB]).mode('lch').colors(this.crossFadeMeasures);
        console.log("this.colorScale=", this.colorScale);
        
    }

    getColor() {
        // I think this error checking is needed due to how stuff is (sort of) threaded
        if(this.measureOscillator >= this.colorScale.length) {
            return this.colorScale[this.colorScale.length-1];
        }
        if(this.measureOscillator == 0) return this.colorScale[0];

        return this.colorScale[this.measureOscillator-1];
    }

    init(scaleNotes) {
        
    }

     /**
     * @notice Recursive function called over and over to create our evolving pad
     */
     evolvePad(time) {
        if(this.paused) return;
        console.log("EvolvePad this.crossFade=", this.crossFade);

        
        this.currentChord = this.conductor.getNewChord();
        let duration = Math.floor(Math.random() * 4) + 1;
        duration += 'm';
        try {
            console.log("this.currentChord =", this.currentChord )
            if(this.samplerA.loaded) {
                this.samplerA.triggerAttackRelease(this.currentChord, duration, time);
            }
            if(this.samplerB.loaded) {
                this.samplerB.triggerAttackRelease(this.currentChord, duration, time);
            }
        }
        catch(e) {console.log("error on trigger adsr ", e)}

        Tone.Transport.schedule(this.evolvePad.bind(this), '+' + duration);    

        // always check if we have a Conductor. It's possible to not have one during preview
        if(this.conductor) Tone.Draw.schedule(this.conductor.notePlayed(this), '+' + duration);
    }   

    /**
     * @notice Starts Pad playing
     */
    play() {
        this.paused = false;
        console.log("PadSource play");
        Tone.Transport.schedule(this.evolvePad.bind(this), "1");
    
    }

    pause() {
        this.paused = true;
        //Tone.Transport.cancel(this.transportId);
        //Tone.Transport.pause();
    }

    getVolume() {
        return this.sampler.volume.value;
    }

    setVolume(vol) {
        this.sampler.volume.value = vol;
    }

}

export default PadSource;

