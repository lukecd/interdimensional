
import React, { useState, useEffect } from "react";

import {
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import chroma from "chroma-js";
import contractABI from '../abi/InterdimensionalOne.json';
import PrototypeViewer from '../components/PrototypeViewer'


const SoundStore = (props) => {
  let [prototypes, setPrototypes] = useState([]);
  let [drones, setDrones] = useState([]);
  let [pads, setPads] = useState([]);
  let [rhythms, setRhythms] = useState([]);
  const { data: allPrototypes } = useContractRead({
    addressOrName: window.$CONTRACT_ADDRESS,
    contractInterface: contractABI,
    functionName: "getPrototypesForCollectionId",
    watch: false, // TODO: should this be true?
    args: 1
  });

  // TODO change call from getAllNFTs to be user specific

  useEffect(() => {
    console.log("allPrototypes ", allPrototypes);

    if (allPrototypes) {
      setPrototypes(allPrototypes);
      // window.$PERFORMING_NFTs = allNFTs;

      // break my NFTs into different categories
      let drones = allPrototypes.filter(function (prototype) {
        return prototype.part === 'drone'
      })
      setDrones(drones);

      let pads = allPrototypes.filter(function (prototype) {
        return prototype.part === 'pad'
      })
      setPads(pads);

      let rhythms = allPrototypes.filter(function (prototype) {
        return prototype.part === 'rhythm'
      })
      setRhythms(rhythms);
    }

  }, []);

return (
    <div className='mt-[90px] w-screen h-screen bg-background'>
      <div className='grid grid-cols-3 ml-5 mr-5 bg-background border-8 border-primary'>

      <div>
          <h1 className='text-3xl align-center font-heading bg-primary pl-2'>Drones</h1>

          {drones.map(prototype => {
            return (
              <PrototypeViewer key={prototype.prototypeId.toString()} prototype={prototype}/>
            );
          })}
        </div>

        <div>
          <h1 className='text-3xl align-center font-heading bg-primary pl-2'>Pads</h1>

          {pads.map(prototype => {
            return (
              <PrototypeViewer key={prototype.prototypeId.toString()} prototype={prototype}/>
            );
          })}

        </div>

        <div className="">
          <h1 className='text-3xl align-center font-heading bg-primary pl-2'>Rhythms</h1>

          {rhythms.map(prototype => {
            return (
              <PrototypeViewer key={prototype.prototypeId.toString()} prototype={prototype}/>
            );
          })}

        </div>


      </div>
    
    </div>
  )
}

export default SoundStore