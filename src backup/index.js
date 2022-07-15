import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Play from "./pages/Play";
import Mint from "./pages/Mint";
import Swap from "./pages/Swap";
import About from "./pages/About";
import Canvas from "./Player/Canvas";

import '@rainbow-me/rainbowkit/styles.css'
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';


const { chains, provider } = configureChains(
    [chain.polygonMumbai],
    [
      alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }),
      publicProvider()
    ]
  );
  
  const { connectors } = getDefaultWallets({
    appName: 'Interglactic One',
    chains
  });
  
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })

  

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <WagmiConfig client={wagmiClient}>
  <RainbowKitProvider chains={chains} theme={darkTheme()}>
      <BrowserRouter>
      <Canvas className='flex flex-col w-full h-full z-0'
              height={window.innerHeight} width={window.innerWidth} />
      <div className='absolute w-full h-full z-1 top-0'>
          <Navbar />
          <Routes>
            <Route path="/" element={<Play />} />
            <Route path="/" element={<Mint />} />
            <Route path="/" element={<Swap />} />
            <Route path="/" element={<About />} />
          </Routes>
        </div>
      </BrowserRouter>
  </RainbowKitProvider>
  </WagmiConfig>
);