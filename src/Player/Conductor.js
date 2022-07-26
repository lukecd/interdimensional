import Performer from './Performer/Performer.js';
import Matter from 'matter-js';
import Particle from './Particle.js';
import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";

/**
 * Class to handle modulation and movement between NFTs
 */
class Conductor {
    
    constructor(player, performers, particles) {
        this.player = player;
        this.performers = [];


        
        this.currentChord = 0;
        this.nextChord = 0;
        
        // init audio
        this.initAudio();

        this.scaleNotes = Tonal.Scale.get("C3 major").notes;

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
    registerActor(newPerformer, newSource) {
        const rhythm = this.bresenhamEuclidean(7, 16); // todo deal with this

        if(newSource.getType() === 'drone') {
            this.drone = newSource;
            this.drone.init(this.scaleNotes)
        }
        else if(newSource.getType() === 'pad') {
            this.pad = newSource;
            this.pad.init(this.scaleNotes)
        }
        else if(newSource.getType() === 'rhythm') {
            if(this.rhythm1 == null) {
                this.rhythm1 = newSource;
                this.rhythm1.init(this.scaleNotes, rhythm)
            }
            else if(this.rhythm2 == null) {
                this.rhythm2 = newSource;
                this.rhythm2.init(this.scaleNotes, rhythm)
            }
        }
        this.performers.push(newPerformer);
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


        // for some reason I need to make a random call before really starting things
        // ideally i could delete this next line
        //this.pad.triggerAttackRelease(this.chords[this.currentChord], '1m');

       
        Tone.Transport.start();
    }

    pause() {
        this.isPlaying = false;
        Tone.Transport.pause();
        this.drone.triggerRelease();
    }
}


export default Conductor;


