import React, { useState, useEffect } from "react";

import {
  useContractRead,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import chroma from "chroma-js";
import contractABI from '../abi/MosEisleyCantina.json';

/**
 * 
 * @returns A responsive viewer showing a Performer NFT
 */
const PerformerViewer = (props) => {

  let [imgURL, setImgURL] = useState([]);
  let [performerType, setPerformerType] = useState([]);
  let [performerInstrument, setPerformerInstrument] = useState([]);
  let [performerData, setPerformerData] = useState([]);

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
    }
  }, []);

  return (
    <div>
      <img src={imgURL} />
    </div>
  )
}

export default PerformerViewer