'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ZoomIn, ZoomOut, Maximize2, RefreshCw } from 'lucide-react';

// Dynamically load ForceGraph2D to prevent SSR window reference errors
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-400">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium">Initializing Graph Physics Engine...</p>
      </div>
    </div>
  ),
});

interface PathNode {
  id: number | string;
  name: string;
  headline?: string;
  avatarUrl?: string;
  isPathNode?: boolean;
  isSource?: boolean;
  isTarget?: boolean;
  degree?: number;
  x?: number;
  y?: number;
}

interface PathLink {
  source: number | string | any;
  target: number | string | any;
  relType?: string;
  strength?: number;
  isPathLink?: boolean;
}

interface PathGraphProps {
  nodes: PathNode[];
  links: PathLink[];
  pathNodeIds?: number[];
  onNodeClick?: (node: PathNode) => void;
  height?: number | string;
}

export default function PathGraph({
  nodes,
  links,
  pathNodeIds = [],
  onNodeClick,
  height = 550,
}: PathGraphProps) {
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 550 });
  const containerRef = useRef<HTMLDivElement>(null);

  const pathSet = new Set(pathNodeIds.map(Number));

  useEffect(() => {
    function updateDimensions() {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || 800,
          height: containerRef.current.clientHeight || (typeof height === 'number' ? height : 550),
        });
      }
    }
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [height]);

  // Format graph data
  const graphData = {
    nodes: nodes.map((n) => {
      const numId = Number(n.id);
      const isPath = pathSet.has(numId);
      const isSource = pathNodeIds.length > 0 && numId === Number(pathNodeIds[0]);
      const isTarget =
        pathNodeIds.length > 1 && numId === Number(pathNodeIds[pathNodeIds.length - 1]);

      return {
        ...n,
        id: numId,
        isPathNode: isPath,
        isSource,
        isTarget,
      };
    }),
    links: links.map((l) => {
      const sId = typeof l.source === 'object' ? Number(l.source.id) : Number(l.source);
      const tId = typeof l.target === 'object' ? Number(l.target.id) : Number(l.target);

      // Check if this link is along the shortest path
      let isPathLink = false;
      for (let i = 0; i < pathNodeIds.length - 1; i++) {
        const u1 = Number(pathNodeIds[i]);
        const u2 = Number(pathNodeIds[i + 1]);
        if ((sId === u1 && tId === u2) || (sId === u2 && tId === u1)) {
          isPathLink = true;
          break;
        }
      }

      return {
        ...l,
        source: sId,
        target: tId,
        isPathLink,
      };
    }),
  };

  const handleZoomIn = () => {
    if (fgRef.current) {
      fgRef.current.zoom(fgRef.current.zoom() * 1.3, 400);
    }
  };

  const handleZoomOut = () => {
    if (fgRef.current) {
      fgRef.current.zoom(fgRef.current.zoom() / 1.3, 400);
    }
  };

  const handleCenter = () => {
    if (fgRef.current) {
      fgRef.current.zoomToFit(400, 50);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950 shadow-2xl"
      style={{ height }}
    >
      {/* Zoom / View controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-1 shadow-lg">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleCenter}
          title="Recenter & Fit"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Legend Badge */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl px-3.5 py-2 text-xs flex items-center gap-4 text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30" />
          <span>Source</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-400/30" />
          <span>Path Step</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 ring-2 ring-purple-400/30" />
          <span>Target</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
          <span>Network Node</span>
        </div>
      </div>

      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        backgroundColor="#020617"
        nodeRelSize={6}
        nodeLabel={(node: any) => `${node.name || 'User'} • ${node.headline || ''}`}
        linkWidth={(link: any) => (link.isPathLink ? 3.5 : 1.2)}
        linkColor={(link: any) =>
          link.isPathLink ? '#38bdf8' : 'rgba(100, 116, 139, 0.25)'
        }
        linkDirectionalParticles={(link: any) => (link.isPathLink ? 4 : 0)}
        linkDirectionalParticleSpeed={(link: any) => (link.isPathLink ? 0.008 : 0)}
        linkDirectionalParticleWidth={(link: any) => (link.isPathLink ? 3.5 : 0)}
        linkDirectionalParticleColor={() => '#38bdf8'}
        onNodeClick={(node: any) => onNodeClick && onNodeClick(node)}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const isSource = node.isSource;
          const isTarget = node.isTarget;
          const isPathNode = node.isPathNode;
          const label = node.name || `User ${node.id}`;
          const fontSize = Math.max(11 / globalScale, 3.5);
          const r = isSource || isTarget ? 8 : isPathNode ? 6.5 : 4.5;

          // Outer glowing ring for path nodes
          if (isPathNode) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, r + 3, 0, 2 * Math.PI, false);
            ctx.fillStyle = isSource
              ? 'rgba(52, 211, 153, 0.35)'
              : isTarget
              ? 'rgba(192, 132, 252, 0.35)'
              : 'rgba(56, 189, 248, 0.35)';
            ctx.fill();
          }

          // Main node circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
          ctx.fillStyle = isSource
            ? '#10b981'
            : isTarget
            ? '#a855f7'
            : isPathNode
            ? '#0ea5e9'
            : '#475569';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = isPathNode ? 1.5 : 0.8;
          ctx.stroke();

          // Label
          if (globalScale > 0.8 || isPathNode) {
            ctx.font = `${isPathNode ? 'bold ' : ''}${fontSize}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = isPathNode ? '#f8fafc' : '#94a3b8';
            ctx.fillText(label, node.x, node.y + r + fontSize + 1);
          }
        }}
        cooldownTicks={100}
        onEngineStop={() => {
          if (fgRef.current) {
            fgRef.current.zoomToFit(400, 60);
          }
        }}
      />
    </div>
  );
}
