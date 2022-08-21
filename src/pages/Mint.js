import React, { useState} from "react";

import NFTDesigner from "../components/NFTDesigner"
import "react-color-palette/lib/css/styles.css";
import { ColorPicker, useColor } from "react-color-palette";

import {
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import chroma from "chroma-js";
import contractABI from '../abi/InterdimensionalOne.json';

const Mint = () => {
  let [color, setColor] = useColor("hex", "#121212");
  let [performerName, setPerformerName] = useState("");
  let [performerType, setPerformerType] = useState("");
  let [performerInstrument, setPerformerInstrument] = useState("");
  let [performerData, setPerformerData] = useState("7|16");
  let [price, setPrice] = useState(0);

  const {
    data: mintData,
    write: createPerformer,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useContractWrite({
    addressOrName: window.$CONTRACT_ADDRESS,
    contractInterface: contractABI,
    functionName: "mint",
  });

  // function mint(string memory name, string memory pColor, string memory sColor, 
  //   string memory pType, string memory pInstrument, string memory pData, uint256 price) public {
  const mintNFT = async () => {
    //const sColor = chroma(color.hex).saturate(3).hex();
    const sColor = "#FFFFFF";

    const parsedPrice = ethers.utils.parseEther(""+price);


    await createPerformer({args: [performerName, color.hex, sColor, performerType, performerInstrument, performerData, parsedPrice]});
  }




  return (
    <div className='mt-[90px] w-screen h-screen bg-background'>
      <div className='flex flex-col pl-8 pr-8 pb-8 ml-8 mr-8 bg-primary border-8 border-secondary '>
        <h1 className='text-4xl align-center font-heading'>Mint A Performer</h1>

        <div className='flex flex-col pl-3 pr-3 pb-3  bg-background border-8 border-primary '>
          <h1 className='text-3xl align-center font-heading bg-primary'>1. Pick A Color</h1>
              <NFTDesigner type="drone" />
        </div>

          <div className='flex flex-col pl-3 pr-3 pb-3  bg-background border-8 border-primary '>
          <h1 className='text-3xl align-center font-heading bg-primary'>2. Pick An Instrument</h1>
            <div className='pt-3'>
            <input className='' type="radio" name="instrument" value="drone" onChange={(e) => {setPerformerType('drone'); setPerformerInstrument('drone-inside');}}/><span className='bg-secondary ml-1 mr-5'>Drone Inside</span>
            <input className='' type="radio" name="instrument" value="pad" onChange={(e) => {setPerformerType('pad'); setPerformerInstrument('pad-canyon');}}/><span className='bg-secondary ml-1 mr-5'>Deep Canyon Pad</span>
            <input className='' type="radio" name="instrument" value="rhythm1" onChange={(e) => {setPerformerType('rhythm'); setPerformerInstrument('mallet-marimba');}}/><span className='bg-secondary ml-1 mr-5'>Marimba</span>
            <input className='' type="radio" name="instrument" value="rhythm2" onChange={(e) => {setPerformerType('rhythm'); setPerformerInstrument('mallet-mellow');}}/><span className='bg-secondary ml-1 mr-5'>Mellow Mallets</span>
            </div>
          </div>   

          <div className='flex flex-col pl-3 pr-3 pb-3  bg-background border-8 border-primary '>
          <h1 className='text-3xl align-center font-heading bg-primary'>3. Give Them A Name</h1>
            <div className='w-1/3 pt-3'>
            <input onChange={(e) => setPerformerName(e.target.value)} 
                   className="block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"  
                   type="text" 
                   name="price"
                   maxlength="18"/>

            </div>
          </div>  

          <div className='flex flex-col pl-3 pr-3 pb-3  bg-background border-8 border-primary '>
          <h1 className='text-3xl align-center font-heading bg-primary'>4. Set A Price</h1>
            <div className='w-1/3 pt-3'>
            <input onChange={(e) => setPrice(e.target.value)} 
                   className="block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"  
                   type="number" 
                   name="price"/>
            </div>         
          </div>  
             
          <div className='flex flex-col pl-3 pr-3 pb-3  bg-background border-8 border-primary '>
          <h1 className='text-3xl align-center font-heading bg-primary'>5. Mint</h1>
            <div className='pt-3'>
              <button onClick={mintNFT} className="bg-primary hover:primary text-white font-semibold hover:text-white py-2 px-4 border border-secondary hover:bg-secondary rounded">
                Mint
              </button>
            </div>         
          </div>     
      </div>

  

    </div>
  )
}

export default Mint