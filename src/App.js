
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Stage from "./pages/Stage";
import Mint from "./pages/Mint";
import Swap from "./pages/Swap";
import About from "./pages/About";
import Canvas from "./Player/Canvas";

const App = () => {
    const [playing, setPlaying] = useState(false);
    return (
        <div name='top' className='w-full h-view top-0'>
            <Canvas className='fixed'
                    height={window.innerHeight} 
                    width={window.innerWidth}
                    playing={playing} />
            <div className='absolute w-full h-full z-1 top-0'>
            <Navbar setPlaying={setPlaying}/>
            <Routes>
                <Route path="/" element={<Stage />} />
                <Route path="/mint" element={<Mint />} />
                <Route path="/swap" element={<Swap />} />
                <Route path="/about" element={<About />} />
            </Routes>
            </div>
        </div>


    )
}

export default App


