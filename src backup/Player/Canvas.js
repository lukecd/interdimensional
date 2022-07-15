import React from "react";
import PropTypes from "prop-types";
import draw from "./Player.js";
import Matter from 'matter-js'

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
      
      engine = Matter.Engine.create({});
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
