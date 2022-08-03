
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

const Mixer = (props) => {
  let [nfts, setNFTs] = useState([]);
  let [droneNFTs, setDroneNFTs] = useState([]);
  let [padNFTs, setPadNFTs] = useState([]);
  let [rhythmNFTs, setRhythmNFTs] = useState([]);
  let [droneSource, setDroneSource] = useState();
  let [padSource, setPadSource] = useState();
  let [rhythmSource, setRhythmSource] = useState();

  const { data: allNFTs } = useContractRead({
    addressOrName: window.$CONTRACT_ADDRESS,
    contractInterface: contractABI,
    functionName: "getAllNFTs",
    watch: false,
  });

  // TODO change call from getAllNFTs to be user specific

  useEffect(() => {
    console.log("window.$CONTRACT_ADDRESS", window.$CONTRACT_ADDRESS);
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
    console.log("window.$CONDUCTOR ", window.$CONDUCTOR);
    if(window.$CONDUCTOR) {
console.log("window.$CONDUCTOR ", window.$CONDUCTOR);
console.log("window.$CONDUCTOR.dronePerformer ", window.$CONDUCTOR.dronePerformer);

      setDroneSource(window.$CONDUCTOR.dronePerformer.getSoundsource());
      setPadSource(window.$CONDUCTOR.padPerformer.getSoundsource());
      //setRhythmSource(window.$CONDUCTOR.rhythmPerformer.getSoundsource());

    }
  }, []);



  return (
    <div className='mt-[90px] w-screen h-screen bg-background'>
      <div className='grid grid-cols-3 gap-4 ml-5 mr-5 bg-background border-8 border-primary'>

      <div>
          <h1 className='text-3xl align-center font-heading bg-primary'>Drones</h1>
          <VolumeSlider type="drone" play={props.play}/>
          {droneNFTs.map(nft => {
            return (
              <PerformerViewer key={nft.tokenId.toString()} tokenId={nft.tokenId.toString()} />
            );
          })}
        </div>

        <div>
          <h1 className='text-3xl align-center font-heading bg-primary'>Pads</h1>
          <VolumeSlider type="pad" play={props.play}/>
          {padNFTs.map(nft => {
            return (
              <PerformerViewer key={nft.tokenId.toString()} tokenId={nft.tokenId.toString()} />
            );
          })}

        </div>

        <div className="">
          <h1 className='text-3xl align-center font-heading bg-primary'>Rhythms</h1>
          <VolumeSlider type="rhythm" play={props.play}/>
          {rhythmNFTs.map(nft => {
            return (
              <PerformerViewer key={nft.tokenId.toString()} tokenId={nft.tokenId.toString()} />
            );
          })}

        </div>


      </div>
    
    </div>
  )
}

export default Mixer

/***
 * 
 * 

 

 */