import React from 'react'
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

const Mint = () => {
  const [color, setColor] = useColor("hex", "#121212");

  return (
    <div className='mt-[90px] w-screen h-screen z-0 bg-background'>
      <div className='flex flex-col pl-8 pr-8 pb-8 ml-8 mr-8 bg-primary border-8 border-secondary '>
        <h1 className='text-4xl align-center font-heading'>Mint A Performer</h1>

        <div className='flex flex-col pl-3 pr-3 pb-3  bg-background border-8 border-primary '>
          <h1 className='text-3xl align-center font-heading bg-primary'>1. Pick A Color</h1>
            <div className='pt-3'>
              <ColorPicker width={456} height={228} 
                        color={color} 
                        onChange={setColor} hideHSV dark />
            </div>
        </div>

          <div className='flex flex-col pl-3 pr-3 pb-3  bg-background border-8 border-primary '>
          <h1 className='text-3xl align-center font-heading bg-primary'>2. Pick An Instrument</h1>
            <div className='pt-3'>
            <input className='' type="radio" name="instrument" value="Pad"/><span className='bg-secondary ml-1 mr-5'>Pad</span>
            <input className='' type="radio" name="instrument" value="Melody1"/><span className='bg-secondary ml-1 mr-5'>Melody 1</span>
            <input className='' type="radio" name="instrument" value="Melody2"/><span className='bg-secondary ml-1 mr-5'>Melody 2</span>
            <input className='' type="radio" name="instrument" value="Bass"/><span className='bg-secondary ml-1 mr-5'>Bass</span>

            </div>
          </div>   

          <div className='flex flex-col pl-3 pr-3 pb-3  bg-background border-8 border-primary '>
          <h1 className='text-3xl align-center font-heading bg-primary'>3. Give Them A Name</h1>
            <div className='pt-3'>
            <input class="block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"  type="text" name="search"/>

            </div>
          </div>  

          <div className='flex flex-col pl-3 pr-3 pb-3  bg-background border-8 border-primary '>
          <h1 className='text-3xl align-center font-heading bg-primary'>4. Set A Price</h1>
            <div className='pt-3'>
            <input class="block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"  type="text" name="search"/>
            </div>         
          </div>  
             
          <div className='flex flex-col pl-3 pr-3 pb-3  bg-background border-8 border-primary '>
          <h1 className='text-3xl align-center font-heading bg-primary'>5. Mint</h1>
            <div className='pt-3'>
              <button class="bg-primary hover:primary text-white font-semibold hover:text-white py-2 px-4 border border-secondary hover:bg-secondary rounded">
                Mint
              </button>
            </div>         
          </div>     
      </div>

  

    </div>
  )
}

export default Mint