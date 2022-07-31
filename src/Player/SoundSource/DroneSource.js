import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";
import SoundSource from "./SoundSource";

class DroneSource extends SoundSource {

    constructor(player, conductor) {
        super(player, conductor);
        super.setType('drone');
    }

    init(droneNote) {
        this.drone = new Tone.Synth();
        this.drone.oscillator.type = 'fattriangle';

        var filter = new Tone.Filter(1200, "lowpass");
        var vol = new Tone.Volume();
        
        // Example of LFO for lowpass filter.
        var lfo = new Tone.LFO(4, 200, 1200); // hertz, min, max
        lfo.connect(filter.frequency);
        lfo.start();
        
        // Example of LFO for volume.
        var lfo2 = new Tone.LFO(0.1, -100, -10); // hertz, min, max
        lfo2.connect(vol.volume);
        lfo2.start();
        
        this.drone.chain(filter, vol);
        vol.toDestination();
        
        this.droneNote = droneNote; 
    }

    play() {
        this.drone.triggerAttack(this.droneNote); // only trigger attack
    }

    pause() {
        this.drone.triggerRelease(0.5);
    }
}

export default DroneSource;

