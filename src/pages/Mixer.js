
import React, { useState, useEffect } from "react";

import {
  useContract,
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
  useSigner
} from "wagmi";
import { ethers } from "ethers";
import chroma from "chroma-js";
import contractABI from '../abi/InterdimensionalOne.json';
import NFTViewer from "../components/NFTViewer";
import VolumeSlider from "../components/VolumeSlider";
import { isLabelWithInternallyDisabledControl } from "@testing-library/user-event/dist/utils";

const Mixer = (props) => {
  const [nfts, setNFTs] = useState([]);
  const [droneNFTs, setDroneNFTs] = useState([]);
  const [padNFTs, setPadNFTs] = useState([]);
  const [rhythmNFTs, setRhythmNFTs] = useState([]);

  const { data: signer, isError: isSignerError, isLoading: isSignerLoading } = useSigner();

  // contract signer, used to get all NFTs for a user.
  // i'm using this and not useContractRead as I need msg.sender inside the contract to point back to me
  const contractSigner = useContract({
    addressOrName: window.$CONTRACT_ADDRESS,
    contractInterface: contractABI,
    signerOrProvider: signer,
  });    

  // read all protypes seperatly, then cross reference
  // basically do a table join thing on my own to reduce calls to the blockchain
  const { data: allPrototypes } = useContractRead({
    addressOrName: window.$CONTRACT_ADDRESS,
    contractInterface: contractABI,
    functionName: "getPrototypesForCollectionId",
    watch: false, // TODO: should this be true?
    args: 1
  });

  // TODO change call from getAllNFTs to be user specific

  useEffect(() => {
    if(signer) {
      //create a local copy to use while we wait for asynchronous calls to state variables to settle
      let localNFTs = [];

      const checkNFTs = async () => {
        await getMyNFTS()
          //.then( returnValue => {setNFTs(returnValue); localNFTs=returnValue})
          .catch(error => {console.log("getMyNFTS ", error)});
      };
      checkNFTs();
    }

  }, [signer]);

  const prototypeIdToType = (prototypeId) => {
    if(allPrototypes) {
      for(let i=0; i<allPrototypes.length; i++) {
        if(allPrototypes[i].prototypeId == prototypeId) return allPrototypes[i].part;
      }
    }

    return null;
  }

  const layoutNFTs = async (myNFTs) => {
    window.$PERFORMING_NFTs = nfts;
    window.$PROTOTYPES = allPrototypes;
    let drones = [];
    let pads = [];
    let rhythms = [];

    for(let i=0; i<myNFTs.length; i++) {
      const curType = prototypeIdToType(myNFTs[i].prototypeId.toString());

      if(curType == 'drone') drones.push(myNFTs[i]);  
      else if(curType == 'pad') pads.push(myNFTs[i]);
      else if(curType == 'rhythm') rhythms.push(myNFTs[i]);

    }
    setDroneNFTs(drones);
    setPadNFTs(pads);
    setRhythmNFTs(rhythms);
  }

  /**
   * 
   * @returns The amount of ADAMS tokens currently staked
   */
  const getMyNFTS = async () => {
    let myNFTs = await contractSigner.getMyNFTS();
    setNFTs(myNFTs);
    layoutNFTs(myNFTs);
  }

  return (
    <div className='mt-[90px] w-screen h-screen bg-background'>
      <div className='grid grid-cols-3 gap-4 ml-5 mr-5 bg-background border-8 border-primary'>

      <div>
          <h1 className='text-3xl align-center font-heading bg-primary'>Drones</h1>
          <VolumeSlider type="drone" play={props.play}/>
          {droneNFTs.map(nft => {
            return (
              <NFTViewer key={nft.tokenId.toString()} tokenId={nft.tokenId.toString()} showPrice="false"/>
            );
          })}
        </div>

        <div>
          <h1 className='text-3xl align-center font-heading bg-primary'>Pads</h1>
          <VolumeSlider type="pad" play={props.play}/>
          {padNFTs.map(nft => {
            return (
              <NFTViewer key={nft.tokenId.toString()} tokenId={nft.tokenId.toString()} showPrice="false"/>
            );
          })}

        </div>

        <div className="">
          <h1 className='text-3xl align-center font-heading bg-primary'>Rhythms</h1>
          <VolumeSlider type="rhythm" play={props.play}/>
          {rhythmNFTs.map(nft => {
            return (
              <NFTViewer key={nft.tokenId.toString()} tokenId={nft.tokenId.toString()} showPrice="false" />
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