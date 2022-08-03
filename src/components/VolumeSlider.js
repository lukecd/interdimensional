import React, { useState, useEffect } from "react";

const VolumeSlider = (props) => {
    const [curVol, setCurVol] = useState(50);
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        //console.log("soundSource", soundSource.soundSource.getVolume())
        //console.log("soundSource.sampler.volume.value", soundSource.sampler.volume.value)
        // if(soundSource) {
        //     const mappedVol = scale(soundSource.getVolume(), -60, 0, 0, 100);
        //     setCurVol(mappedVol);
        // }
        if(window.$CONDUCTOR) {
            setDisabled(false);
            if(props.type === 'drone') {
                const defaultVol = scale(window.$CONDUCTOR.dronePerformer.soundSource.getVolume(), -60, 0, 0, 110)
                setCurVol(defaultVol);
            }
            else if(props.type === 'pad') {
                const defaultVol = scale(window.$CONDUCTOR.padPerformer.soundSource.getVolume(), -60, 0, 0, 110)
                setCurVol(defaultVol);
            }
            else if(props.type === 'rhythm') {
                const defaultVol = scale(window.$CONDUCTOR.rhythmPerformer1.soundSource.getVolume(), -60, 0, 0, 110)
                setCurVol(defaultVol);
            }
        }

    }, [window.$CONDUCTOR]);


    const updateVol = (newVol) => {
        console.log("VolumeSlider props.type ", props.type)
        console.log("newVol ", newVol);
        newVol = scale(newVol, 0, 100, -60, 0);
        console.log("newVol scaled ", newVol);
        if(window.$CONDUCTOR) {
            if(props.type === 'drone') {
                window.$CONDUCTOR.dronePerformer.soundSource.setVolume(newVol);
            }
            else if(props.type === 'pad') {
                window.$CONDUCTOR.padPerformer.soundSource.setVolume(newVol);
            }
            else if(props.type === 'rhythm') {
                window.$CONDUCTOR.rhythmPerformer1.soundSource.setVolume(newVol);
                window.$CONDUCTOR.rhythmPerformer2.soundSource.setVolume(newVol);
            }
        }
    }

    const scale = (number, inMin, inMax, outMin, outMax) => {
        return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    return (
        <div className='bg-primary'>
            <label for="range" className="font-bold">Volume </label>
            <input type="range" 
                    name="volume" 
                    min="0" 
                    max="100"

                    onChange={(e) => updateVol(e.target.value)}
                    disabled={disabled}
                    className="pl-10 pr-10 h-2 bg-blue-100 appearance-none" />
        </div>
    )
}

export default VolumeSlider