import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";
import SoundSource from "./SoundSource";

class PadSource extends SoundSource {
    constructor(player, conductor, performerInstrument) {
        super(player, conductor);
        this.performerInstrument = performerInstrument;
        super.setType('pad');
    }

    init(scaleNotes) {
        //todo: build big ass if to load different instruments based on performerInstrument
        this.sampler = new Tone.Sampler({
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
        const verb = new Tone.Reverb('2');
        const delay = new Tone.PingPongDelay("4n", 0.2);
        //sampler => delay => verb => destination
        // verb.toDestination();
        // delay.connect(verb);
        // this.sampler.connect(delay)
        // this.sampler.volume.value = -10;

        var vol = new Tone.Volume();
    
        // Example of LFO for volume.
        var lfo2 = new Tone.LFO(0.01, -100, -20); // hertz, min, max
        lfo2.connect(vol.volume);
        lfo2.start();
        this.sampler.chain(delay, verb, vol);
        vol.toDestination();
    }

     /**
     * @notice Recursive function called over and over to create our evolving pad
     */
     evolvePad(time) {
        this.currentChord = this.conductor.getNewChord();
        let duration = Math.floor(Math.random() * 4) + 1;
        duration += 'm';
        console.log('time ', time)
        console.log('this.currentChord ', this.currentChord);


        this.sampler.triggerAttackRelease(this.currentChord, duration, time);
        //this.conductor.notePlayed(this);
        Tone.Transport.schedule(this.evolvePad.bind(this), '+' + duration);
        Tone.Draw.schedule(this.conductor.notePlayed(this), '+' + duration);
        const self = this;
        Tone.Draw.schedule(function(){
            self.conductor.notePlayed(self);
        }, '+' + duration)
    }   

    /**
     * @notice Starts Pad playing
     */
    play() {
        console.log("PadSource play")
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
        Tone.Transport.pause();
    }

}

export default PadSource;

