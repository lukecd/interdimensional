import * as Tone from "tone"
import * as Tonal from "@tonaljs/tonal";
import chroma from "chroma-js";

/**
 * Abstract base class for all producers of sounds
 */
class SoundSource {

    constructor(conductor, soundFiles, color) {
        // we pass a refernce to the conductor so a SoundSource can tell the conductor a
        // sound was just played. Analogous to a real-world conductor hearing something
        // this allows the conductor to deploy visuals and to keep with our pattern
        // of one algorithm generating both visuals and audio.
        this.conductor = conductor;

        this.paused = true;

        // current cross fade level
        this.crossFadeLevel = 0; // todo, should i stagger levels to make things more dynamic?
        // are we increasing (moving from a=>b)
        this.crossFadeIncreasing = true;
        // how many measures to complete a full crossfade
        this.crossFadeMeasures = 16; // todo, make this variable
        // how much to adjust crossFadeLevel to finish crossfading in crossFadeMeasures
        this.crossFadePerMeasure = 1 / this.crossFadeMeasures;
        // an oscillator of INTs that goes from 1 to crossFadeMeasures
        this.measureOscillator = 1;
        // start adjusting
        this.adjustCrossFade();

        this.soundFileSorces = [soundFiles];
        this.colors = [color];
        this.crossfadeAIndex = 0;
        this.crossfadeBIndex = 0;

        this.crossFade = new Tone.CrossFade().toDestination();
        this.crossFade.fade.value = 0.0;        
    }

    // color changes as we cross-fade
    getColor() {

    }

    addSoundFiles(soundFiles, color) {
        // note these arrays are maintained in parallel. so soundFileSources[n] is associated with colors[n]
        this.soundFileSorces.push(soundFiles);
        this.colors.push(color);
    }


    /**
     * @notice Adjust the crossfade value every measure. This is managed in the parent class
     * so it's always accessible to children. 
     */
    adjustCrossFade() {
        const self = this;
        Tone.Transport.scheduleRepeat(function(time){
            //console.log('adjusting crossfade this.soundFileSorces=',self.soundFileSorces);
            // crossfade is basically an oscillator that moves from 0 to 1 and back every n measures
            if(self.crossFadeIncreasing) {
                self.measureOscillator++;
                // have we fully increased? 
                if(self.crossFadeLevel >= 1) {
                    self.crossFadeIncreasing = false;
                    self.crossFadeLevel -= self.crossFadePerMeasure;
                    self.measureOscillator--;
                    // we are fully at b, so change the source at a
                    self.setCrossfadeA();
                    self.updateColorArray();
                }
                else {
                    self.crossFadeLevel += self.crossFadePerMeasure;
                }
            }
            else {
                self.measureOscillator--;
                // have we fully decreased? 
                if(self.crossFadeLevel <= 0) {
                    self.crossFadeIncreasing = true;
                    self.measureOscillator++;
                    self.crossFadeLevel += self.crossFadePerMeasure;
                    // we are fully at a, so change the source at b
                    self.setCrossfadeB();
                    self.updateColorArray();
                }
                else {
                    self.crossFadeLevel -= self.crossFadePerMeasure;
                }             
            }
            if(self.getType() == 'pad') {
                console.log("self.measureOscillator=", self.measureOscillator)
                console.log(self.getType(), "self.crossFadeLevel=", self.crossFadeLevel);
            }
            self.crossFade.fade.value = self.crossFadeLevel;

        }, "1m");
    }


    ///////// methods that the child class needs to override //////////
    updateColorArray() {

    }

    setCrossfadeA() {

    }

    setCrossfadeB() {

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

    // utility functions, probably will move to util library at some point
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
