import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";

/**
 * Abstract base class for all producers of sounds
 */
class SoundSource {

    constructor(player, conductor) {
        // TODO, DO I STILL NEED THE PLAYER???
        this.player = player;

        // we pass a refernce to the conductor so a SoundSource can tell the conductor a
        // sound was just played. Analogous to a real-world conductor hearing something
        // this allows the conductor to deploy visuals and to keep with our pattern
        // of one algorithm generating both visuals and audio.
        this.conductor = conductor;

        this.paused = true;
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

    randomIntFromRange(min, max) {
        return Math.floor(Math.random() * (max-min +1) + min);
    }

    /**
     * 
     * @notice Helper function to map one scale to another
     * Currently used to make circles smaller as they move away from the center
     */
    scale (number, inMin, inMax, outMin, outMax) {
        return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }



}
export default SoundSource;
