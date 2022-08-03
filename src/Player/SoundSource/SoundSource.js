import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";

/**
 * Abstract base class for all producers of sounds
 */
class SoundSource {

    constructor(player, conductor) {
        this.player = player;

        // we pass a refernce to the conductor so a SoundSource can tell the conductor a
        // sound was just played. Analogous to a real-world conductor hearing something
        // this allows the conductor to deploy visuals and to keep with our pattern
        // of one algorithm generating both visuals and audio.
        this.conductor = conductor;
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

    /**
     * @notice Relationship between Performer and SoundSource should be two way. 
     *         Both need references to each other.
     * @param {*} performer The Performer assocaited with the source
     */
    setPerformer(performer) {
        this.performer = performer;
    }

    getPerformer() {
        return this.performer;
    }

    getVolume() {

    }

    setVolume(vol) {
        
    }

}
export default SoundSource;
