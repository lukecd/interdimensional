
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Stage from "./pages/Stage";
import SoundStore from "./pages/SoundStore";
import Mint from "./pages/Mint";
import Mixer from "./pages/Mixer";
import About from "./pages/About";
import Canvas from "./Player/Canvas";
import DotRenderer from './pages/DotRenderer';

const App = () => {
    const [play, setPlay] = useState(false);
    const [demoMode, setDemoMode] = useState(true);

    return (
        <div name='top' className='w-full h-full  min-h-screen top-0 bg-background'>
            <Canvas className='fixed'
                    height={window.innerHeight} 
                    width={window.innerWidth}
                    play={play} 
                    setPlay={setPlay}
                    demoMode={setDemoMode}
                    />
            <div className='absolute w-full z-1 top-0 bg-background'>
                <Navbar className='bg-black z-3' play={play} setPlay={setPlay}/>
                <Routes>
                    <Route path="/" element={<Stage />} />
                    <Route path="/mixer" element={<Mixer />}  play={play} setPlay={setPlay}/>
                    <Route path="/sounds" element={<SoundStore />} />
                    <Route path="/mint" element={<Mint />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </div>
        </div>


    )
}

export default App


