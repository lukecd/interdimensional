import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";

class SoundControl {
    // nothing for now
    constructor() {
        this.currentChord = 0;
        this.nextChord = 0;
        this.scaleNotes = Tonal.Scale.get("C3 major").notes;
        this.chords = this.getChordsForNote(this.scaleNotes);
        this.currentChordId = 0;
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

    randomIntFromRange(min, max) {
        return Math.floor(Math.random() * (max-min +1) + min);
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
    * @notice Helper function to build chords
    */
    modulo(n, m) {
        return ((n %  m) + m) % m;
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
     * @notice Returns the current chord being played by the pad.   
     */
     getCurrentChord() {
        return this.chords[this.currentChordId];
    }

    /**
     * @notice Updates the current chord and returns that.   
     */
    getNewChord() {
        this.currentChordId = Math.floor(Math.random() * this.chords.length);
        return this.chords[this.currentChordId];
    }    
}

export default SoundControl;