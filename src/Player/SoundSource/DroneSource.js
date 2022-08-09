import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";
import SoundSource from "./SoundSource";

class DroneSource extends SoundSource {

    constructor(player, conductor, soundFiles) {
        super(player, conductor);
        super.setType('drone');
    }

    init(droneNote) {
        this.drone = new Tone.Synth();
        this.drone.oscillator.type = 'fattriangle';

        var filter = new Tone.Filter(1200, "lowpass");
        
        // Example of LFO for lowpass filter.
        var lfo = new Tone.LFO(4, 200, 1200); // hertz, min, max
        lfo.connect(filter.frequency);
        lfo.start();
        
        this.drone.chain(filter);
        filter.toDestination();
        
        this.droneNote = droneNote; 
    }

    play() {
        this.drone.triggerAttack(this.droneNote); // only trigger attack
    }

    pause() {
        this.drone.triggerRelease(0.5);
    }

    getVolume() {
        return this.drone.volume.value;
    }

    setVolume(vol) {
        this.drone.volume.value = vol;
    }
}

export default DroneSource;

