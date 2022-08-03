import '../index.css';

import { Link, useHistory } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';


import React, { useState } from 'react';

import {FaBars, FaTimes} from 'react-icons/fa';
import { FiPlay, FiPause } from 'react-icons/fi';

import * as Tone from "tone"

/**
 * @returns Top navigation bar
 */
const Navbar = (props) => {
    const [nav, setNav] = useState(false);
    const [showPlay, setShowPlay] = useState(false);
    const handleClick = () => setNav(!nav);

    const playPause = () => {
        // so i'm struggling to maintain state between my base website and my JavaScript app
        // right now some things are doubled up. 
        // Hopefully someday I'll figure out a more elegant solution
        props.setPlay(!props.play);
        window.$music_playing = !props.play;
    }
    
    return (
        <div className='fixed w-full h-[90px] flex justify-between items-center text-[#15274c]'>
            <div>
                
            </div>
            {/* desktop menu */} 
            <ul className='hidden lg:flex justify-items-center items-center px:5 py:5'>
                <li>
                    {window.$CONDUCTOR && props.play && (
                        <FiPause size={40} onClick={playPause} className='hover:bg-[#d31a83] hover:border-[#d31a83] w-[40px]'/>
                    )}
                   {window.$CONDUCTOR && !props.play && (
                        <FiPlay size={40} onClick={playPause} className='hover:bg-[#d31a83] hover:border-[#d31a83] w-[40px]'/>
                    )}
                </li>
                <li>
                    <Link className='hover:bg-[#d31a83] hover:border-[#d31a83] text-white border-2 px-4 py-2 mx-1 rounded-sm' to="/">
                        Stage
                    </Link>
                </li>
                <li>
                    <Link className='hover:bg-[#d31a83] hover:border-[#d31a83] text-white border-2 px-4 py-2 mx-1 rounded-sm' to="/mixer">
                        Mixer
                    </Link>
                </li>
                <li>
                    <Link className='hover:bg-[#d31a83] hover:border-[#d31a83] text-white border-2 px-4 py-2 mx-1 rounded-sm' to="/mint">
                        Mint
                    </Link>
                </li>
                <li>
                    <Link className='hover:bg-[#d31a83] hover:border-[#d31a83] text-white border-2 px-4 py-2 mx-1 rounded-sm' to="/swap">
                        Swap
                    </Link>
                </li>
                <li>
                    <Link className='hover:bg-[#d31a83] hover:border-[#d31a83] text-white border-2 px-4 py-2 mx-1 rounded-sm' to="/about">
                        About
                    </Link>
                </li>
            </ul>
            <div className='hidden lg:flex mr-10'>
                <ConnectButton showBalance={false}/>
            </div>
            {/* hamburger */}
            <div onClick={handleClick} className='lg:hidden z-10 mr-10'>
                {!nav ? <FaBars /> : <FaTimes />}
                
            </div>
            {/* mobile menu */}
            <ul className={!nav ? 'hidden' : 'absolute top-0 left-0 w-full h-screen bg-[#d31a83] text-white flex flex-col justify-center items-center' }>
                <li  className='py-6 text-4xl'>
                     <Link onClick={handleClick} to="top" to='/'>
                        Stage
                    </Link>
                </li>
                <li className='py-6 text-4xl'>
                     <Link onClick={handleClick} to="me" to='/mixer'>
                        Mixer
                    </Link>
                </li>
                <li className='py-6 text-4xl'>
                     <Link onClick={handleClick} to="me" to='/mint'>
                        Mint
                    </Link>
                </li>
                <li className='py-6 text-4xl'>
                     <Link onClick={handleClick} to="coding" to='/swap'>
                        Swap
                    </Link>
                </li>
                <li className='py-6 text-4xl'>
                     <Link onClick={handleClick} to="tv-video" to='/about'>
                        About
                    </Link>
                </li>
                <li>
                <ConnectButton showBalance={false}/>
                </li>

            </ul>
            {/* social */}
            <div className='hidden'></div>
        </div>
    )
}

export default Navbar