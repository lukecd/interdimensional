
import React, { useState, useEffect } from "react";

import {
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import chroma from "chroma-js";
import contractABI from '../abi/MosEisleyCantina.json';

import PerformerViewer from "../components/PerformerViewer";

const Mixer = () => {
  let [nfts, setNFTs] = useState([]);

  const { data: allNFTs } = useContractRead({
    addressOrName: window.$CONTRACT_ADDRESS,
    contractInterface: contractABI,
    functionName: "getAllNFTs",
    watch: false,
  });

  useEffect(() => {
    console.log("window.$CONTRACT_ADDRESS", window.$CONTRACT_ADDRESS);
    if (allNFTs) {
      console.log("allNFTs ", allNFTs);
      setNFTs(allNFTs);
    }
  }, []);



  return (
    <div className='mt-[90px] w-screen h-screen bg-background'>
    <div className='flex flex-row pl-8 pr-8 pb-8 ml-8 mr-8 bg-background border-8 border-primary'>


      {nfts.map(nft => {
        return (
          <div className="w-1/3 pl-2 pr-2 pt-5">
          <PerformerViewer key={nft.tokenId.toString()} tokenId={nft.tokenId.toString()} />
          </div>
        );
      })}


    </div>
    </div>
  )
}

export default Mixer