import React, { useState, useEffect } from "react";
import GenerativeSpaceRenderer from "../Player/Renderer/GenerativeSpaceRenderer";
import { ColorPicker, useColor } from "react-color-palette";

const NFTDesigner = () => {
    let [color, setColor] = useColor("hex", "#cc0202");

    useEffect(() => {
        var canvas = document.getElementById("nftDesign");
        var ctx = canvas.getContext("2d");

        const renderer = new GenerativeSpaceRenderer(0, 0, 400, 400, color.hex, ctx);

    }, [color]);

    return (
        <div className='grid grid-cols-2'>
            <div className='content-center border-4 border-zinc-50'>
                <canvas id="nftDesign" width="400" height="400"></canvas>
            </div>
            <div>
                <ColorPicker width={456} height={228} 
                            color={color} 
                            onChange={setColor} hideHSV hideRGB dark />
            </div>
        </div>
    )
}

export default NFTDesigner