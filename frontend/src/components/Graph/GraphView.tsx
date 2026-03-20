import React, { useEffect, useRef, useCallback } from 'react';
import cytoscape, { CoreDefinition } from 'cytoscape';

interface Node {
  id: string;
  title: string;
  created_at: string;
}

interface GraphViewProps {
  nodes: Node[];
  onNodeClick: (nodeId: string) => void;
}

const GraphView: React.FC<GraphViewProps> = ({ nodes, onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<ReturnType<typeof cytoscape> | null>(null);

  useEffect(() => {
    if (!containerRef.current || nodes.length === 0) return;

    // 初始化 Cytoscape
    const cy = cytoscape({
      container: containerRef.current,
      elements: nodes.map((node, index) => ({
        data: {
          id: node.id,
          label: node.title,
        },
        position: {
          x: 400 + Math.cos((index / nodes.length) * 2 * Math.PI) * 200,
          y: 300 + Math.sin((index / nodes.length) * 2 * Math.PI) * 200,
        },
      })),
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'background-color': '#1890ff',
            'width': 60,
            'height': 60,
            'color': '#333',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'font-size': 12,
            'text-max-width': 80,
            'text-wrap': 'wrap',
          },
        },
        {
          selector: 'node:hover',
          style: {
            'background-color': '#4096ff',
            'border-width': 3,
            'border-color': '#096dd9',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#d9d9d9',
            'target-arrow-color': '#d9d9d9',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
      ],
      layout: {
        name: 'circle',
        radius: 300,
      },
      minZoom: 0.5,
      maxZoom: 3,
      wheelSensitivity: 0.3,
    });

    // 节点点击事件
    cy.on('tap', 'node', (event) => {
      const nodeId = event.target.id();
      onNodeClick(nodeId);
    });

    // 双击放大
    cy.on('dblclick', 'node', (event) => {
      const node = event.target;
      cy.animate({
        fit: {
          eles: node,
          padding: 100,
        },
        duration: 500,
      });
    });

    cyRef.current = cy;

    // 自适应大小
    const handleResize = () => {
      if (containerRef.current && cyRef.current) {
        cyRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [nodes, onNodeClick]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: 8,
      }}
    />
  );
};

export default GraphView;
