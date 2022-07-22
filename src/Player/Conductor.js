import Performer from './Performer.js';
import Matter from 'matter-js';
import Particle from './Particle.js';
import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";


class Conductor {
    // in initital release, we allow for 1 pad, 2 rhythms
    // also there's a bass drone sound not tied to an NFT
    // eventually i'll expand to allow for layering, but i want to experiment
    // with making it very basic at first.


    constructor(player, performers, particles) {
        this.player = player;
        this.performers = performers;
        this.particles = particles;

        
        this.currentChord = 0;
        this.nextChord = 0;
        
        // init audio
        this.initAudio();

        const scaleNotes = Tonal.Scale.get("C3 major").notes;

        this.drone = this.initDrone(scaleNotes);
        this.pad = this.initPad(scaleNotes);
        this.motif1 = this.initMottif1();
        this.motif2 = this.initMottif2();
        
        this.padPerformer = performers[0];

        Tone.Volume.value = -3;
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

    initDrone(scaleNotes) {
        let drone = new Tone.Synth();
        drone.oscillator.type = 'fattriangle';
        drone.toDestination();
        this.droneNote = this.getMidNote(-14,  scaleNotes);
        return drone;
    }

    /**
     * Just play the root note
     * TODO add modulation
     */
    evolveDrone() {
        this.drone.triggerAttack(this.droneNote); // only trigger attack
    }

    initPad(scaleNotes) {
        this.chords = [];

        for(let i=0; i < scaleNotes.length; i++) {
            let chord = [];
            chord[0] = this.getMidNote(i, scaleNotes);
            chord[1] = this.getMidNote(i+2, scaleNotes);
            chord[2] = this.getMidNote(i+4, scaleNotes);
            chord[3] = this.getMidNote(i+6, scaleNotes);
            this.chords.push(chord);
        }

        const sampler = new Tone.Sampler({
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
        });
        const verb = new Tone.Reverb();
        const delay = new Tone.PingPongDelay("4n", 0.2);
        //sampler => delay => verb => destination
        verb.toDestination();
        delay.connect(verb);
        sampler.connect(delay)
        sampler.volume.value = -10;
        return sampler;
    }

     /**
     * @notice Recursive function called over and over to create our evolving pad
     */
     evolvePad(time) {
        this.currentChord = this.nextChord;
        let duration = Math.floor(Math.random() * 4) + 1;
        duration += 'm';
        
        // callback to cause the player to emit a Particle from the Pad Performer
        this.player.emit(0);

        this.pad.triggerAttackRelease(this.chords[this.currentChord], duration, time);
        this.nextChord = Math.floor(Math.random() * this.chords.length);
        Tone.Transport.schedule(this.evolvePad.bind(this), '+' + duration);
    }   

    /**
     * Sampler => Delay
     */
    initMottif1() {
        const autoPanner = new Tone.AutoPanner("4n").toDestination().start();
        const delay = new Tone.FeedbackDelay('8n.', 0.5).toDestination();

        const sampler = new Tone.Sampler({
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
            }
        });
        sampler.connect(delay);
        sampler.volume.value = -20;
        return sampler;
    }
    /**
     * Sampler => Delay => AutoPanner
     */
    initMottif2() {
        const autoPanner = new Tone.AutoPanner("4n").toDestination().start();
        const delay = new Tone.FeedbackDelay('8n.', 0.5).toDestination();

        const sampler = new Tone.Sampler({
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
        });
        sampler.connect(delay);
        delay.connect(autoPanner);
        //sampler.volume.value = -10;
        return sampler;
    }

    evolveMotif(motifSampler, motifArray, rhythmArray, performerIndex, tempo = '8n', duration = '8n', offset = 0) {
        this.loop = new Tone.Loop((time) => {
            let chordNotes = this.chords[this.currentChord];
            let noteIndex = motifArray.shift();
            motifArray.push(noteIndex);
            let rhythm = rhythmArray.shift();

            rhythmArray.push(rhythm);
            if(rhythm === 1) {
                let note = this.getMidNote(noteIndex, chordNotes);
                motifSampler.triggerAttackRelease(note, duration, time);
                this.player.emit(performerIndex); // todo deal with these indexes
            }

        }, tempo).start();
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
      

    play() {
        if(this.isPlaying) return;
        this.isPlaying = true;

        let rhythm = this.bresenhamEuclidean(7, 16);

        // for some reason I need to make a random call before really starting things
        // ideally i could delete this next line
        this.pad.triggerAttackRelease(this.chords[this.currentChord], '1m');
        Tone.Transport.schedule(this.evolvePad.bind(this), "1");
        this.evolveDrone();
        this.evolveMotif(this.motif1, [1, 2, 3, 4, 3, 2], rhythm, 1); //x = play, - = rest
        this.evolveMotif(this.motif2, [4, 3, 2, 1, 0], this.shiftRhythm(rhythm, 3), 2, '8n', '16n', 7); //1 = play, 0 = rest
        Tone.Transport.start();
    }

    pause() {
        this.isPlaying = false;
        Tone.Transport.pause();
        this.drone.triggerRelease();
    }
}


export default Conductor;