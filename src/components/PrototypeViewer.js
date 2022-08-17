import React, { useState, useEffect, useLayoutEffect } from "react";
import GenerativeSpaceRenderer from "../Player/Renderer/GenerativeSpaceRenderer";

import {
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
  useSigner,
  useContract
} from "wagmi";
import { ethers } from "ethers";
import chroma from "chroma-js";
import contractABI from '../abi/InterdimensionalOne.json';
import { FiPlay, FiPause } from 'react-icons/fi';
import PreviewEngine from "../Player/PreviewEngine";


/**
 * 
 * @returns A responsive viewer showing a Performer NFT
 */
const PrototypeViewer = (props) => {

  let [prototypeId, setPrototypeId] = useState(-1);
  let [canvasName, setCanvasName] = useState("");
  let [formattedPrice, setFormattedPrice] = useState(0);

  let [previewEngine, setPreviewEngine] = useState(null);
  let [isPreviewing, setIsPreviewing] = useState(false);
  let [part, setPart] = useState("");
  let [instrument, setInstrument] = useState("");
  let [soundFiles, setSoundFiles] = useState("");

  const { data: signer, isError: isSignerError, isLoading: isSignerLoading } = useSigner();

  // contract signer, used to get all NFTs for a user.
  // i'm using this and not useContractRead as I need msg.sender inside the contract to point back to me
  const contractSigner = useContract({
    addressOrName: window.$CONTRACT_ADDRESS,
    contractInterface: contractABI,
    signerOrProvider: signer,
  });  

  const {
    data: mintData,
    write: mint,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useContractWrite({
    addressOrName: window.$CONTRACT_ADDRESS,
    contractInterface: contractABI,
    functionName: "mint",
    overrides: {value: ethers.utils.parseEther(".024"), gasLimit: 1000000},
  });

  useEffect(() => {
    const pId = props.prototype.prototypeId.toString();
    setPrototypeId(pId);
    setCanvasName("prototype"+pId);
    setFormattedPrice(ethers.utils.formatEther(props.prototype.price.toString()));
    setPart(props.prototype.part);
    setInstrument(props.prototype.instrument);

    let sounds = props.prototype.soundFiles.toString();
    console.log("sounds ", sounds)
    //sounds = ethers.utils.toUtf8String(sounds);
    let soundOBJ = JSON.parse(sounds.trim());
    console.log("soundOBJ ", soundOBJ)
    setSoundFiles(soundOBJ);
  }, []);

  // called when the canvas is finally laid out
  useLayoutEffect(() => {
    var canvas = document.getElementById(canvasName);
    if(canvas) {
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = props.prototype.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);    
    }
  }, [canvasName]);

  const playPreview = () => {
    const preview = new PreviewEngine(part, instrument, soundFiles, props.prototype.color);
    preview.play();
    setPreviewEngine(preview);
    setIsPreviewing(true);
  }

  const pausePreview = () => {
      previewEngine.pause();
      setIsPreviewing(false);
      setPreviewEngine(null);
  }

  const mintNFT = async () => {
    var canvas = document.getElementById(canvasName);
    if(canvas) {
      var ctx = canvas.getContext("2d");
      const renderer = new GenerativeSpaceRenderer(0, 0, 400, 400, props.prototype.color, ctx);

      await contractSigner.mint(prototypeId, renderer.toSVG(), { value: props.prototype.price.toString(), gasLimit: 6000000 })
      .then( returnValue => {console.log("mint success ", returnValue)})
      .catch(error => console.log("error on mint...", error.reason))

      console.log("calling Mint")
      //await mint({args: [prototypeId, renderer.toSVG()]});
      console.log("mintError ", mintError)
    }
  }



  return (
    <div className="flex flex-col bg-secondary mt-1 mb-1 ml-1 mr-1">
        
      <canvas id={canvasName} width="400" height="400"></canvas>
      <div className="flex flex-col justify-between"> 
      <span className="bg-secondary font-info text-xl mt-2 mr-2 ml-2"> {props.prototype.name} </span>
      <span className="bg-secondary font-info text-sm mt-2 ml-2 mr-2">Price {formattedPrice} MATIC
      <span className="bg-secondary font-info text-sm mt-2 mr-2"> * Edition {props.prototype.currentlyMinted.toString()}:{props.prototype.editionSize.toString()} </span>
      </span>
      </div> 
      
      <div className="flex flex-row justify-end">
        
        <button onClick={mintNFT} className='hover:bg-[#d31a83] hover:border-[#d31a83] text-white border-2 mx-1 px-5 my-2 mr-10 rounded-sm'>
          Mint 
        </button>
        {!isPreviewing && (
          <FiPlay size={40} onClick={playPreview} className='hover:bg-[#d31a83] hover:border-[#d31a83] w-[40px]'/>
        )}
        {isPreviewing && (
          <FiPause size={40} onClick={pausePreview} className='hover:bg-[#d31a83] hover:border-[#d31a83] w-[40px]'/>
        )}

      </div> 

    </div>

  )
}

export default PrototypeViewer