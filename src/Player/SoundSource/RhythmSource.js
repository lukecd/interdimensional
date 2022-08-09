import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";
import SoundSource from "./SoundSource";

class RhythmSource extends SoundSource {
    constructor(player, conductor, performerInstrument, soundFiles) {
        super(player, conductor);
        this.performerInstrument = performerInstrument;
        this.soundFiles = soundFiles;
        super.setType('rhythm');
    }

    init(scaleNotes, tempo = '4n', duration = '8n', offset = 0) {
        this.tempo = tempo;
        this.duration = duration;
        this.offset = offset;

        const autoPanner = new Tone.AutoPanner("4n").toDestination().start();
        const delay = new Tone.FeedbackDelay('8n.', 0.5).toDestination();

        this.sampler = new Tone.Sampler(this.soundFiles);

        // this.sampler.connect(delay);
        // delay.connect(autoPanner);
        this.sampler.volume.value = -5;

        var filter = new Tone.Filter(1200, "highpass");
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
    

    playRhythm(sampler, motifArray, performerIndex) {
        this.loop = new Tone.Loop((time) => {
            let chordNotes = this.conductor.getCurrentChord();
            
            let noteIndex = motifArray.shift();
            motifArray.push(noteIndex);

            if(this.conductor.shouldPlay(this)) {
                // TODO: I'm not sure about this logic. 
                let note = this.conductor.getMidNote(noteIndex, chordNotes);
                //console.log('sampler vol: ',sampler.volume.value);
                this.sampler.triggerAttackRelease(note, this.duration, time);
                //this.conductor.notePlayed(this);
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

