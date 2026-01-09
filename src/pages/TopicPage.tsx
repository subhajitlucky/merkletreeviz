import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Hash, Database, GitMerge, ShieldCheck, Zap, GitBranch, BarChart3, Globe, AlertTriangle, CheckCircle, Plus, Minus, XCircle, type LucideIcon } from 'lucide-react';
import { useRef, useState, useEffect, type FC } from 'react';
import { sha256 } from '../lib/merkle';

// --- Visualizers ---

const TamperSimulation = () => {
  const [data] = useState("Hello World");
  const [tampered, setTampered] = useState("Hello World");
  const [hash1, setHash1] = useState("");
  const [hash2, setHash2] = useState("");

  useEffect(() => { sha256(data).then(setHash1); }, [data]);
  useEffect(() => { sha256(tampered).then(setHash2); }, [tampered]);

  const isMatch = hash1 === hash2;

  return (
    <div className="flex flex-col space-y-6 w-full max-w-sm">
      <div className="space-y-2">
        <label className="text-xs font-mono text-primary uppercase">Original Data</label>
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 text-sm font-mono">{data}</div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-mono text-accent uppercase flex justify-between">
          <span>Received Data</span>
          <span className="text-[10px] text-muted">(Try editing this!)</span>
        </label>
        <input 
          value={tampered}
          onChange={(e) => setTampered(e.target.value)}
          className={`w-full p-3 rounded-lg border-2 bg-transparent outline-none transition-all font-mono text-sm ${isMatch ? 'border-green-500/50 focus:border-green-500' : 'border-red-500/50 focus:border-red-500'}`}
        />
      </div>
      
      <div className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all duration-500 ${isMatch ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
        <div className="text-xs font-mono">
          <div className="opacity-50 uppercase mb-1">Integrity Status</div>
          <div className={`font-bold ${isMatch ? 'text-green-500' : 'text-red-500'}`}>
            {isMatch ? 'VERIFIED' : 'COMPROMISED'}
          </div>
        </div>
        {isMatch ? <CheckCircle className="w-8 h-8 text-green-500" /> : <AlertTriangle className="w-8 h-8 text-red-500" />}
      </div>
    </div>
  );
};

const AvalancheSimulation = () => {
  const [input, setInput] = useState("Merkle");
  const [bits, setBits] = useState<number[]>([]);
  const [diffPercent, setDiffPercent] = useState(0);
  const prevBitsRef = useRef<number[]>([]);

  useEffect(() => {
    sha256(input).then(h => {
      const hexSubset = h.substring(0, 16);
      const newBits: number[] = [];
      for (let i = 0; i < hexSubset.length; i++) {
        const val = parseInt(hexSubset[i], 16);
        newBits.push((val >> 3) & 1);
        newBits.push((val >> 2) & 1);
        newBits.push((val >> 1) & 1);
        newBits.push((val >> 0) & 1);
      }
      
      const prevBits = prevBitsRef.current;
      if (prevBits.length > 0) {
        let diffs = 0;
        newBits.forEach((b, i) => {
          if (b !== prevBits[i]) diffs++;
        });
        setDiffPercent(Math.round((diffs / newBits.length) * 100));
      }
      
      setBits(newBits); 
      prevBitsRef.current = newBits;
    });
  }, [input]);

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-sm">
      <div className="w-full space-y-3">
        <div className="relative">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-background border-2 border-primary rounded-xl p-4 font-mono text-center text-lg text-foreground shadow-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all"
          />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-md">
            Edit This Data
          </div>
        </div>
        <p className="text-center text-xs text-muted font-medium">
          See how the hash changes with every keystroke
        </p>
      </div>

      <div className="relative">
        <div className="grid grid-cols-8 gap-1 p-4 bg-card rounded-xl border border-muted/20 shadow-inner">
          {bits.map((bit, i) => {
            const isFlipped = prevBitsRef.current[i] !== undefined && prevBitsRef.current[i] !== bit;
            return (
              <motion.div
                key={`${i}-${bit}-${input}`}
                initial={{ scale: 0.5, opacity: 0.5, backgroundColor: isFlipped ? '#f59e0b' : (bit ? '#3b82f6' : '#e2e8f0') }}
                animate={{ scale: 1, opacity: 1, backgroundColor: bit ? '#3b82f6' : '#e2e8f0' }}
                transition={{ duration: 0.5, delay: i * 0.002 }}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-sm`}
              />
            );
          })}
        </div>
        {diffPercent > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={input}
            className="absolute -right-16 top-1/2 -translate-y-1/2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-lg shadow-lg"
          >
            {diffPercent}% FLIP
          </motion.div>
        )}
      </div>

      <div className="text-xs text-center text-muted max-w-[240px]">
        The "Avalanche Effect": <br/>
        <span className="text-primary font-bold">1 input bit change ≈ 50% output flip</span>
      </div>
    </div>
  );
};

const LeafConstruction = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative">
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="w-48 h-48 md:w-64 md:h-64 border border-dashed border-primary/10 rounded-full"
         />
       </div>
       
       <div className="z-10 flex flex-col items-center space-y-2">
         <motion.div 
           animate={{ y: [0, 20, 0] }}
           transition={{ duration: 3, repeat: Infinity }}
           className="bg-background border border-primary/20 p-4 rounded-xl shadow-lg w-32 md:w-40 text-center"
         >
           <Database className="w-6 h-6 mx-auto mb-2 text-primary" />
           <div className="text-xs font-mono">Data Block</div>
         </motion.div>

         <ArrowRight className="rotate-90 text-muted/50" />

         <div className="bg-primary text-primary-foreground p-3 rounded-lg font-bold text-xs shadow-xl shadow-primary/20 z-10">
           SHA-256
         </div>

         <ArrowRight className="rotate-90 text-muted/50" />

         <motion.div 
           animate={{ y: [0, -5, 0] }}
           transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
           className="bg-accent/10 border border-accent/50 p-4 rounded-xl shadow-lg w-32 md:w-40 text-center"
         >
           <Hash className="w-6 h-6 mx-auto mb-2 text-accent" />
           <div className="text-[10px] font-mono break-all text-accent">0x7f8a...</div>
         </motion.div>
       </div>
    </div>
  );
};

const InternalNodeVisualizer = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring' }}
        className="mb-8 p-4 bg-primary text-primary-foreground rounded-xl shadow-xl z-10"
      >
        <div className="text-[10px] font-mono font-bold">PARENT HASH</div>
        <div className="text-[8px] opacity-75">Hash(Left + Right)</div>
      </motion.div>

      <div className="relative w-full max-w-xs h-32">
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 320 160" preserveAspectRatio="xMidYMid meet">
          <motion.path 
             d="M 50 120 C 50 60, 160 120, 160 40" 
             fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/30"
             initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
          />
          <motion.path 
             d="M 270 120 C 270 60, 160 120, 160 40" 
             fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/30"
             initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
          />
        </svg>

        <motion.div 
          className="absolute bottom-0 left-0 p-3 bg-secondary border border-muted rounded-lg w-20 md:w-24 text-center text-[10px] font-mono"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
        >
          Left Hash
        </motion.div>
        
        <motion.div 
          className="absolute bottom-0 right-0 p-3 bg-secondary border border-muted rounded-lg w-20 md:w-24 text-center text-[10px] font-mono"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}
        >
          Right Hash
        </motion.div>
      </div>
    </div>
  );
};

const MerkleRootVisualizer = () => {
  const [tamperedIndex, setTamperedIndex] = useState<number | null>(null);

  const toggleTamper = (index: number) => {
    setTamperedIndex(tamperedIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-6">
      {/* Root */}
      <motion.div 
        animate={{ 
          backgroundColor: tamperedIndex !== null ? "#ef4444" : "var(--primary)",
          scale: tamperedIndex !== null ? 1.1 : 1
        }}
        className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl z-10 text-primary-foreground relative"
      >
        {tamperedIndex !== null ? <AlertTriangle className="w-8 h-8 text-white" /> : <ShieldCheck className="w-8 h-8 text-white" />}
        <div className="absolute -top-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">Merkle Root</div>
      </motion.div>

      {/* SVG Lines */}
      <div className="relative w-64 h-16 md:h-24">
         <svg className="absolute inset-0 w-full h-full overflow-visible">
            {/* Left Subtree to Root */}
            <line x1="64" y1="100%" x2="128" y2="0" stroke={tamperedIndex !== null && tamperedIndex < 2 ? "#ef4444" : "currentColor"} strokeWidth="2" className={tamperedIndex !== null && tamperedIndex < 2 ? "" : "text-muted/30"} />
            {/* Right Subtree to Root */}
            <line x1="192" y1="100%" x2="128" y2="0" stroke={tamperedIndex !== null && tamperedIndex >= 2 ? "#ef4444" : "currentColor"} strokeWidth="2" className={tamperedIndex !== null && tamperedIndex >= 2 ? "" : "text-muted/30"} />
         </svg>
      </div>

      {/* Intermediate Nodes */}
      <div className="flex justify-between w-64">
        {[0, 1].map(group => (
           <div key={group} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-colors ${
                  tamperedIndex !== null && Math.floor(tamperedIndex / 2) === group 
                    ? "border-red-500 bg-red-500/10 text-red-500" 
                    : "border-primary/30 bg-secondary text-muted"
                }`}>
                <Hash className="w-5 h-5" />
              </div>
              <div className="relative w-12 h-8 md:h-12">
                 <svg className="absolute inset-0 w-full h-full overflow-visible">
                    <line x1="0" y1="100%" x2="24" y2="0" stroke={tamperedIndex !== null && Math.floor(tamperedIndex / 2) === group && tamperedIndex % 2 === 0 ? "#ef4444" : "currentColor"} strokeWidth="2" className={tamperedIndex !== null && Math.floor(tamperedIndex / 2) === group && tamperedIndex % 2 === 0 ? "" : "text-muted/30"} />
                    <line x1="48" y1="100%" x2="24" y2="0" stroke={tamperedIndex !== null && Math.floor(tamperedIndex / 2) === group && tamperedIndex % 2 === 1 ? "#ef4444" : "currentColor"} strokeWidth="2" className={tamperedIndex !== null && Math.floor(tamperedIndex / 2) === group && tamperedIndex % 2 === 1 ? "" : "text-muted/30"} />
                 </svg>
              </div>
           </div>
        ))}
      </div>

      {/* Leaves */}
      <div className="flex justify-between w-80">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="flex flex-col items-center space-y-2">
             <motion.button
               onClick={() => toggleTamper(i)}
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               animate={{
                 backgroundColor: tamperedIndex === i ? "#ef4444" : "transparent",
                 borderColor: tamperedIndex === i ? "#ef4444" : "var(--primary)"
               }}
               className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-colors ${tamperedIndex === i ? "text-white" : "border-primary/30 text-primary hover:border-primary"}`}
             >
                <Database className="w-5 h-5" />
             </motion.button>
             <span className="text-[10px] font-mono text-muted uppercase">Data {i+1}</span>
          </div>
        ))}
      </div>

      <div className="text-xs text-center text-muted font-medium bg-secondary/50 px-4 py-2 rounded-full">
        {tamperedIndex !== null ? <span className="text-red-500 font-bold">Tamper Detected! Root has changed.</span> : "Click a data block to tamper with it"}
      </div>
    </div>
  );
};

const BinaryStructureVisualizer = () => {
  const [depth, setDepth] = useState(3);
  const [hoveredNode, setHoveredNode] = useState<{level: number, index: number} | null>(null);

  // Checks if a node is part of the active path (ancestor of hovered node)
  const isPathActive = (level: number, index: number) => {
    if (!hoveredNode) return false;
    if (level > hoveredNode.level) return false;
    // Calculate if 'index' at 'level' is an ancestor of 'hoveredNode.index' at 'hoveredNode.level'
    // Logic: index must match the upper bits of hoveredNode.index
    const shift = hoveredNode.level - level;
    return (hoveredNode.index >> shift) === index;
  };

  return (
    <div className="flex flex-col items-center w-full h-full max-w-sm py-4">
      {/* Controls Header */}
      <div className="flex items-center justify-between w-full bg-secondary/50 p-3 rounded-2xl border border-muted/20 z-30 mb-4 shadow-sm">
        <button 
          onClick={() => setDepth(Math.max(1, depth - 1))}
          disabled={depth <= 1}
          className="p-2 rounded-xl bg-background border border-muted/30 hover:border-primary transition-all disabled:opacity-20 active:scale-95"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Tree Depth</span>
          <span className="text-xl font-black text-primary">{depth}</span>
        </div>
        <button 
          onClick={() => setDepth(Math.min(4, depth + 1))}
          disabled={depth >= 4}
          className="p-2 rounded-xl bg-background border border-muted/30 hover:border-primary transition-all disabled:opacity-20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Main Visualization Area - Fully Responsive SVG */}
      <div className="relative w-full flex-grow min-h-[200px] flex items-center justify-center">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          
          {/* 1. Draw Connections First (Background) */}
          {Array.from({ length: depth - 1 }).map((_, level) => (
            Array.from({ length: Math.pow(2, level) }).map((__, i) => {
              // Calculate percentages for X and Y
              const y1 = (level / (depth - 1 || 1)) * 90 + 5;
              const x1 = ((i + 0.5) / Math.pow(2, level)) * 100;
              
              const y2 = ((level + 1) / (depth - 1 || 1)) * 90 + 5;
              const xLeft = ((i * 2 + 0.5) / Math.pow(2, level + 1)) * 100;
              const xRight = ((i * 2 + 1 + 0.5) / Math.pow(2, level + 1)) * 100;

              // Path Activity Logic
              const isLeftActive = isPathActive(level, i) && isPathActive(level + 1, i * 2);
              const isRightActive = isPathActive(level, i) && isPathActive(level + 1, i * 2 + 1);

              return (
                <g key={`lines-${level}-${i}`}>
                  {/* Left Child Connection Group */}
                  <g>
                    {/* Base Line */}
                    <motion.path 
                      d={`M ${x1} ${y1} C ${x1} ${y1 + (y2-y1)/2}, ${xLeft} ${y2 - (y2-y1)/2}, ${xLeft} ${y2}`}
                      fill="none"
                      strokeWidth={isLeftActive ? "2" : "1.5"}
                      initial={false}
                      animate={{ 
                        stroke: isLeftActive ? "var(--primary)" : "currentColor",
                        strokeOpacity: isLeftActive ? 1 : 0.3
                      }}
                      className={isLeftActive ? "" : "text-muted-foreground"}
                      vectorEffect="non-scaling-stroke"
                    />
                    {/* Electric Flow Overlay */}
                    <motion.path 
                      d={`M ${x1} ${y1} C ${x1} ${y1 + (y2-y1)/2}, ${xLeft} ${y2 - (y2-y1)/2}, ${xLeft} ${y2}`}
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="2"
                      strokeDasharray="2 4"
                      initial={{ strokeDashoffset: 0, opacity: 0 }}
                      animate={{ 
                        strokeDashoffset: [0, -24],
                        opacity: isLeftActive ? 0.8 : 0.1
                      }}
                      transition={{ 
                        strokeDashoffset: { duration: 1, repeat: Infinity, ease: "linear" },
                        opacity: { duration: 0.3 }
                      }}
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>

                  {/* Right Child Connection Group */}
                  <g>
                    {/* Base Line */}
                    <motion.path 
                      d={`M ${x1} ${y1} C ${x1} ${y1 + (y2-y1)/2}, ${xRight} ${y2 - (y2-y1)/2}, ${xRight} ${y2}`}
                      fill="none"
                      strokeWidth={isRightActive ? "2" : "1.5"}
                      initial={false}
                      animate={{ 
                        stroke: isRightActive ? "var(--primary)" : "currentColor",
                        strokeOpacity: isRightActive ? 1 : 0.3
                      }}
                      className={isRightActive ? "" : "text-muted-foreground"}
                      vectorEffect="non-scaling-stroke"
                    />
                    {/* Electric Flow Overlay */}
                    <motion.path 
                      d={`M ${x1} ${y1} C ${x1} ${y1 + (y2-y1)/2}, ${xRight} ${y2 - (y2-y1)/2}, ${xRight} ${y2}`}
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="2"
                      strokeDasharray="2 4"
                      initial={{ strokeDashoffset: 0, opacity: 0 }}
                      animate={{ 
                        strokeDashoffset: [0, -24],
                        opacity: isRightActive ? 0.8 : 0.1
                      }}
                      transition={{ 
                        strokeDashoffset: { duration: 1, repeat: Infinity, ease: "linear" },
                        opacity: { duration: 0.3 }
                      }}
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                </g>
              );
            })
          ))}

          {/* 2. Draw Nodes on Top */}
          {Array.from({ length: depth }).map((_, level) => (
            Array.from({ length: Math.pow(2, level) }).map((__, i) => {
              const cx = ((i + 0.5) / Math.pow(2, level)) * 100;
              const cy = (level / (depth - 1 || 1)) * 90 + 5;
              const isActive = isPathActive(level, i);

              // Responsive Radius logic
              const r = level === 0 ? 4 : level === 1 ? 3.5 : level === 2 ? 3 : 2.5;

              return (
                <motion.circle
                  key={`node-${level}-${i}`}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="var(--background)"
                  stroke="var(--primary)"
                  strokeWidth={isActive ? "2.5" : "1.5"}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1,
                    strokeOpacity: isActive ? 1 : 0.8
                  }}
                  whileHover={{ scale: 1.3, cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredNode({ level, index: i })}
                  onMouseLeave={() => setHoveredNode(null)}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })
          ))}

          {/* 3. Draw Active Node Indicators (Inner Dots) */}
          {Array.from({ length: depth }).map((_, level) => (
            Array.from({ length: Math.pow(2, level) }).map((__, i) => {
              const cx = ((i + 0.5) / Math.pow(2, level)) * 100;
              const cy = (level / (depth - 1 || 1)) * 90 + 5;
              const isActive = isPathActive(level, i);
              const r = (level === 0 ? 4 : level === 1 ? 3.5 : level === 2 ? 3 : 2.5) * 0.45;

              return (
                <motion.circle
                  key={`dot-${level}-${i}`}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="var(--primary)"
                  animate={{
                    opacity: isActive ? 1 : 0.6,
                    scale: isActive ? 1.2 : 1
                  }}
                  pointerEvents="none"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })
          ))}
        </svg>
      </div>

      {/* Stats Footer */}
      <div className="flex justify-between w-full mt-4 text-[10px] uppercase font-bold text-muted bg-secondary/30 p-2 rounded-lg">
        <div>Nodes: <span className="text-primary">{Math.pow(2, depth) - 1}</span></div>
        <div>Leaves: <span className="text-primary">{Math.pow(2, depth - 1)}</span></div>
        <div>Log(N): <span className="text-primary">{(depth - 1).toFixed(0)}</span></div>
      </div>
    </div>
  );
};

const EfficiencyVisualizer = () => {
  const [items, setItems] = useState(10);
  const maxItems = 1000000;
  
  const logValue = Math.ceil(Math.log2(items));
  const maxLog = Math.ceil(Math.log2(maxItems));
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    const newItems = Math.round(Math.pow(10, (val / 100) * 6));
    setItems(Math.max(1, newItems));
  };

  return (
    <div className="flex flex-col items-center w-full h-full max-w-xl py-6 space-y-10">
      {/* Narrative Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">The Power of Logarithms</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          See how Merkle Trees save bandwidth. Compare downloading the 
          <span className="text-red-500 font-bold"> entire history </span> 
          vs just the 
          <span className="text-green-500 font-bold"> tiny proof </span> 
          needed to verify one transaction.
        </p>
      </div>

      {/* Interactive Controls */}
      <div className="w-full bg-secondary/20 p-6 rounded-3xl border-2 border-muted/20 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Total Transactions</div>
            <div className="text-4xl font-black text-foreground font-mono">{items.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Hashes Needed</div>
            <div className="text-4xl font-black text-green-500 font-mono">{logValue}</div>
          </div>
        </div>
        
        <input 
          type="range" 
          min="0" 
          max="100" 
          defaultValue="10"
          onChange={handleSliderChange}
          className="w-full h-4 bg-muted/30 rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
        />
        <div className="flex justify-between text-[10px] font-bold uppercase text-muted">
          <span>1 Tx</span>
          <span>1,000,000 Tx</span>
        </div>
      </div>

      {/* Visual Metaphor Chart */}
      <div className="w-full grid gap-6">
        
        {/* Scenario A: Without Merkle Tree */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-red-500 flex items-center">
              <Database className="w-4 h-4 mr-2" /> Without Merkle Tree
            </span>
            <span className="text-xs font-mono font-bold text-muted">Download {items.toLocaleString()} items</span>
          </div>
          <div className="h-16 w-full bg-muted/10 rounded-2xl overflow-hidden relative border border-muted/20">
            <motion.div 
              className="h-full bg-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${(items / maxItems) * 100}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-xs font-bold text-foreground/50 uppercase tracking-widest">
                 Linear Growth (O(n))
               </span>
            </div>
          </div>
        </div>

        {/* Scenario B: With Merkle Tree */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-green-500 flex items-center">
              <Zap className="w-4 h-4 mr-2" /> With Merkle Proof
            </span>
            <span className="text-xs font-mono font-bold text-muted">Download {logValue} hashes</span>
          </div>
          <div className="h-16 w-full bg-muted/10 rounded-2xl overflow-hidden relative border border-muted/20">
            <motion.div 
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${(logValue / maxLog) * 100}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-xs font-bold text-foreground/50 uppercase tracking-widest">
                 Logarithmic Scale (O(log n))
               </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BlockchainVisualizer = () => {
  const [hacked, setHacked] = useState(false);

  return (
    <div className="flex flex-col items-center w-full h-full py-6 space-y-8">
      {/* Narrative Controls */}
      <div className="flex flex-col items-center space-y-4 text-center max-w-lg">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          {hacked ? <span className="text-red-500 flex items-center gap-2"><AlertTriangle className="w-6 h-6"/> CHAIN BROKEN</span> : <span className="text-green-500 flex items-center gap-2"><ShieldCheck className="w-6 h-6"/> CHAIN SECURE</span>}
        </h3>
        <p className="text-sm text-muted-foreground">
          Blockchains link blocks together using hashes. The <strong className="text-primary">Merkle Root</strong> summarizes all transactions. 
          If you change one transaction, the Root changes, breaking the link to the next block.
        </p>
        
        <button
          onClick={() => setHacked(!hacked)}
          className={`px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg transition-all transform hover:scale-105 ${
            hacked 
              ? "bg-green-500 text-white shadow-green-500/20" 
              : "bg-red-500 text-white shadow-red-500/20"
          }`}
        >
          {hacked ? "Repair Ledger" : "Attempt Hack"}
        </button>
      </div>

      {/* The Chain Visualizer */}
      <div className="relative w-full max-w-4xl flex items-center justify-center gap-4 md:gap-8 px-4 overflow-x-auto pb-8">
        {/* Connection Line Layer (Background) */}
        <div className="absolute top-1/2 left-0 w-full h-2 bg-muted/10 -z-10" />

        {/* BLOCK 100 (The Victim) */}
        <div className="relative group">
          <motion.div 
            animate={{ 
              borderColor: hacked ? "#ef4444" : "#e2e8f0", // Replaced var(--border)
              boxShadow: hacked ? "0 0 30px rgba(239, 68, 68, 0.2)" : "none"
            }}
            className="w-48 bg-card border-2 rounded-2xl p-4 flex flex-col gap-3 shadow-xl z-10"
          >
            <div className="flex justify-between items-center border-b border-muted/20 pb-2">
              <span className="text-[10px] font-black text-muted uppercase">Block #100</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            
            {/* Merkle Root Display */}
            <div className="bg-secondary/50 p-2 rounded-lg text-center">
              <div className="text-[8px] font-bold text-muted uppercase mb-1">Merkle Root</div>
              <AnimatePresence mode="wait">
                <motion.div 
                  key={hacked ? "bad-root" : "good-root"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`font-mono text-[10px] font-bold ${hacked ? "text-red-500" : "text-primary"}`}
                >
                  {hacked ? "0xDEAD...BEEF" : "0x7A91...3F2C"}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Transactions */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] p-1.5 rounded bg-muted/10">
                <span className="text-muted-foreground">Tx_1: Alice → Bob</span>
              </div>
              <motion.div 
                animate={{ backgroundColor: hacked ? "rgba(239, 68, 68, 0.1)" : "rgba(100, 116, 139, 0.1)" }} // Replaced rgba(var(--muted)...)
                className="flex items-center justify-between text-[10px] p-1.5 rounded border border-transparent"
              >
                <span className={hacked ? "text-red-500 font-bold" : "text-muted-foreground"}>
                  {hacked ? "Tx_2: Alice → EVE" : "Tx_2: Alice → Charlie"}
                </span>
                {hacked && <AlertTriangle className="w-3 h-3 text-red-500" />}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Chain Link 1 -> 2 */}
        <div className="relative flex items-center justify-center w-12">
           <motion.div 
             animate={{ 
               backgroundColor: hacked ? "#ef4444" : "#22c55e",
               rotate: hacked ? 45 : 0,
               y: hacked ? 10 : 0
             }}
             className="w-8 h-2 rounded-full"
           />
           {hacked && (
             <motion.div 
               initial={{ scale: 0 }} animate={{ scale: 1 }}
               className="absolute -top-6 text-[8px] font-bold text-red-500 bg-red-100 px-2 py-1 rounded-full whitespace-nowrap"
             >
               LINK BROKEN
             </motion.div>
           )}
        </div>

        {/* BLOCK 101 (The Orphan) */}
        <div className="relative opacity-90">
          <motion.div 
            animate={{ 
              opacity: hacked ? 0.5 : 1,
              scale: hacked ? 0.95 : 1
            }}
            className="w-48 bg-card border-2 border-border rounded-2xl p-4 flex flex-col gap-3 shadow-lg"
          >
            <div className="flex justify-between items-center border-b border-muted/20 pb-2">
              <span className="text-[10px] font-black text-muted uppercase">Block #101</span>
              {hacked ? <XCircle className="w-3 h-3 text-red-500" /> : <CheckCircle className="w-3 h-3 text-green-500" />}
            </div>

            <div className="p-2 rounded-lg border border-dashed border-muted relative overflow-hidden">
               <div className="text-[8px] font-bold text-muted uppercase mb-1">Previous Hash</div>
               <div className={`font-mono text-[10px] font-bold ${hacked ? "text-red-500 line-through" : "text-green-600"}`}>
                 0x7A91...3F2C
               </div>
               {hacked && (
                 <div className="text-[8px] font-bold text-red-500 mt-1">
                   MISMATCH! Expected 0xDEAD...
                 </div>
               )}
            </div>

            <div className="bg-secondary/50 p-2 rounded-lg text-center opacity-50">
              <div className="text-[8px] font-bold text-muted uppercase">Merkle Root</div>
              <div className="font-mono text-[10px] text-muted-foreground">0xB2C1...9A8D</div>
            </div>
          </motion.div>
        </div>

        {/* Chain Link 2 -> 3 */}
        <div className="relative flex items-center justify-center w-12 opacity-50">
           <div className={`w-8 h-2 rounded-full ${hacked ? "bg-muted" : "bg-green-500"}`} />
        </div>

        {/* BLOCK 102 (The Future) */}
        <div className="relative opacity-60">
          <motion.div 
            animate={{ 
              opacity: hacked ? 0.3 : 1,
              scale: hacked ? 0.9 : 1
            }}
            className="w-48 bg-card border-2 border-border rounded-2xl p-4 flex flex-col gap-3 shadow-sm"
          >
            <div className="flex justify-between items-center border-b border-muted/20 pb-2">
              <span className="text-[10px] font-black text-muted uppercase">Block #102</span>
              {hacked && <XCircle className="w-3 h-3 text-red-500" />}
            </div>
            <div className="p-2 rounded-lg border border-dashed border-muted text-center">
               <div className="text-[8px] font-bold text-muted uppercase">Previous Hash</div>
               <div className="font-mono text-[10px] text-muted-foreground">0xB2C1...9A8D</div>
            </div>
            <div className="bg-secondary/50 p-2 rounded-lg text-center">
              <div className="text-[8px] font-bold text-muted uppercase">Merkle Root</div>
              <div className="font-mono text-[10px] text-muted-foreground">0xE5F4...1C2B</div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

const ProofPathVisualizer = () => {
  const [step, setStep] = useState(0);
  
  // Coordinates for perfect alignment (viewBox="0 0 400 300")
  const coords = {
    root: { x: 200, y: 50 },
    l1: [
      { x: 100, y: 150 }, // Node 0
      { x: 300, y: 150 }  // Node 1
    ],
    l2: [
      { x: 50, y: 250 },  // Leaf 0
      { x: 150, y: 250 }, // Leaf 1
      { x: 250, y: 250 }, // Leaf 2 (Target)
      { x: 350, y: 250 }  // Leaf 3 (Sibling 1)
    ]
  };

  const next = () => setStep(s => (s + 1) % 5);
  const reset = () => setStep(0);

  return (
    <div className="flex flex-col items-center w-full h-full max-w-2xl py-2 space-y-4">
      {/* 1. Header State */}
      <div className="flex items-center justify-between w-full px-6 py-2 bg-secondary/30 rounded-2xl border border-muted/20">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Verification Status</span>
          <span className={`text-sm font-bold ${step === 4 ? "text-green-500" : "text-primary"}`}>
            {step === 0 && "Select Target Leaf"}
            {step === 1 && "Target Data Hashed"}
            {step === 2 && "Added Sibling #1"}
            {step === 3 && "Added Sibling #2"}
            {step === 4 && "Merkle Root Verified!"}
          </span>
        </div>
        <button 
          onClick={step === 4 ? reset : next}
          className="px-6 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
        >
          {step === 4 ? "Restart" : step === 0 ? "Begin" : "Next Step"}
        </button>
      </div>

      {/* 2. Unified SVG Simulation */}
      <div className="relative w-full flex-grow aspect-[4/3] bg-background/50 rounded-[2rem] border border-muted/10 shadow-inner overflow-visible">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 400 300">
          
          {/* --- Connections (Paths) --- */}
          {/* Level 1 -> Root */}
          <motion.path 
            d={`M ${coords.l1[0].x} ${coords.l1[0].y} L ${coords.root.x} ${coords.root.y}`}
            stroke="currentColor" strokeWidth="2" fill="none"
            animate={{ stroke: step >= 4 ? "#3b82f6" : "#94a3b8", opacity: step >= 4 ? 1 : 0.2 }}
            className="text-muted"
          />
          <motion.path 
            d={`M ${coords.l1[1].x} ${coords.l1[1].y} L ${coords.root.x} ${coords.root.y}`}
            stroke="var(--primary)" strokeWidth="3" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: step >= 3 ? 1 : 0, opacity: step >= 3 ? 1 : 0.2 }}
          />

          {/* Level 2 -> Level 1 */}
          <path d={`M ${coords.l2[0].x} ${coords.l2[0].y} L ${coords.l1[0].x} ${coords.l1[0].y}`} stroke="var(--muted)" strokeWidth="2" strokeOpacity="0.1" fill="none" />
          <path d={`M ${coords.l2[1].x} ${coords.l2[1].y} L ${coords.l1[0].x} ${coords.l1[0].y}`} stroke="var(--muted)" strokeWidth="2" strokeOpacity="0.1" fill="none" />
          <motion.path 
            d={`M ${coords.l2[2].x} ${coords.l2[2].y} L ${coords.l1[1].x} ${coords.l1[1].y}`}
            stroke="var(--primary)" strokeWidth="3" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: step >= 1 ? 1 : 0, opacity: step >= 1 ? 1 : 0.2 }}
          />
          <path d={`M ${coords.l2[3].x} ${coords.l2[3].y} L ${coords.l1[1].x} ${coords.l1[1].y}`} stroke="var(--muted)" strokeWidth="2" strokeOpacity="0.1" fill="none" />

          {/* --- Nodes (Circles) --- */}
          
          {/* Root Node */}
          <motion.g
            animate={{ scale: step === 4 ? 1.2 : 1 }}
          >
            <circle cx={coords.root.x} cy={coords.root.y} r="20" className="fill-background stroke-muted border-2" strokeWidth="2" />
            <motion.circle 
              cx={coords.root.x} cy={coords.root.y} r="20" 
              className="fill-primary/10 stroke-primary" 
              strokeWidth="3"
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 4 ? 1 : 0, fill: step === 4 ? "#22c55e" : "#dbeafe", stroke: step === 4 ? "#22c55e" : "#3b82f6" }}
            />
            {step === 4 ? (
              <CheckCircle className="text-white w-6 h-6" x={coords.root.x - 12} y={coords.root.y - 12} />
            ) : (
              <ShieldCheck className="text-muted w-6 h-6" x={coords.root.x - 12} y={coords.root.y - 12} />
            )}
          </motion.g>

          {/* Intermediate Nodes */}
          {coords.l1.map((c, i) => (
            <motion.g key={`l1-${i}`}>
              <circle cx={c.x} cy={c.y} r="15" className="fill-background stroke-muted" strokeWidth="2" />
              <motion.circle 
                cx={c.x} cy={c.y} r="15" 
                animate={{ 
                  opacity: (i === 1 && step >= 2) || (i === 0 && step >= 3) ? 1 : 0,
                  fill: i === 0 && step === 3 ? "#eab308" : "var(--primary)" // Sibling 2 is yellow
                }}
                className="stroke-primary" strokeWidth="2"
              />
              <Hash className="text-muted w-4 h-4" x={c.x - 8} y={c.y - 8} />
              {i === 0 && step === 3 && (
                <text x={c.x} y={c.y + 30} textAnchor="middle" className="fill-yellow-500 text-[10px] font-bold">SIBLING #2</text>
              )}
            </motion.g>
          ))}

          {/* Leaves */}
          {coords.l2.map((c, i) => {
            const isTarget = i === 2;
            const isSibling = i === 3;
            return (
              <motion.g key={`l2-${i}`} onClick={() => isTarget && step === 0 && next()} className={isTarget && step === 0 ? "cursor-pointer" : ""}>
                <rect x={c.x - 15} y={c.y - 15} width="30" height="30" rx="8" className="fill-background stroke-muted" strokeWidth="2" />
                <motion.rect 
                  x={c.x - 15} y={c.y - 15} width="30" height="30" rx="8"
                  animate={{ 
                    opacity: (isTarget && step >= 1) || (isSibling && step >= 2) ? 1 : 0,
                    fill: isSibling ? "#eab308" : "var(--primary)",
                    stroke: isSibling ? "#eab308" : "var(--primary)"
                  }}
                  strokeWidth="2"
                />
                {isTarget ? (
                  <Database className={step >= 1 ? "text-white" : "text-primary"} width="16" height="16" x={c.x - 8} y={c.y - 8} />
                ) : (
                  <Hash className={isSibling && step >= 2 ? "text-white" : "text-muted"} width="16" height="16" x={c.x - 8} y={c.y - 8} />
                )}
                {isTarget && step === 0 && (
                  <text x={c.x} y={c.y + 35} textAnchor="middle" className="fill-primary text-[10px] font-bold animate-pulse">TARGET (CLICK)</text>
                )}
                {isSibling && step === 2 && (
                  <text x={c.x} y={c.y + 35} textAnchor="middle" className="fill-yellow-500 text-[10px] font-bold">SIBLING #1</text>
                )}
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* 3. Narrative Explanation */}
      <div className="w-full bg-primary/5 p-4 rounded-2xl border border-primary/10">
        <p className="text-center text-sm text-muted-foreground font-medium leading-relaxed">
          {step === 0 && "To verify data without the whole tree, we only need a specific path."}
          {step === 1 && "First, we hash our target data. This gives us our initial 'Leaf Hash'."}
          {step === 2 && "We combine our hash with Sibling #1 (Yellow) to calculate the parent hash."}
          {step === 3 && "Now we combine that result with Sibling #2 to reach the top."}
          {step === 4 && "Success! Our calculated hash matches the Trusted Root perfectly."}
        </p>
      </div>
    </div>
  );
};

const TopicVisualizer = ({ type }: { type: string }) => {
  switch (type) {
    case 'tamper': return <TamperSimulation />;
    case 'avalanche': return <AvalancheSimulation />;
    case 'leaf': return <LeafConstruction />;
    case 'internal': return <InternalNodeVisualizer />;
    case 'root': return <MerkleRootVisualizer />;
    case 'binary': return <BinaryStructureVisualizer />;
    case 'proof': return <ProofPathVisualizer />;
    case 'efficiency': return <EfficiencyVisualizer />;
    case 'blockchain': return <BlockchainVisualizer />;
    default: return <div className="text-muted text-sm">Visualization not found</div>;
  }
};

const topicData: Record<string, {
  title: string;
  definition: string;
  analogy: string;
  details: string[];
  icon: LucideIcon;
  visualizationType: string;
}> = {
  'why-integrity': {
    title: 'Why Data Integrity Matters',
    definition: 'Cryptographic integrity provides a mathematical guarantee that data has not been altered. Unlike checksums which detect accidental errors, cryptographic verification prevents intentional tampering by ensuring it is computationally infeasible to generate a valid proof for corrupted data.',
    analogy: 'Like a wax seal on an envelope, but the seal is mathematically tied to every single letter in the message.',
    details: [
      'Detects unauthorized changes instantly.',
      'Ensures trust in distributed systems.',
      'Prevents malicious data injection.'
    ],
    icon: ShieldCheck,
    visualizationType: 'tamper'
  },
  'hashing-recap': {
    title: 'Hashing Recap',
    definition: 'A cryptographic hash function behaves as a deterministic random oracle. It exhibits the "Avalanche Effect", where flipping a single input bit changes approximately 50% of the output bits, making the output unpredictable and irreversible (pre-image resistant).',
    analogy: 'A chaotic blender where putting in a strawberry vs a strawberry with one missing seed results in two completely different colored juices.',
    details: [
      'Deterministic: Same input always gives same output.',
      'One-way: Cannot recreate data from hash.',
      'Avalanche effect: Small change = big difference.'
    ],
    icon: Hash,
    visualizationType: 'avalanche'
  },
  'leaf-nodes': {
    title: 'Leaf Nodes',
    definition: 'Leaf nodes form the foundational layer of the Merkle Tree, acting as the cryptographic commitment to the raw data. Each data block is hashed individually, ensuring that the tree structure is agnostic to the underlying data format.',
    analogy: 'The individual bricks at the base of a pyramid, each stamped with a unique code representing its contents.',
    details: [
      'Leaves are the raw data points transformed into hashes.',
      'They represent the actual content being protected.',
      'A tree with 8 items has 8 leaf nodes.'
    ],
    icon: Database,
    visualizationType: 'leaf'
  },
  'internal-nodes': {
    title: 'Internal Nodes',
    definition: 'Internal nodes serve as cryptographic aggregators. By concatenating and hashing pairs of child nodes, they recursively commit to larger subsets of the data, forming a binding chain of custody from the leaves up to the root.',
    analogy: 'Middle managers who summarize reports from two direct reports and sign off on the combined result.',
    details: [
      'Formed by concatenating and hashing child pairs.',
      'Each level up reduces the number of nodes by half.',
      'They act as a cryptographic bridge to the root.'
    ],
    icon: GitMerge,
    visualizationType: 'internal'
  },
  'merkle-root': {
    title: 'Merkle Root',
    definition: 'The Merkle Root is the single 256-bit accumulator that cryptographically binds the entire dataset. It serves as a unique global identifier; any permutation or modification of the underlying dataset results in a completely disparate root hash.',
    analogy: 'The DNA of the entire structure. If you change one cell, the DNA check fails.',
    details: [
      'Changing one byte anywhere in the data changes the root.',
      'Used as a summary for an entire block of transactions.',
      'Provides a "Short Hash" for huge datasets.'
    ],
    icon: Zap,
    visualizationType: 'root'
  },
  'binary-tree-structure': {
    title: 'Binary Tree Structure',
    definition: 'The strict binary structure ensures the tree remains balanced, guaranteeing a tree height of exactly ⌈log₂(N)⌉. This logarithmic property is critical for consistent performance, ensuring verification time remains manageable even as the dataset grows exponentially.',
    analogy: 'A tournament bracket where every two teams play to produce one winner for the next round.',
    details: [
      'Each pair of nodes combines into one parent.',
      'Logarithmic height: a tree with 1,000,000 leaves is only ~20 levels high.',
      'Organized and predictable path from any leaf to the root.'
    ],
    icon: GitBranch,
    visualizationType: 'binary'
  },
  'merkle-proofs': {
    title: 'Merkle Proofs',
    definition: 'A Merkle Proof (or Authentication Path) consists of the specific sibling hashes required to reconstruct the path from a leaf to the root. This allows a verifier to recompute the root with only O(log N) information, proving inclusion without possessing the full dataset.',
    analogy: 'Proving you are related to a king by showing birth certificates of your father, grandfather, and great-grandfather, without needing the family tree of every cousin.',
    details: [
      'Only requires log₂(N) hashes.',
      'Crucial for "Light Clients" in blockchain.',
      'Enables efficient partial data verification.'
    ],
    icon: ShieldCheck,
    visualizationType: 'proof'
  },
  'efficiency': {
    title: 'Efficiency & Scalability',
    definition: 'Merkle Trees decouple verification complexity from data size. While storage grows linearly O(N), proof size and verification time grow logarithmically O(log N), enabling systems to scale to billions of records with negligible verification overhead.',
    analogy: 'Finding a book using the Dewey Decimal System (fast) vs walking every aisle looking at every title (slow).',
    details: [
      'Proof size is O(log N) instead of O(N).',
      'Perfect for systems with millions of transactions.',
      'Enables "Light" versions of heavy software.'
    ],
    icon: BarChart3,
    visualizationType: 'efficiency'
  },
  'blockchains': {
    title: 'Merkle Trees in Blockchains',
    definition: 'In blockchain architectures, the Merkle Root in the block header enables Simplified Payment Verification (SPV). Light clients can verify the inclusion of a specific transaction by checking its Merkle path against the trusted block header without downloading the entire blockchain history.',
    analogy: 'Checking a restaurant receipt against the total on your bank statement.',
    details: [
      'Transaction IDs are the leaves.',
      'The Merkle Root is stored in the Block Header.',
      'Saves massive amounts of bandwidth and storage.'
    ],
    icon: Globe,
    visualizationType: 'blockchain'
  }
};

const topics = [
  'why-integrity', 'hashing-recap', 'leaf-nodes', 'internal-nodes', 'merkle-root', 
  'binary-tree-structure', 'merkle-proofs', 'efficiency', 'blockchains'
];

const TopicPage: FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const data = topicData[topicId || ''] || topicData['why-integrity'];

  const currentIndex = topics.indexOf(topicId || '');
  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic = currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-10 px-4 md:px-0">
      <Link to="/learn" className="flex items-center text-muted hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Path
      </Link>

      {/* 1. Header & Concept */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={`${topicId}-header`}
        className="max-w-3xl"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <data.icon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{data.title}</h1>
        </div>
        <p className="text-xl md:text-2xl leading-relaxed font-medium text-foreground/90">{data.definition}</p>
      </motion.div>

      {/* 2. Full-Width Simulation Row */}
      <div className="w-full min-h-[450px] md:min-h-[550px] rounded-[2.5rem] md:rounded-[4rem] border border-muted/20 bg-secondary/30 flex items-center justify-center p-6 md:p-12 relative overflow-hidden shadow-inner">
        <div className="absolute top-6 left-8 md:top-8 md:left-12 flex items-center space-x-2 z-20">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] font-mono text-muted ml-2 uppercase tracking-widest">Interactive Simulation</span>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={topicId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full h-full flex items-center justify-center"
          >
            <TopicVisualizer type={data.visualizationType} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Details Row (Analogy & Takeaways) */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 rounded-[2rem] bg-secondary/50 border border-muted/10 flex flex-col justify-center"
        >
          <h3 className="text-sm font-bold mb-4 flex items-center uppercase tracking-widest text-primary/70">
            <Zap className="w-4 h-4 mr-2 text-accent" />
            The Analogy
          </h3>
          <p className="text-lg text-muted italic leading-relaxed">"{data.analogy}"</p>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10"
        >
          <h3 className="text-sm font-bold mb-4 uppercase tracking-widest text-primary/70">Key Takeaways</h3>
          <ul className="space-y-4">
            {data.details.map((detail, i) => (
              <li key={i} className="text-sm text-muted flex items-start">
                <span className="text-primary mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        </motion.section>
      </div>

      {/* 4. Navigation Footer */}
      <div className="flex items-center justify-between pt-10 border-t border-muted/20">
        {prevTopic ? (
          <Link to={`/learn/${prevTopic}`} className="flex items-center text-primary font-medium hover:translate-x-[-4px] transition-transform">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous Topic
          </Link>
        ) : <div />}
        {nextTopic ? (
          <Link to={`/learn/${nextTopic}`} className="flex items-center text-primary font-bold bg-primary px-8 py-4 rounded-full text-primary-foreground hover:opacity-90 shadow-xl shadow-primary/20 transition-all">
            Next Topic
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        ) : (
          <Link to="/playground" className="flex items-center text-accent font-bold bg-accent px-8 py-4 rounded-full text-accent-foreground hover:opacity-90 shadow-xl shadow-accent/20 transition-all">
            Explore Playground
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopicPage;
