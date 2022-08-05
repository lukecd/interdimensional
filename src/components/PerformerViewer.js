import React, { useState, useEffect } from "react";

import {
  useContractRead,
  useWaitForTransaction,
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
const PerformerViewer = (props) => {

  let [imgURL, setImgURL] = useState([]);
  let [performerType, setPerformerType] = useState([]);
  let [performerInstrument, setPerformerInstrument] = useState([]);
  let [performerData, setPerformerData] = useState([]);
  let [formattedPrice, setFormattedPrice] = useState(0);
  let [shouldShowPrice, setShouldShowPrice] = useState(false);
  let [previewEngine, setPreviewEngine] = useState(null);
  let [isPreviewing, setIsPreviewing] = useState(false);

  const { data: curNFT } = useContractRead({
    addressOrName: window.$CONTRACT_ADDRESS,
    contractInterface: contractABI,
    functionName: "getTokenURI",
    watch: false,
    args: props.tokenId
  });

  useEffect(() => {
    if (curNFT) {
      const beginning = "data:application/json;base64,";
      let decode = curNFT.substring(beginning.length)
      decode = atob(decode);
      let nftOBJ = JSON.parse(decode);

      setImgURL(nftOBJ.image);
      setPerformerType(nftOBJ.performerType);
      setPerformerInstrument(nftOBJ.performerInstrument);
      setPerformerData(nftOBJ.performerData);

      // hacky code because of how JS deals with booleans and strings
      if(props.showPrice && props.showPrice == "true") {
        setFormattedPrice(ethers.utils.formatEther(props.price.toString()));
        setShouldShowPrice(true);
      }
    }
  }, []);

  const playPreview = () => {
    const preview = new PreviewEngine(performerType, performerInstrument);
    console.log("created preview ", preview);
    preview.play();
    setPreviewEngine(preview);
    setIsPreviewing(true);
  }

  const pausePreview = () => {
      previewEngine.pause();
      setIsPreviewing(false);
      setPreviewEngine(null);
  }

  const mintNFT = () => {

  }

  return (
    <div className="flex flex-col bg-secondary">
      <img src={imgURL} />

      {(shouldShowPrice && (
      <div className="flex flex-row justify-end">
        <span className="bg-secondary font-info text-xl mt-2 mr-2">Price {formattedPrice} MATIC</span>
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
      ))}
    </div>
  )
}

export default PerformerViewer