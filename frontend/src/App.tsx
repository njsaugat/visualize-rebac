import { useCallback, useEffect, useRef, useState } from "react";
import ForceGraph2D, { ForceGraphMethods, NodeObject } from "react-force-graph-2d";
import useDimension from "./useDimension";

interface Dimensions {
  width: number;
  height: number;
}

interface Node {
  id: string;
  group: 'store' | 'type' | 'relations';
  color: string;
  x?: number;
  y?: number;
}

interface Link {
  source: string;
  target: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface ApiResponse {
  nodes: Omit<Node, 'color'>[];
  links: Link[];
}

const COLOR_SCHEME: Record<Node['group'], string> = {
  store: "#6B6054",    // Brown
  type: "#9D8EC7",     // Purple
  relations: "#4CAF50" // Green
};

const NetworkGraph: React.FC = () => {
  const BASE_URL = "http://127.0.0.1:8000";
  const fgRef = useRef<ForceGraphMethods<NodeObject<Node>>>();
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const dimensions: Dimensions = useDimension();

  const handleNodeClick = useCallback((node: Node) => {
    if (fgRef.current && node.x && node.y) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(2.5, 1000);
    }
  }, []);

  const transformNodes = (nodes: ApiResponse['nodes']): Node[] => {
    return nodes.map((node) => ({
      ...node,
      color: COLOR_SCHEME[node.group]
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/permission-graph`);
        const data: ApiResponse = await response.json();
        
        const transformedData: GraphData = {
          nodes: transformNodes(data.nodes),
          links: data.links
        };
        
        setGraphData(transformedData);
      } catch (error) {
        console.error('Error fetching graph data:', error);
      }
    };

    fetchData();
  }, []);

  const renderNode = useCallback((node: Node, ctx: CanvasRenderingContext2D) => {
    let label = node.id;
    if (label.includes("_organization")) {
      label = label.split("_organization")[0];
    }

    const fontSize = 3;
    ctx.font = `${fontSize}px Ubuntu`;

    // Draw node
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, 5, 0, 2 * Math.PI, false);
    ctx.fill();

    // Draw label
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#f0f0f0";
    ctx.fillText(label, node.x || 0, (node.y || 0) + 10);
  }, []);

  if (!graphData) {
    return null;
  }

  return (
    <div className="w-full h-screen bg-black">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="id"
        nodeColor={(node: Node) => node.color}
        nodeRelSize={10}
        linkColor={() => "#666"}
        backgroundColor="#000"
        width={dimensions.width}
        height={dimensions.height}
        onNodeClick={handleNodeClick}
        nodeCanvasObject={renderNode}
      />
    </div>
  );
};

export default NetworkGraph;