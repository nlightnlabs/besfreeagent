import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Connector = (props) => {

  const node1StartingCoordinates = props.startingCoordinates || {x1: 50, y1:100}
  const node2StartingCoordinates = props.startingCoordinates || {x1: 50, y1:100}
  const fillColor = props.fillColor || "black"

  const title = props.label || "Process Step" 
  const titleColor = props.titleColor || "black"

  

  const [node1Position, setNode1Position] = useState({ x: node1StartingCoordinates.x, y: node1StartingCoordinates.y });
  const [node2Position, setNode2Position] = useState({ x: node2StartingCoordinates.x, y: node2StartingCoordinates.y });

  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const nodeStyle={
    height: 10,
    width: 10,
    position: 'absolute',
    top: `${position.y}px`,
    left: `${position.x}px`,
    cursor: dragging ? 'grabbing' : 'grab',
    fillColor: fillColor
  }

  const titleStyle = {
    fontSize: 14,
    fontWeight: "bold",
    color: titleColor
  }

  const lineStyle={
    stroke: "gray"
  }


  return (
    <div>

   
        <div
            className="d-flex rounded-circle"
            style={nodeStyle}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
        </div>
        <svg width="848" height="770" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" overflow="hidden"><g transform="translate(-1544 -852)"><g><path d="M1569.5 875.063 1970.75 875.063 1970.75 1597.27 1967.31 1593.83 2365.12 1593.83 2365.12 1600.7 1963.87 1600.7 1963.87 878.5 1967.31 881.938 1569.5 881.938ZM1569.5 901.417 1546.58 878.5 1569.5 855.583 1592.42 878.5ZM2365.12 1574.35 2388.03 1597.27 2365.12 1620.18 2342.2 1597.27Z" fill="#BFBFBF" fill-rule="nonzero" fill-opacity="1"/></g></g></svg>
        <div
            className="d-flex rounded-circle"
            style={nodeStyle}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        ></div>
        
    </div>
  );
};

export default Connector;
