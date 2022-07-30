import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";
import SoundSource from "./SoundSource";

class RhythmSource extends SoundSource {
    constructor(player, conductor, performerInstrument) {
        super(player, conductor);
        this.performerInstrument = performerInstrument;
        super.setType('rhythm');
    }

    init(scaleNotes, rhythm, tempo = '8n', duration = '8n', offset = 0) {
        this.rhythm = rhythm; 
        this.tempo = tempo;
        this.duration = duration;
        this.offset = offset;

        const autoPanner = new Tone.AutoPanner("4n").toDestination().start();
        const delay = new Tone.FeedbackDelay('8n.', 0.5).toDestination();

        if(this.performerInstrument === 'mallet-marimba') {
            this.sampler = new Tone.Sampler({
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
 
        }
        else if(this.performerInstrument === 'mallet-mellow') {
            this.sampler = new Tone.Sampler({
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
        }
        // this.sampler.connect(delay);
        // delay.connect(autoPanner);
        //sampler.volume.value = -10;

        var filter = new Tone.Filter(1200, "lowpass");
        var vol = new Tone.Volume();

        // Example of LFO for lowpass filter.
        var lfo = new Tone.LFO(4, 200, 1200); // hertz, min, max
        lfo.connect(filter.frequency);
        lfo.start();

        // Example of LFO for volume.
        var lfo2 = new Tone.LFO(Math.random() * 0.01, -100, -9); // hertz, min, max
        lfo2.connect(vol.volume);
        lfo2.start();
        this.sampler.chain(delay, autoPanner, filter, vol);
        vol.toDestination();
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


    evolveRhythm(sampler, motifArray, rhythmArray, performerIndex) {
        this.loop = new Tone.Loop((time) => {
            //let chordNotes = this.chords[this.currentChord];
            let chordNotes = this.conductor.getCurrentChord();
            
            let noteIndex = motifArray.shift();
            motifArray.push(noteIndex);

            let rhythm = rhythmArray.shift();
            rhythmArray.push(rhythm);

            if(rhythm === 1) {
                // TODO: I'm not sure about this logic. 
                let note = this.conductor.getMidNote(noteIndex, chordNotes);
                //console.log('sampler vol: ',sampler.volume.value);
                this.sampler.triggerAttackRelease(note, this.duration, time);
                Tone.Draw.schedule(this.conductor.notePlayed(this), this.duration)
            }

        }, this.tempo).start();
    }

    play() {
        this.evolveRhythm(this.motif1, [1, 2, 3, 4, 3, 2], this.rhythm, 1); //x = play, - = rest
        //this.evolveMotif(this.motif2, [4, 3, 2, 1, 0], this.shiftRhythm(rhythm, 3), 2, '8n', '16n', 7); //1 = play, 0 = rest
    }

    pause() {

    }

}

export default RhythmSource;

