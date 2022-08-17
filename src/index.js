import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";


import App from './App';

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
import { FaWindowRestore } from 'react-icons/fa';


const { chains, provider } = configureChains(
    [chain.polygonMumbai],
    [
      alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }),
      publicProvider()
    ]
  );
  
  const { connectors } = getDefaultWallets({
    appName: 'Interdimensional One',
    chains
  });
  
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })

// i need to learn more about sharing state between react and my canvas animations
// but that's another rabbit hole for another day. going hacky style so I can 
// focus on the music now.
window.$music_playing = false;
window.$CONTRACT_ADDRESS = "0x2C0fDa00F19D0c238AAB2f90107b05B5d6653eA1";
window.$CONDUCTOR = null;
window.$PERFORMING_NFTs = [];
window.$PROTOTYPES = [];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <WagmiConfig client={wagmiClient}>
  <RainbowKitProvider chains={chains} theme={darkTheme()}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </RainbowKitProvider>
  </WagmiConfig>
);