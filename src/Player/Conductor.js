import Performer from './Performer.js';
import Matter from 'matter-js';
import Particle from './Particle.js';
import * as Tone from "tone"
import { Note, Scale } from "@tonaljs/tonal";

// eventuall this will incorporate stuff from tone.js

class Conductor {
    // in initital release, we allow for 1 pad, 2 medlodies and 1 bass
    // eventually i'll expand to allow for layering, but i want to experiment
    // with making it very basic at first.


    constructor(performers, particles) {
        this.performers = performers;
        this.particles = particles;
        this.pad = this.initPad();
       
        this.setupPadChords(Scale.get("C3 major").notes);

        this.pad = this.initPad();
        this.padPerformer = performers[0];

        console.log("pad ", this.pad)
    }

    setupPadChords(scaleNotes) {

    }

    /**
     * @notice Helper function to build chords
     */
    getMidNote(noteNumber, notes) {
        let zeroOctave = Note.octave(notes[0]);
        let numNotes = notes.length;
        let i = this.modulo(noteNumber, numNotes);
        let octave = zeroOctave + Math.floor(noteNumber / numNotes);
        return Note.pitchClass(notes[i]) + octave;
    }

    /**
     * @notice Helper function to build chords
     */
    modulo(n, m) {
        return ((n %  m) + m) % m;
    }

    initPad() {
        const sampler = new Tone.Sampler({
            urls: {
                C3: "pad-ethereal-C3.mp3",
                D3: "pad-ethereal-D3.mp3",
                E3: "pad-ethereal-E3.mp3",
                F3: "pad-ethereal-F3.mp3",
                G3: "pad-ethereal-G3.mp3",
                A3: "pad-ethereal-A3.mp3",
                B3: "pad-ethereal-B3.mp3",
            },
            baseUrl: "/audio/pads/pad-ethereal/"
        });
        return sampler.toDestination();
    }



    play() {
        this.pad.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
    }

    pause() {

    }
}

export default Conductor;