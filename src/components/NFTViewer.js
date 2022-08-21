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
const NFTViewer = (props) => {

  let [imgURL, setImgURL] = useState([]);
  let [name, setName] = useState("");
  let [description, setDescription] = useState("");
  let [edition, setEdition] = useState("");


  let { data: curNFT } = useContractRead({
    addressOrName: window.$CONTRACT_ADDRESS,
    contractInterface: contractABI,
    functionName: "getTokenURI",
    watch: false,
    args: props.tokenId
  });

  useEffect(() => {
    if (curNFT) {      
      const beginning = "data:application/json;base64,";
      let decode = curNFT.substring(beginning.length);

      decode = atob(decode);
      let nftOBJ = JSON.parse(decode);

      setImgURL(nftOBJ.image);
      setName(nftOBJ.name.substring(0, nftOBJ.name.indexOf("#")));
      setDescription(nftOBJ.description);
      setEdition(nftOBJ.edition)

    }
  }, []);


  return (
    <div className="flex flex-col bg-secondary">
      <img src={imgURL} />

      <div className="flex flex-col justify-between"> 
      <span className="bg-secondary font-info text-xl mt-2 mr-2 ml-2"> {name} </span>
      <span className="bg-secondary font-info text-sm mt-2 mr-2 ml-2"> Edition {edition} </span>

      </div> 

    

    </div>
  )
}

export default NFTViewer