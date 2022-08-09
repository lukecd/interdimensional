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
        console.log("PadSource evolvePad 1");

        if(this.paused) return;
        console.log("PadSource evolvePad 2");
        this.currentChord = this.conductor.getNewChord();
        let duration = Math.floor(Math.random() * 4) + 1;
        duration += 'm';
        // console.log('time ', time)
        // console.log('this.currentChord ', this.currentChord);
        console.log('evolve pad this.sampler.volume.value=', this.sampler.volume.value)

        this.sampler.triggerAttackRelease(this.currentChord, duration, time);
        //this.conductor.notePlayed(this);
        this.transportId = Tone.Transport.schedule(this.evolvePad.bind(this), '+' + duration);
        console.log("this.transportId=", this.transportId);

        // always check if we have a Conductor. It's possible to not have one during preview
        if(this.conductor) Tone.Draw.schedule(this.conductor.notePlayed(this), '+' + duration);
        // const self = this;
        // Tone.Draw.schedule(function(){
        //     self.conductor.notePlayed(self);
        // }, '+' + duration)
    }   

    /**
     * @notice Starts Pad playing
     */
    play() {
        this.paused = false;
        console.log("PadSource play");
        Tone.Transport.schedule(this.evolvePad.bind(this), "1");
        // Tone.Draw.schedule(function(){
        //     this.conductor.notePlayed(this);
        // }, '1')
                // const self = this;
        // console.log("PadSource pla2y")

        // Tone.Transport.schedule(function(time){
        //     console.log("in schedule ", self)
        //     self.currentChord = self.nextChord;
        //     let duration = Math.floor(Math.random() * 4) + 1;
        //     duration += 'm';
        //     self.sampler.triggerAttackRelease(self.chords[self.currentChord], duration, time);
        //     self.conductor.notePlayed(self);
        //     self.nextChord = Math.floor(Math.random() * self.chords.length);
        //     //use the time argument to schedule a callback with Tone.Draw
        //     // Tone.Draw.schedule(function(){
        //     //     self.conductor.notePlayed(self);
        //     // }, time);
        //     Tone.Transport.schedule(self.play, '+' + duration);
        // }, "+0.5")

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

