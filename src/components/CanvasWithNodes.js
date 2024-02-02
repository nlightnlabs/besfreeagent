import React, { useState, useEffect, useRef } from 'react';

const Node = (props) => {

  const id = props.id
  const x=props.x
  const y=props.y
  const width=props.width
  const height=props.height
  const onDrag=props.onDrag 
  const isSelected=props.isSelected
  const onSelect=props.onSelect 
  
  const nodeRef = useRef();

  useEffect(() => {
    // Update the position of the connectors whenever the node position changes
    if (nodeRef.current) {
      const nodeRect = nodeRef.current.getBoundingClientRect();
      const centerX = nodeRect.x + nodeRect.width / 2;
      const centerY = nodeRect.y + nodeRect.height / 2;

      // Example: Update connector positions based on node's edges (top, right, bottom, left)
      const connectorPositions = {
        top: { x: centerX, y: nodeRect.y },
        right: { x: nodeRect.x + nodeRect.width, y: centerY },
        bottom: { x: centerX, y: nodeRect.y + nodeRect.height },
        left: { x: nodeRect.x, y: centerY },
      };

      // You can pass the connector positions to a state variable or handle them as needed
      // For demonstration, logging the connector positions to console
      console.log(`Node ${id} Connector Positions:`, connectorPositions);
    }
  }, [x, y, width, height, id]);

  return (
    <div
      ref={nodeRef}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
        border: isSelected ? '2px solid red' : '1px solid black',
        backgroundColor: isSelected ? 'lightblue' : 'white',
        cursor: 'move',
      }}
      onClick={onSelect}
      onMouseDown={onDrag}
    >
      Node {id}
    </div>
  );
};

const CanvasWithNodes = () => {
  const [nodes, setNodes] = useState([
    { id: 1, x: 50, y: 50, width: 100, height: 50, isSelected: false },
    { id: 2, x: 200, y: 100, width: 120, height: 70, isSelected: false },
    // Add more nodes as needed
  ]);

  const handleNodeDrag = (id, e) => {
    // Logic for dragging nodes
  };

  const handleNodeSelect = (id) => {
    // Logic for selecting nodes
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {nodes.map((node) => (
        <Node
          key={node.id}
          id={node.id}
          x={node.x}
          y={node.y}
          width={node.width}
          height={node.height}
          onDrag={(e) => handleNodeDrag(node.id, e)}
          isSelected={node.isSelected}
          onSelect={() => handleNodeSelect(node.id)}
        />
      ))}
      {/* Additional logic to draw connector lines */}
      {/* This logic should calculate and draw lines between nodes */}
      {/* Lines should snap to the edges of nodes based on their connector positions */}
    </div>
  );
};

export default CanvasWithNodes;
