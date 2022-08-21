import * as Tone from "tone";
import * as Tonal from "@tonaljs/tonal";

import DroneSource from "./SoundSource/DroneSource";
import PadSource from "./SoundSource/PadSource";
import RhythmSource from "./SoundSource/RhythmSource";
import SoundControl from "./SoundControl";

/**
 * @notice PreviewEngine is used to preview an NFT's sound. 
 * Simply instantiate it with a performerType (drone, pad, rhythm)
 * and a performerInstrument, then click play or pause. 
 * When done previewing, the object can be disposed of.
 */
class PreviewEngine extends SoundControl {

    constructor(performerType, performerInstrument, soundFiles, color) {
        super();
        this.soundSource = null;
        this.previewRhythm = this.bresenhamEuclidean(6, 8);
  
        if(performerType === 'drone') {
            this.soundSource = new DroneSource(null, this, soundFiles);
            this.soundSource.init(this.getMidNote(-14,  this.scaleNotes));
        }
        else if(performerType === 'pad') {
            this.soundSource = new PadSource(this, performerInstrument, soundFiles, color); 
            this.soundSource.init();
        }
        else if(performerType === 'rhythm') {
            this.soundSource = new RhythmSource(this, performerInstrument, soundFiles, color);
            this.soundSource.init();
        }
    }

    play() {
        Tone.Transport.start();
        this.soundSource.play();
    }

    pause() {
        this.soundSource.pause();
        Tone.Transport.cancel();
        Tone.Transport.stop();
    }

    notePlayed(soundSource) {
    }

    /**
     * @notice As the Conductor is responsible for maintaining mellifluous musicality across all Performers
     * this function is used by RhythmSource object to determine if they should play on a given measure.
     * This allows the Conductor to evolve and change the rhythm necklaces over time.
     * @param {*} rhythmSource The RhythmSource object asking if it should play
     */
    shouldPlay(rhythmSource) {
        let rhythm = this.previewRhythm.shift();
        this.previewRhythm.push(rhythm);

        return rhythm === 1;
    }    

   
}

export default PreviewEngine;