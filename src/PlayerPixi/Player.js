import React from 'react'
import { Stage, Container, Sprite } from '@inlet/react-pixi'

const Player = () => {
    const bgColor = '#12082D';
    const colors = ['#8F0380', '#EC205B', '#FC7208', '#D00204', '#7701AD'];

    const count = 5;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const stageProps = {
      height,
      width,
      options: {
        backgroundAlpha: 0,
        antialias: true,
      },
    }
    return (
      <Stage {...stageProps}>
        {for(let i=0; i<5; i++ => (
          <Sprite
            key={i}
            image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/coin.png"
            scale={(360 / count) * 0.004}
            anchor={0.5}
            rotation={i * (360 / count) * (Math.PI / 180)}
            x={width / 2 + Math.cos(i * (360 / count) * (Math.PI / 180)) * 100}
            y={height / 2 + Math.sin(i * (360 / count) * (Math.PI / 180)) * 100}
          />
        ))}
      </Stage>
    )
}

export default Player