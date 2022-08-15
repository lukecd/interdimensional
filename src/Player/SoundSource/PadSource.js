import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";
import SoundSource from "./SoundSource";

class PadSource extends SoundSource {
    constructor(player, conductor, performerInstrument, soundFiles) {
        super(player, conductor);
        this.performerInstrument = performerInstrument;
        this.soundFiles = soundFiles;
        super.setType('pad');
    }

    init(scaleNotes) {
        this.sampler = new Tone.Sampler(this.soundFiles);
        this.sampler.volume.value = -15;
        const verb = new Tone.Reverb('2');
        const delay = new Tone.PingPongDelay("4n", 0.2);
    
        // Example of LFO for volume.
        this.sampler.chain(delay, verb);
        verb.toDestination();
    }

     /**
     * @notice Recursive function called over and over to create our evolving pad
     */
     evolvePad(time) {
        if(this.paused) return;

        this.currentChord = this.conductor.getNewChord();
        let duration = Math.floor(Math.random() * 4) + 1;
        duration += 'm';

        if(this.sampler.loaded) {
            this.sampler.triggerAttackRelease(this.currentChord, duration, time);
            this.transportId = Tone.Transport.schedule(this.evolvePad.bind(this), '+' + duration);    
        }

        // always check if we have a Conductor. It's possible to not have one during preview
        if(this.conductor) Tone.Draw.schedule(this.conductor.notePlayed(this), '+' + duration);
    }   

    /**
     * @notice Starts Pad playing
     */
    play() {
        this.paused = false;
        console.log("PadSource play");
        Tone.Transport.schedule(this.evolvePad.bind(this), "1");
    
    }

    pause() {
        this.paused = true;
        //Tone.Transport.cancel(this.transportId);
        //Tone.Transport.pause();
    }

    getVolume() {
        return this.sampler.volume.value;
    }

    setVolume(vol) {
        this.sampler.volume.value = vol;
    }

}

export default PadSource;

