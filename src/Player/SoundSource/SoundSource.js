import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";

/**
 * Abstract base class for all producers of sounds
 */
class SoundSource {

    constructor(player) {
        this.player = player;
    }

    init(scaleNotes) {

    }

    play() {

    }

    pause() {

    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

}
export default SoundSource;
