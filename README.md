# Interdimensional One: A Portal To Stillness

This is the front-end for Interdimensional One, a portal to a quiet mind.
The smart contracts can be found here
https://github.com/lukecd/interdimensional-contracts

You can interact with the dApp on the Mumbai Testnet here
https://interdimensional.one/

## Inspiration
Interdimensional.One is a generative art and music experience that feeds off NFTs. It's portal from your monkey mind to a place of stillness. It's the first ever NFT marketplace for sound designers.

It's a place you go to relax, you can watch the visuals or interact with them. You can close you eyes and meditate to the music or you can let it carry you into a flow state while writing code. It's simple enough to not be distracting and dynamic enough to not be boring. 

I'm big fan of generative art and music, art where there's thought put into designing an algorithm and that algorithm produces something visually and aurally pleasing. It's an interesting space, because it's art where we're creating a set of instructions that then go on to create something visually pleasing. In many ways it parallels the work of conceptual artists like Sol LeWitt, who instead of painting his own work, he provides instructions for museums to paint it themselves. While LeWitt might say something like "employee 4 draftsmen for 4 hours a day and have them draw lines 4 inches long", I'm writing JavaScript code that tells the computer how to make my art.

What's fun here is I've added an extra layer where a single algorithm creates both visuals and audio, those visuals are powered by a physics engine and then the interaction of those visuals further modifies the audio. 

## What it does
NFTs are represented initially by a color and a unique instance of sound design. The color info and location of sound design files is stored on-chain. When minting an NFT, the color fades away to reveal a generative design (unique to that mint) and becomes the minter's property. The minter owns the design and (as NFTs are minted in editions), shares ownership of the sound design. 

The NFTs are used to unlock the generative music player. 

Each NFT drop is made up of a unique visualizer, a collection of 30-50 colors that work well together and 30-50 sounds that sound good together. The current visualizer using bouncing balls is just the first one, future drops will have different visualizers. To gain access to new visualizers, users will have to collect NFTs from future drops. 

## How we built it
The backend is a smart contract currently running on the Mumbai Testnet. 
The frontend is a mix of OO JavaScript and React. The main website is built using React and then generative system is built as a JavaScript plugin. This was designed to allow others to build their own uses of the NFTs and for future visualizers to easily be added.

As all code is opensource and the sound design is owned by the NFT minter, there's no limit to what people can do with the files. 

## Challenges we ran into
This was the first large coding project I build in a very long time, so pretty much everything was a challenge:) Things are working, but there are parts that seem a bit hacky too me and could use feedback from a more experienced coder. I don't love how I'm managing state between React and my generative system, and I think things would be a lot faster if I build some caching. 

Also currently on NFT mint, I pass SVG data for the design directly to the contract and then save that onchain. This isn't ideal as it means anyone could build a frontend that sends over their own SVG data, allowing them to create their own design. That said, I kinda put off dealing with this problem as I'm not 100% sure I want to go to SVG route. As I was finishing this project, I read about HTML Canvas NFTs and am wondering if that might be better. I didn't have time to test them before deadline, but will be working on it next week. 

## Accomplishments that we're proud of
My background briefly is that I went to school for computer science in the 90s, dropped out and worked in startups for 8 years ... then dropped out of that and took an 18 year break from coding. I've been getting back into coding throughout 2022, however pretty much everything I'm doing now I learned since May 2022. My first dApp was a DEX inspired by the number 42 (https://adams.exchange) and then this project is my second. Really I'm mostly proud I was able to built this app by myself, that I was able to learn from amazing content on YouTube and I was able to create blockchain dApps. 

I did use many 3rd party libraries and have listed them below. They helped with sound synthesis (tone.js), musical timing (tone.js), animation physics (matter.js) music theory (tonal.js) and color management (choma.js). 

## What's next for Interdimensional One
Right now the main thing I need to do is get feedback from music people and NFT people, see what they think of the project. There are specific areas I want to try and improve, however it would be helpful to get input first. 

Main areas of focus are
1. Music generation (I want to experiment with using Google's Magenta machine learning library https://magenta.tensorflow.org/)
2. NFT design (I want to try using HTML Canvas instead of SVG)
3. Scalability (I have no idea how this will scale and need help there for sure)
4. Where to store sound design files (currently they're stored on the main web server with onchain JSON data pointing to their location. I'd like to experiment with using Filecoin and IPFS.
5. Sound design mode (adding support for MIDI out over USB so I can connect my hardware synths when designing sounds)

Third Party Stuff
<ul>
    <li>Dynamic Chord Generation 
        https://www.youtube.com/watch?v=nWuCyVf2IGI
    </li>
    <li>Dynamic Melody / Bass 
        https://www.youtube.com/watch?v=LPy2TQLxv6M
    </li>
    <li>
        Tone.js
        https://tonejs.github.io/
    </li>
    <li>
        Tonal.js
        https://github.com/tonaljs/tonal
    </li>
    <li>
        Chroma.js
        https://gka.github.io/chroma.js/
    </li>
</ul>

Inspiration
<ul>
    <li>
        Sequencing inspiration from NDLR
        https://conductivelabs.com/ndlr/
    </li>
    <li>
        Very obvious visual inspriation from Bloom (iOS)
        https://apps.apple.com/gb/app/bloom/id292792586
    </li>
    <li>
        Of course huge inspriation from people like Brian Eno and John Cage
    </li>
</ul>