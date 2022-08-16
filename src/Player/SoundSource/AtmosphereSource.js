import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";
import SoundSource from "./SoundSource";

/**
 * @notice A special SoundSource without a visual component. 
 * On start the sound plays and stops when it's done.
 */
class AtmosphereSource extends SoundSource {

    constructor(conductor, particleCount = -1) {
        super();
        super.setType('atmosphere');
        this.loaded = false;

        this.grainURLs = [
            "EX_ATSM_160_Singing_Bowl_Loop_Drifting_Dbm.mp3",
            "EX_ATSM_Koshi_Chimes_Aria_Tuning_Texture_Whisperings_Dm.mp3",
            "OS_LFC_SFX_Birds.mp3"
        ];
        this.baseUrl = "/audio/textures/";

        let curGrain;
        if(particleCount == -1) {
            curGrain = this.randomIntFromRange(0, this.grainURLs.length);
        }
        else {
            curGrain = particleCount % this.grainURLs.length;
        }
        this.player = new Tone.Player({
            url: this.baseUrl+this.grainURLs[curGrain],
            fadeIn: 0.5,
            fadeOut: 1,
            volume: -20,
            onload: () => {
                this.loaded = true;
            }
        });
        const verb = new Tone.Reverb('4');
        const delay = new Tone.Delay(1).toDestination();
        this.player.chain(verb, delay, Tone.Destination);
        this.player.loop = false;
        this.player.autostart = true;
    }

    getGrainCount() {
        return this.grainURLs.length;
    }

    pause() {
        if(this.player) this.player.stop("0.42");
    }

    getVolume() {
        return this.player.volume.value;
    }

    setVolume(vol) {
        this.player.volume.value = vol;
    }
}

export default AtmosphereSource;

