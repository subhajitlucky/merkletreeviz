import React from 'react';
import { motion } from 'framer-motion';
import { type Node } from '../lib/merkle';
import { clsx } from 'clsx';
import { ShieldCheck, Database, Cpu } from 'lucide-react';

interface TreeVisualizerProps {
  levels: Node[][];
  highlightedIds?: Set<string>;
  tamperedLeafIndex?: number | null;
  onNodeClick?: (node: Node) => void;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ 
  levels, 
  highlightedIds = new Set(), 
  tamperedLeafIndex = null,
  onNodeClick
}) => {
  if (levels.length === 0) return null;

  const maxNodes = levels[0].length;
  const horizontalSpacing = 160;
  const verticalSpacing = 120;
  
  const width = Math.max(900, maxNodes * horizontalSpacing);
  const height = (levels.length * verticalSpacing) + 80;

  return (
    <div className="relative w-full overflow-auto p-4 sm:p-6 bg-card border border-card-border rounded-3xl shadow-xl min-h-[600px] flex justify-center custom-scrollbar refinery-grid">
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 -60 ${width} ${height}`}
        className="overflow-visible relative z-10"
      >
        <defs>
          <filter id="wireGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. CIRCUIT WIRES (Connections) */}
        {levels.map((level, lIndex) => {
          if (lIndex === levels.length - 1) return null;
          return level.map((node, nIndex) => {
            if (!node.parentId) return null;
            const parentLevel = levels[lIndex + 1];
            const parentIndex = Math.floor(nIndex / 2);
            
            const x1 = (nIndex + 0.5) * (width / level.length);
            const y1 = height - (lIndex + 1) * verticalSpacing;
            const x2 = (parentIndex + 0.5) * (width / parentLevel.length);
            const y2 = height - (lIndex + 2) * verticalSpacing;

            const isPathActive = highlightedIds.has(node.id) && highlightedIds.has(parentLevel[parentIndex].id);
            const isCorrupted = node.isLeaf && tamperedLeafIndex === nIndex;

            return (
              <g key={`wire-${node.id}`}>
                <path
                  d={`M ${x1} ${y1} L ${x2} ${y2}`}
                  fill="none"
                  className="stroke-muted/40"
                  strokeWidth="2"
                />
                
                <motion.path
                  d={`M ${x1} ${y1} L ${x2} ${y2}`}
                  fill="none"
                  stroke={isCorrupted ? "#ef4444" : isPathActive ? "var(--primary)" : "transparent"}
                  strokeWidth={isPathActive ? 4 : 2}
                  strokeDasharray="12, 18"
                  animate={{ strokeDashoffset: [0, -30] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  filter={isPathActive ? "url(#wireGlow)" : ""}
                />

                {isPathActive && (
                  <motion.circle
                    r="5"
                    fill="var(--primary)"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    style={{ offsetPath: `path('M ${x1} ${y1} L ${x2} ${y2}')` }}
                  />
                )}
              </g>
            );
          });
        })}

        {/* 2. NODES */}
        {levels.map((level, lIndex) => (
          level.map((node, nIndex) => {
            const x = (nIndex + 0.5) * (width / level.length);
            const y = height - (lIndex + 1) * verticalSpacing;
            const isHighlighted = highlightedIds.has(node.id);
            const isTampered = node.isLeaf && tamperedLeafIndex === nIndex;
            const isRoot = lIndex === levels.length - 1;

            return (
              <motion.g 
                key={node.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => onNodeClick?.(node)}
                className="cursor-pointer group"
              >
                <motion.rect
                  x={x - 55} y={y - 25} width={110} height={50} rx={14}
                  animate={{ 
                    stroke: isTampered ? '#ef4444' : isHighlighted ? 'var(--primary)' : 'var(--card-border)',
                    fill: isHighlighted ? 'var(--primary)' : 'var(--card)',
                    strokeWidth: isHighlighted || isTampered ? 3 : 2
                  }}
                  className="transition-colors duration-300 shadow-md"
                />

                <foreignObject x={x - 48} y={y - 18} width={24} height={24} className="pointer-events-none">
                  <div className="flex items-center justify-center h-full w-full">
                    {isRoot ? <ShieldCheck className={clsx("w-5 h-5", isHighlighted ? "text-white" : "text-primary")} /> :
                     lIndex === 0 ? <Database className={clsx("w-4 h-4", isHighlighted ? "text-white" : "text-muted")} /> :
                     <Cpu className={clsx("w-4 h-4", isHighlighted ? "text-white" : "text-muted/40")} />}
                  </div>
                </foreignObject>

                <text 
                  x={x + 10} y={y - 4}
                  textAnchor="middle"
                  className={clsx(
                    "text-[10px] font-mono font-bold tracking-tighter pointer-events-none",
                    isHighlighted ? "fill-white" : "fill-foreground"
                  )}
                >
                  {node.hash.substring(0, 8)}
                </text>

                <text 
                  x={x + 10} y={y + 12} 
                  textAnchor="middle"
                  className={clsx("text-[8px] font-black uppercase tracking-widest pointer-events-none", isHighlighted ? "fill-white/80" : "fill-muted")}
                >
                  {isRoot ? 'ROOT' : node.isLeaf ? `DATA: ${node.data?.substring(0, 10)}` : `LAYER ${lIndex}`}
                </text>

                {isTampered && (
                   <circle cx={x - 50} cy={y + 15} r={4} className="fill-red-500 animate-ping" />
                )}
              </motion.g>
            );
          })
        ))}
      </svg>
    </div>
  );
};

export default TreeVisualizer;