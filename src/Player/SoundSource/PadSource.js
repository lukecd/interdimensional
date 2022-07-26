import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";
import SoundSource from "./SoundSource";

class PadSource extends SoundSource {
    constructor(player, performerInstrument) {
        super(player);
        this.performerInstrument = performerInstrument;
        super.setType('pad');
    }

    init(scaleNotes) {
        this.chords = [];

        for(let i=0; i < scaleNotes.length; i++) {
            let chord = [];
            chord[0] = this.getMidNote(i, scaleNotes);
            chord[1] = this.getMidNote(i+2, scaleNotes);
            chord[2] = this.getMidNote(i+4, scaleNotes);
            chord[3] = this.getMidNote(i+6, scaleNotes);
            this.chords.push(chord);
        }
        //todo: build big ass if to load different instruments based on performerInstrument
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
        //this.player.emit(0);

        this.pad.triggerAttackRelease(this.chords[this.currentChord], duration, time);
        this.nextChord = Math.floor(Math.random() * this.chords.length);
        Tone.Transport.schedule(this.evolvePad.bind(this), '+' + duration);
    }   

    /**
     * @notice Starts Pad playing
     */
    play() {
        Tone.Transport.schedule(this.evolvePad.bind(this), "1");
    }

    pause() {
        Tone.Transport.pause();
    }

}

export default PadSource;

