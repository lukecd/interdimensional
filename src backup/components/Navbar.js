import '../index.css';

import { Link, useHistory } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';


import React, { useState } from 'react';
import {FaBars, FaTimes} from 'react-icons/fa';


/**
 * @returns Top navigation bar
 */
const Navbar = () => {
    const [nav, setNav] = useState(false);
    const handleClick = () => setNav(!nav);

    return (
        <div className='fixed w-full h-[90px] flex justify-between items-center text-[#15274c] z-10 bg-black'>
            <div>
                
            </div>
            {/* desktop menu */} 
            <ul className='hidden lg:flex px:5 py:5'>
                <li>
                    <Link className='hover:bg-[#d31a83] hover:border-[#d31a83] text-white border-2 px-4 py-2 mx-1 rounded-sm' to="/">
                        Play
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
                     <Link onClick={handleClick} to="top" to='/play'>
                        Play
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