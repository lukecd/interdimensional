import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";
import SoundSource from "./SoundSource";

class RhythmSource extends SoundSource {
    constructor(player, performerInstrument, performerData) {
        super(player);
        this.performerInstrument = performerInstrument;
        this.performerData = performerData;
        super.setType('rhythm');
    }

    init(scaleNotes, rhythm, tempo = '8n', duration = '8n', offset = 0) {
        this.rhythm = rhythm; 
        this.tempo = tempo;
        this.duration = duration;
        this.offset = offset;

        const autoPanner = new Tone.AutoPanner("4n").toDestination().start();
        const delay = new Tone.FeedbackDelay('8n.', 0.5).toDestination();


        let sampler; 
        if(this.performerInstrument === 'mallet-marimba') {
            sampler = new Tone.Sampler({
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
            sampler = new Tone.Sampler({
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
        sampler.connect(delay);
        delay.connect(autoPanner);
        //sampler.volume.value = -10;
    }

    play() {
        this.evolveMotif(this.motif1, [1, 2, 3, 4, 3, 2], this.rhythm, 1); //x = play, - = rest
        //this.evolveMotif(this.motif2, [4, 3, 2, 1, 0], this.shiftRhythm(rhythm, 3), 2, '8n', '16n', 7); //1 = play, 0 = rest
    }

    pause() {

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


    evolveMotif(motifSampler, motifArray, rhythmArray, performerIndex) {
        this.loop = new Tone.Loop((time) => {
            let chordNotes = this.chords[this.currentChord];
            let noteIndex = motifArray.shift();
            motifArray.push(noteIndex);
            let rhythm = rhythmArray.shift();

            rhythmArray.push(rhythm);
            if(rhythm === 1) {
                let note = this.getMidNote(noteIndex, chordNotes);
                motifSampler.triggerAttackRelease(note, this.duration, time);
                this.player.emit(performerIndex); // todo deal with these indexes
            }

        }, this.tempo).start();
    }

}

export default RhythmSource;

