import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ConnectionLineType,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Schema } from '~/lib/types';

// Node type with additional data specific to schema classes
interface SchemaNode extends Node {
  data: {
    label: string;
    description?: string;
  };
}

// Edge type with additional data specific to schema relationships
interface SchemaEdge extends Edge {
  data?: {
    relationship: string;
  };
}

type SchemaGraphProps = {
  schema: Schema;
  className?: string;
};

export function SchemaGraph({ schema, className = '' }: SchemaGraphProps) {
  // Generate nodes and edges from schema
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: SchemaNode[] = [];
    const edges: SchemaEdge[] = [];
    const nodeMap = new Map<string, number>(); // Map class name to its node index
    let nodeCount = 0;

    // Create nodes for all classes
    Object.entries(schema.classes).forEach(([className, classData]) => {
      // Skip external classes (those that start with http://)
      if (className.startsWith('http://')) return;
      
      // Position nodes in a grid layout (can be improved with more sophisticated layouts)
      const position = {
        x: (nodeCount % 5) * 250,
        y: Math.floor(nodeCount / 5) * 150
      };
      
      nodes.push({
        id: className,
        type: 'default',
        position,
        data: { 
          label: classData.label || className,
          description: classData.comment
        }
      });
      
      nodeMap.set(className, nodeCount);
      nodeCount++;
    });

    // Create edges for subClassOf relationships
    Object.entries(schema.classes).forEach(([className, classData]) => {
      if (!nodeMap.has(className)) return; // Skip if node wasn't created
      
      classData.subClassOf.forEach(parent => {
        // Only create edges for internal schema classes
        if (!parent.startsWith('http://') && nodeMap.has(parent)) {
          edges.push({
            id: `${parent}-${className}`,
            source: parent, 
            target: className,
            type: 'smoothstep',
            animated: false,
            label: 'subClassOf',
            data: { relationship: 'subClassOf' },
            markerEnd: {
              type: 'arrowclosed',
            },
          });
        }
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [schema]);

  // Set up React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Edge connection handler
  const onConnect = useCallback(
    (connection: Connection) => setEdges(eds => addEdge({ 
      ...connection, 
      type: 'smoothstep',
      animated: true,
    }, eds)),
    [setEdges]
  );

  // ReactFlow fit view on load
  const onInit = useCallback(
    (reactFlowInstance: any) => reactFlowInstance.fitView({ padding: 0.2 }),
    []
  );

  return (
    <div className={`h-[600px] ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background />
        <Panel position="top-left">
          <div className="bg-background p-2 rounded shadow">
            <h3 className="text-lg font-medium">OER Schema Graph</h3>
            <p className="text-sm text-muted-foreground">
              Showing {nodes.length} classes and {edges.length} relationships
            </p>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}