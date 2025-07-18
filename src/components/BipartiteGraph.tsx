import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { NodeGroup, EdgeWeight } from '../pages/Index';

interface BipartiteGraphProps {
  groupA: NodeGroup;
  groupB: NodeGroup;
  edges: EdgeWeight[];
  rotation: number;
}

interface Node {
  id: string;
  group: 'A' | 'B';
  index: number;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

interface Link {
  source: Node;
  target: Node;
  weight: number;
  evidence: string;
}

export const BipartiteGraph: React.FC<BipartiteGraphProps> = ({
  groupA,
  groupB,
  edges,
  rotation,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 500;
    const margin = 50;

    // Create nodes
    const nodesA: Node[] = Array.from({ length: groupA.count }, (_, i) => ({
      id: `${groupA.name}-${i + 1}`,
      group: 'A',
      index: i,
    }));

    const nodesB: Node[] = Array.from({ length: groupB.count }, (_, i) => ({
      id: `${groupB.name}-${i + 1}`,
      group: 'B',
      index: i,
    }));

    const nodes = [...nodesA, ...nodesB];

    // Create links
    const links: Link[] = edges.map(edge => ({
      source: nodesA[edge.from],
      target: nodesB[edge.to],
      weight: edge.weight,
      evidence: edge.evidence,
    }));

    // Position nodes in bipartite layout
    const groupAX = width * 0.25;
    const groupBX = width * 0.75;

    nodesA.forEach((node, i) => {
      node.x = groupAX;
      node.y = (height / (groupA.count + 1)) * (i + 1);
      node.fx = groupAX; // Fixed x position
    });

    nodesB.forEach((node, i) => {
      node.x = groupBX;
      node.y = (height / (groupB.count + 1)) * (i + 1);
      node.fx = groupBX; // Fixed x position
    });

    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).distance(200).strength(0.1))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('y', d3.forceY((d: Node) => d.y || height / 2).strength(0.1));

    // Create main group for rotation
    const mainGroup = svg.append('g')
      .attr('class', 'main-group')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        mainGroup.attr('transform', 
          `translate(${width / 2}, ${height / 2}) scale(${event.transform.k}) translate(${event.transform.x}, ${event.transform.y})`
        );
      });

    svg.call(zoom);

    // Create links
    const link = mainGroup.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke-width', (d: Link) => Math.sqrt(d.weight) * 2)
      .attr('stroke', (d: Link) => {
        switch (d.evidence) {
          case 'Strong': return '#10b981';
          case 'Moderate': return '#f59e0b';
          case 'Weak': return '#ef4444';
          case 'Preliminary': return '#6b7280';
          default: return '#6b7280';
        }
      })
      .attr('opacity', 0.7);

    // Create nodes
    const node = mainGroup.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = d.group === 'A' ? groupAX - width / 2 : groupBX - width / 2;
          d.fy = null;
        }));

    // Add circles to nodes
    node.append('circle')
      .attr('r', 20)
      .attr('fill', (d: Node) => d.group === 'A' ? groupA.color : groupB.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add labels to nodes
    const labels = node.append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text((d: Node) => d.id.split('-')[1]);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: Link) => (d.source.x || 0) - width / 2)
        .attr('y1', (d: Link) => (d.source.y || 0) - height / 2)
        .attr('x2', (d: Link) => (d.target.x || 0) - width / 2)
        .attr('y2', (d: Link) => (d.target.y || 0) - height / 2);

      node
        .attr('transform', (d: Node) => 
          `translate(${(d.x || 0) - width / 2}, ${(d.y || 0) - height / 2})`
        );
    });

    // Apply rotation
    mainGroup.transition()
      .duration(300)
      .attr('transform', 
        `translate(${width / 2}, ${height / 2}) rotate(${rotation})`
      );

    // Keep labels upright during rotation
    labels.transition()
      .duration(300)
      .attr('transform', `rotate(${-rotation})`);

    return () => {
      simulation.stop();
    };
  }, [groupA, groupB, edges, rotation]);

  return (
    <div className="w-full h-full">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 800 500"
        className="border rounded-lg bg-white"
      />
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-green-500"></div>
          <span>Strong</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-yellow-500"></div>
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-red-500"></div>
          <span>Weak</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-gray-500"></div>
          <span>Preliminary</span>
        </div>
      </div>
    </div>
  );
};
