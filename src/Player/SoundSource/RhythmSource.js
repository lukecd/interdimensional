import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";
import SoundSource from "./SoundSource";
import chroma from "chroma-js";

class RhythmSource extends SoundSource {
    constructor(conductor, performerInstrument, soundFiles, color) {
        super(conductor, soundFiles, color);
        this.performerInstrument = performerInstrument; // TODO: delete?
        this.soundFiles = soundFiles; // TODO: delete?
        super.setType('rhythm');
        this.setCrossfadeA();
        this.setCrossfadeB();
    }

    init(tempo = '4n', duration = '8n', offset = 0) {
        this.tempo = tempo;
        this.duration = duration;
        this.offset = offset;
    }
    
    setCrossfadeA() {
        // clear the old one
        if(this.crossFade.a) this.crossFade.a.dispose();
        this.idA = this.randomIntFromRange(0, this.soundFileSorces.length-1);

        console.log("rhythm setting crossfade a=", this.soundFileSorces[this.idA]);
        this.samplerA = new Tone.Sampler(this.soundFileSorces[this.idA]);
        console.log("this.samplerA=", this.samplerA);

        this.samplerA.volume.value = -5;

        const autoPanner = new Tone.AutoPanner("4n");
        const delay = new Tone.Delay(0.2, 0.5);
        this.samplerA.chain(autoPanner, delay);
        delay.toDestination();
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
        console.log("rhythm setting crossfade b=", this.soundFileSorces[this.idB]);
        this.samplerB = new Tone.Sampler(this.soundFileSorces[this.idB]);
        this.samplerB.volume.value = -5;

        const autoPanner = new Tone.AutoPanner("4n");
        const delay = new Tone.Delay(0.2, 0.5);
        this.samplerA.chain(autoPanner, delay);
        delay.toDestination();
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


    playRhythm(sampler, motifArray, performerIndex) {
        this.loop = new Tone.Loop((time) => {
            let chordNotes = this.conductor.getCurrentChord();
            
            let noteIndex = motifArray.shift();
            motifArray.push(noteIndex);
// console.log("RS this.conductor, ", this.conductor);
// console.log("RS this.samplerA.loaded=", this.samplerA.loaded);
// console.log("RS this.samplerB.loaded=", this.samplerB.loaded);

            if(this.conductor.shouldPlay(this)) {
                if(this.samplerA.loaded) {
                    // TODO: I'm not sure about this logic. 
                    let note = this.conductor.getMidNote(noteIndex, chordNotes);
                    this.samplerA.triggerAttackRelease(note, this.duration, time);
                }
                if(this.samplerB.loaded) {
                    // TODO: I'm not sure about this logic. 
                    let note = this.conductor.getMidNote(noteIndex, chordNotes);
                    this.samplerB.triggerAttackRelease(note, this.duration, time);
                }
                Tone.Draw.schedule(this.conductor.notePlayed(this), time);
            }
        }, this.tempo).start();
        this.loop.humanize = true;
    }

    play() {
        this.paused = false;
        this.playRhythm(this.motif1, [1, 2, 3, 4, 3, 2], 1); 
    }

    pause() {
        this.paused = true;
        this.loop.stop();
    }

    getVolume() {
        return this.sampler.volume.value;
    }

    setVolume(vol) {
        this.sampler.volume.value = vol;
    }

}

export default RhythmSource;

