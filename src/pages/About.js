import React from 'react'

const About = () => {
  return (
    <div className='mt-[90px] w-screen h-screen bg-background'>
    <div className='flex flex-col align-center w-[70%] pl-8 pr-8 pb-8 ml-8 mr-8 bg-primary border-8 border-secondary'>

      <div className='text-xl mt-5 font-heading bg-primary'>
        Interdimensional.One is a generative art and music experience that feeds off NFTs. It's portal from your monkey mind to a place of stillness. It's the first ever NFT marketplace for sound designers.
        It's a place you go to relax, you can watch the visuals or interact with them. You can close you eyes and meditate to the music or you can let it carry you into a flow state while writing code. It's simple enough to not be distracting and dynamic enough to not be boring.   
      </div>

      <div className='text-xl mt-5 font-heading bg-primary'>
        NFTs are represented initially by a color and a unique instance of sound design. The color info and location of sound design files is stored on-chain. When minting an NFT, the color fades away to reveal a generative design (unique to that mint) and becomes the minter's property. The minter owns the design and (as NFTs are minted in editions), shares ownership of the sound design. 

        The NFTs are used to unlock the generative music player. 

        Each NFT drop is made up of a unique visualizer, a collection of 30-50 colors that work well together and 30-50 sounds that sound good together. The current visualizer using bouncing balls is just the first one, future drops will have different visualizers. To gain access to new visualizers, users will have to collect NFTs from future drops.     
      </div>

      <div className='mt-5 font-heading bg-primary'>
        All sourcecode is opensource
        <ul>
          <li>Front-end: <a href="https://github.com/lukecd/interdimensional" target="_blank">https://github.com/lukecd/interdimensional</a></li>
          <li>Smart contracts: <a href="https://github.com/lukecd/interdimensional-contracts" target="_blank"> https://github.com/lukecd/interdimensional-contracts</a></li>
        </ul>
        
        
      </div>

    </div>


    </div>
  )
}

export default About