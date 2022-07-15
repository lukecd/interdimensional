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
  let context = null;
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

      context = canvas.current.getContext("2d");

      draw(context, canvas, engine);
      Matter.Runner.run(engine);
  }, []);

  

  return <canvas ref={canvas} height={props.height} width={props.width} />;
};

Canvas.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

export default Canvas;
