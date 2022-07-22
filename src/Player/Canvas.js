import React from "react";
import PropTypes from "prop-types";
import draw from "./Player.js";
import Matter from 'matter-js';

/**
 * 
 * 
 * How to use Canvas in React https://medium.com/web-dev-survey-from-kyoto/how-to-use-html-canvas-with-react-hooks-web-dev-survey-from-kyoto-e633812023b1
 */
const Canvas = (props) => {
  const canvas = React.useRef();
  let ctx = null;
  let engine = null;

  React.useEffect(() => {
    console.log('created engine')
      engine = Matter.Engine.create({});
      //Matter.use('matter-attractors');

      engine.gravity.scale = 0.004;
      engine.gravity.x = 0.0;
      engine.gravity.y = 0.0;
      engine.frictionAir = 0;
      engine.frictionStatic = 0;
      engine.inertia = Infinity;
      engine.restitution = 1;

      ctx = canvas.current.getContext("2d");

      // const handleResize = e => {
      //   ctx.canvas.height = window.innerHeight;
      //   ctx.canvas.width = window.innerWidth;
      // };
  
      // handleResize();
      // window.addEventListener("resize", handleResize);
  
      // return () => window.removeEventListener("resize", handleResize);

      draw(ctx, canvas, engine);
      Matter.Runner.run(engine);
  }, []);
  

  return <canvas ref={canvas} height={props.height} width={props.width} />;
};



Canvas.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

export default Canvas;
