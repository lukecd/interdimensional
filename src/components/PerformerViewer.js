import React, { useState, useEffect } from "react";

import {
  useContractRead,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import chroma from "chroma-js";
import contractABI from '../abi/MosEisleyCantina.json';

/**
 * 
 * @returns A responsive viewer showing a Performer NFT
 */
const PerformerViewer = (props) => {

  let [svg, setSVG] = useState([]);

  const { data: curNFT } = useContractRead({
    addressOrName: window.$CONTRACT_ADDRESS,
    contractInterface: contractABI,
    functionName: "getTokenURI",
    watch: false,
    args: 3
  });

  useEffect(() => {
console.log("window.$CONTRACT_ADDRESS ", window.$CONTRACT_ADDRESS)
    if (curNFT) {
      console.log("curNFT ", curNFT);
      setSVG(curNFT);
    }
  }, []);

  return (
    <div>
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuZGV2L3N2Z2pzIiB2aWV3Qm94PSIwIDAgODAwIDgwMCI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgc3R5bGU9ImZpbGw6IzsiLz48cmVjdCB4PSIxMCUiIHk9Ijg1JSIgd2lkdGg9IjgwJSIgaGVpZ2h0PSIxMCUiIHN0eWxlPSJmaWxsOiMjYmMwMGE5OyIvPjx0ZXh0IHN0eWxlPSJmaWxsOiAjRkM3MjA4OyBmb250LWZhbWlseTogJnF1b3Q7QXJpYWwgQmxhY2smcXVvdDs7IGZvbnQtc2l6ZTogM2VtOyB3aGl0ZS1zcGFjZTogcHJlOyIgeD0iMTUlIiB5PSI5MiUiPkRlZXAgQ2FueW9uIERyZWFtczwvdGV4dD48bWV0YWRhdGE+PHBlcmZvcm1lclR5cGU+cGFkPC9wZXJmb3JtZXJUeXBlPjxwZXJmb3JtZXJJbnN0cnVtZW50PnBhZC1jYW55b248L3BlcmZvcm1lckluc3RydW1lbnQ+PHBlcmZvcm1lckRhdGE+N3wxNjwvcGVyZm9ybWVyRGF0YT48L21ldGFkYXRhPjwvc3ZnPg==" />
    </div>
  )
}

export default PerformerViewer