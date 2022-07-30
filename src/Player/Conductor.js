import Performer from './Performer/Performer.js';
import Matter from 'matter-js';
import Particle from './Renderer/Particle.js';
import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";

/**
 * Handles everything music theory
 */
class Conductor {
    
    constructor(renderer, performers, particles, engine) {
        this.renderer = renderer;
        this.performers = [];
        this.particles = particles;
        this.engine = engine;
        this.particleRadius = 20;

        // init audio
        this.initAudio();

        this.currentChord = 0;
        this.nextChord = 0;
        this.scaleNotes = Tonal.Scale.get("C2 major").notes;
        this.chords = this.getChordsForNote(this.scaleNotes);
        this.currentChordId = 0;

        // References to our Performer Objects
        this.drone = null;
        this.pad = null;
        this.rhythm1 = null;
        this.rhythm2 = null;

        Tone.Volume.value = -3;
    }

    /**
     * A performance is made up of at most 1 drone, 1 pad, 2 rhythms
     * Right now we can only handle just that.
     * I plan to expand this so that if multiple pads exist, the conductor cross fades between them
     */
    registerActor(newPerformer) {
        //const rhythm = this.bresenhamEuclidean(7, 16); // todo deal with this
        const rhythm = this.bresenhamEuclidean(7,22); // todo deal with this

        if(newPerformer.getType() === 'drone') {
            this.drone = newPerformer;
            this.drone.init(this.getMidNote(-14,  this.scaleNotes));
        }
        else if(newPerformer.getType() === 'pad') {
            this.pad = newPerformer;
            this.pad.init(this.scaleNotes);
        }
        else if(newPerformer.getType() === 'rhythm') {
            if(this.rhythm1 == null) {
                this.rhythm1 = newPerformer;
                this.rhythm1.init(this.scaleNotes, rhythm);
            }
            else if(this.rhythm2 == null) {
                this.rhythm2 = newPerformer;
                this.rhythm2.init(this.scaleNotes, this.shiftRhythm(rhythm, 3));
            }
        }
        this.performers.push(newPerformer);
    }

    getChordsForNote(scaleNotes) {
        let chords = [];

        for(let i=0; i < scaleNotes.length; i++) {
            let chord = [];
            chord[0] = this.getMidNote(i, scaleNotes);
            chord[1] = this.getMidNote(i+2, scaleNotes);
            chord[2] = this.getMidNote(i+4, scaleNotes);
            chord[3] = this.getMidNote(i+6, scaleNotes);
            chords.push(chord);
        }
        return chords;
    }

    /**
     * @notice Helper function to build chords / get notes from a chord
     */
    getMidNote(noteNumber, notes) {
        let zeroOctave = Tonal.Note.octave(notes[0]);
        let numNotes = notes.length;
        let i = this.modulo(noteNumber, numNotes);
        let octave = zeroOctave + Math.floor(noteNumber / numNotes);
        return Tonal.Note.pitchClass(notes[i]) + octave;
    } 

    /**
    * @notice Helper method to generate euclidean rhythms using the Bresenham Line method
    * Based on code in https://medium.com/code-music-noise/euclidean-rhythms-391d879494df
    * Returns an array representing a binary sequence. Play on a 1, rest on a 0.
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
     * @notice Helper function to build chords
     */
    modulo(n, m) {
        return ((n %  m) + m) % m;
    }

    initAudio() {
        Tone.Transport.bpm.value = 70;
    }

    play() {
        if(this.isPlaying) return;
        this.isPlaying = true;

        console.log("play called ", this.drone)
        if(this.drone) this.drone.play();
        if(this.pad) this.pad.play();
        if(this.rhythm1) this.rhythm1.play();
        if(this.rhythm2) this.rhythm2.play();
       
        Tone.Transport.start();
    }

    pause() {
        this.isPlaying = false;
        Tone.Transport.pause();
        if(this.drone) this.drone.pause();
        if(this.pad) this.pad.pause();
        if(this.rhythm1) this.rhythm1.pause();
        if(this.rhythm2) this.rhythm2.pause();
    }

    /**
     * @notice Callback method used to a Performer can notify the Conductor a note was just played
     * and the Conductor can go ahead and create some visuals (if desired). This allows us to maintain
     * the pattern of 1 algorithm producing both audio and visuals.
     * @param {*} performer The performer who just played
     */
    notePlayed(soundSource) {
        if(soundSource.getType() === 'drone') {

            
        }
        else if(soundSource.getType() === 'pad') {
            this.particles.push(new Particle(soundSource.getPerformer().x, soundSource.getPerformer().y, 
                                            this.particleRadius, soundSource.performer.color, this.engine));
        }
        else if(soundSource.getType() === 'rhythm') {
            this.particles.push(new Particle(soundSource.getPerformer().x, soundSource.getPerformer().y, 
                                            this.particleRadius, soundSource.performer.color, this.engine));        
        }
    }

    /**
     * @notice Returns the current chord being played by the pad.
     *         Also used by the pad to determine the next chord to play.
     */
    getCurrentChord() {
        return this.chords[this.currentChordId];
    }

    getNewChord() {
        this.currentChordId = Math.floor(Math.random() * this.chords.length);
        return this.chords[this.currentChordId];
    }
}


export default Conductor;


