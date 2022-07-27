import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";
import SoundSource from "./SoundSource";

class DroneSource extends SoundSource {

    constructor(player) {
        super(player);
        super.setType('drone');
    }

    init(droneNote) {
        this.drone = new Tone.Synth();
        this.drone.oscillator.type = 'fattriangle';
        this.drone.toDestination();
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

