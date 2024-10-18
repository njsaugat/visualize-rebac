import  { useCallback, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import graphData from './graphData';

const NetworkGraph = () => {
  const fgRef = useRef();

  const handleNodeClick = useCallback(node => {
    // Aim at node from outside it
    const distance = 40;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(2.5, 1000);
    }
  }, []);

  return (
    <div className="w-full h-screen bg-black">
      <div className="absolute bottom-4 left-4 text-gray-400 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#6B6054] rounded-sm"></div>
          <span>STORE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#9D8EC7] rounded-sm"></div>
          <span>TYPE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#4CAF50] rounded-sm"></div>
          <span>RELATIONS</span>
        </div>
      </div>
      
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="id"
        nodeColor={node => node.color}
        nodeRelSize={8}
        linkColor={() => "#666"}
        backgroundColor="#000"
        width={800}
        height={600}
        onNodeClick={handleNodeClick}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 4;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
          ctx.fill();

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#f0f0f0';
          ctx.fillText(label, node.x, node.y + 12);
        }}
      />
    </div>
  );
};

export default NetworkGraph;