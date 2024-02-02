import React, { useState } from 'react';
import Draggable from 'react-draggable';
import 'bootstrap/dist/css/bootstrap.min.css';

const FloatingDiv = ({className, style, contents, startLeft, startTop}) => {

  // const [position, setPosition] = useState({ x: startLeft.x, y: startTop.y });
  // const [dragging, setDragging] = useState(false);
  // const [offset, setOffset] = useState({ x: 0, y: 0 });

  // const handleMouseDown = (e) => {
  //   setDragging(true);
  //   setOffset({
  //     x: e.clientX - position.x,
  //     y: e.clientY - position.y,
  //   });
  // };

  // const handleMouseMove = (e) => {
  //   if (dragging) {
  //     setPosition({
  //       x: e.clientX - offset.x,
  //       y: e.clientY - offset.y,
  //     });
  //   }
  // };

  // const handleMouseUp = () => {
  //   setDragging(false);
  // };

  return (
    <Draggable>
        <div
            className={className}
            style={style}
            // onMouseDown={handleMouseDown}
            // onMouseMove={handleMouseMove}
            // onMouseUp={handleMouseUp}
        >
        {contents}
        </div>
    </Draggable>
  );
};

export default FloatingDiv;
