import Performer from './Performer.js';
import Matter from 'matter-js';
import Particle from './Particle.js';
import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";

class Conductor {
    // in initital release, we allow for 1 pad, 2 medlodies and 1 bass
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

        this.pad = this.initPad(Tonal.Scale.get("C3 major").notes)
        this.motif1 = this.initMottif1();

        this.padPerformer = performers[0];

        Tone.Volume.value = -3;
    }

    /**
     * @notice Helper function to build chords
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
        // var gainNode = Tone.context.createGain();
        // const env = new Tone.Envelope({
        //     attack: 0.5,
        //     decay: 1,
        //     sustain: 1,
        //     release: 1,
        // }).connect(gainNode.gain);
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
                C3: "pad-ethereal-C3.mp3",
                D3: "pad-ethereal-D3.mp3",
                E3: "pad-ethereal-E3.mp3",
                F3: "pad-ethereal-F3.mp3",
                G3: "pad-ethereal-G3.mp3",
                A3: "pad-ethereal-A3.mp3",
                B3: "pad-ethereal-B3.mp3",
            },
            baseUrl: "/audio/pads/pad-ethereal/",
            envelope: {
                attack: 1,
                release: 4
            }
        });
        const verb = new Tone.Reverb();
        const delay = new Tone.PingPongDelay("4n", 0.2);
        //sampler => delay => verb s=> destination
        verb.toDestination();
        delay.connect(verb);
        sampler.connect(delay)
   
        return sampler;
    }

     /**
     * @notice Recursive function called over and over to create our evolving pad
     */
     evolvePad(time) {
        this.currentChord = this.nextChord;
        let duration = Math.floor(Math.random() * 4) + 1;
        duration += 'm';
        console.log("change chord called ", duration);
        
        // callback to cause the player to emit a Particle from the Pad Performer
        console.log(this.player);
        this.player.emit(0);

        this.pad.triggerAttackRelease(this.chords[this.currentChord], '1m', time);
        this.nextChord = Math.floor(Math.random() * this.chords.length);
        Tone.Transport.schedule(this.evolvePad.bind(this), '+' + duration);
    }   

    initMottif1() {
        const synth = new Tone.MonoSynth();
        synth.toDestination();
        synth.volume.value = -20;
        return synth;
    }

    evolveMotif1(motifArray, rhythmArray) {
        const tempo = '8n';
        const duration = '8n';
        const offset = 0;

        this.loop = new Tone.Loop((time) => {
            let chordNotes = this.chords[this.currentChord];
            let noteIndex = motifArray.shift();
            motifArray.push(noteIndex);
            let rhythm = rhythmArray.shift();
            rhythmArray.push(rhythm);
            if(rhythm == 'x') {
                let note = this.getMidNote(noteIndex, chordNotes);
                this.motif1.triggerAttackRelease(note, duration, time);
                this.player.emit(1); // todo deal with these indexes
            }

        }, tempo).start();
    }

    play() {
        if(this.isPlaying) return;

        this.isPlaying = true;
        this.pad.triggerAttackRelease(this.chords[this.currentChord], '1m');
        Tone.Transport.bpm.rampTo(70, 1);
        Tone.Transport.schedule(this.evolvePad.bind(this), "1");
        this.evolveMotif1([1, 2, 3, 4, 3, 2], ['x', 'x', '-', 'x', '-', '-']); //x = play, - = rest
        Tone.Transport.start();
    }

    pause() {
        this.isPlaying = false;
        Tone.Transport.pause();
    }
}


export default Conductor;