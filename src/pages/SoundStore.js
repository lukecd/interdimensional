
import React, { useState, useEffect } from "react";

import {
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import chroma from "chroma-js";
import contractABI from '../abi/InterdimensionalOne.json';
import PerformerViewer from "../components/PerformerViewer";
import VolumeSlider from "../components/VolumeSlider";

const SoundStore = (props) => {
  let [nfts, setNFTs] = useState([]);
  let [droneNFTs, setDroneNFTs] = useState([]);
  let [padNFTs, setPadNFTs] = useState([]);
  let [rhythmNFTs, setRhythmNFTs] = useState([]);
  const { data: allNFTs } = useContractRead({
    addressOrName: window.$CONTRACT_ADDRESS,
    contractInterface: contractABI,
    functionName: "getAllNFTs",
    watch: false,
  });

  // TODO change call from getAllNFTs to be user specific

  useEffect(() => {
    if (allNFTs) {
      console.log("allNFTs ", allNFTs);
      setNFTs(allNFTs);
      window.$PERFORMING_NFTs = allNFTs;

      // break my NFTs into different categories
      let drones = allNFTs.filter(function (nft) {
        return nft.performerType === 'drone'
      })
      setDroneNFTs(drones);

      let pads = allNFTs.filter(function (nft) {
        return nft.performerType === 'pad'
      })
      setPadNFTs(pads);

      let rhythms = allNFTs.filter(function (nft) {
        return nft.performerType === 'rhythm'
      })
      setRhythmNFTs(rhythms);
    }

  }, []);

return (
    <div className='mt-[90px] w-screen h-screen bg-background'>
      <div className='grid grid-cols-3 gap-4 ml-5 mr-5 bg-background border-8 border-primary'>

      <div>
          <h1 className='text-3xl align-center font-heading bg-primary'>Drones</h1>

          {droneNFTs.map(nft => {
            return (
              <PerformerViewer key={nft.tokenId.toString()} tokenId={nft.tokenId.toString()} showPrice="true" price={nft.price}/>
            );
          })}
        </div>

        <div>
          <h1 className='text-3xl align-center font-heading bg-primary'>Pads</h1>

          {padNFTs.map(nft => {
            return (
              <PerformerViewer key={nft.tokenId.toString()} tokenId={nft.tokenId.toString()} showPrice="true" price={nft.price}/>
            );
          })}

        </div>

        <div className="">
          <h1 className='text-3xl align-center font-heading bg-primary'>Rhythms</h1>

          {rhythmNFTs.map(nft => {
            return (
              <PerformerViewer key={nft.tokenId.toString()} tokenId={nft.tokenId.toString()} showPrice="true" price={nft.price}/>
            );
          })}

        </div>


      </div>
    
    </div>
  )
}

export default SoundStore