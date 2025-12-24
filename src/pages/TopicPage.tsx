import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Hash, Database, GitMerge, ShieldCheck, Zap } from 'lucide-react';
import { useState, useEffect, type FC } from 'react';
import { sha256 } from '../lib/merkle';

const HashingVisualizer = () => {
  const [input, setInput] = useState('Merkle');
  const [hash, setHash] = useState('');

  useEffect(() => {
    sha256(input).then(setHash);
  }, [input]);

  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      <div className="w-full space-y-2">
        <label className="text-xs font-mono text-muted uppercase">Input Data</label>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-background border-2 border-primary/20 rounded-xl p-4 font-mono focus:border-primary outline-none transition-all"
        />
      </div>
      <div className="w-full flex items-center justify-center py-4">
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <Hash className="w-8 h-8 text-primary opacity-50" />
        </motion.div>
      </div>
      <div className="w-full space-y-2">
        <label className="text-xs font-mono text-muted uppercase">Fixed-Length Hash</label>
        <div className="w-full bg-secondary rounded-xl p-4 font-mono text-xs break-all border border-muted/20 text-primary">
          {hash}
        </div>
      </div>
    </div>
  );
};

const PairingVisualizer = () => {
  const [h1] = useState('a1b2');
  const [h2] = useState('c3d4');
  const [result, setResult] = useState('');

  useEffect(() => {
    sha256(h1 + h2).then(setResult);
  }, [h1, h2]);

  return (
    <div className="relative flex flex-col items-center w-full max-w-sm space-y-12">
      <div className="flex justify-between w-full gap-4">
        <div className="flex-1 space-y-2">
          <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg text-[10px] font-mono truncate">{h1}</div>
          <p className="text-[10px] text-center text-muted uppercase font-bold">Left Child</p>
        </div>
        <div className="flex-1 space-y-2">
          <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg text-[10px] font-mono truncate">{h2}</div>
          <p className="text-[10px] text-center text-muted uppercase font-bold">Right Child</p>
        </div>
      </div>
      
      <div className="absolute top-10 flex items-center justify-center w-full">
        <svg width="200" height="60" className="overflow-visible">
          <motion.path 
            d="M 20 0 L 100 40 M 180 0 L 100 40" 
            fill="none" stroke="currentColor" strokeWidth="2" 
            className="text-primary opacity-30"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          />
        </svg>
      </div>

      <motion.div 
        key={result}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="z-10 w-full p-4 bg-accent/20 border-2 border-accent/50 rounded-2xl text-center"
      >
        <div className="text-[10px] font-mono break-all text-accent font-bold mb-1">{result}</div>
        <p className="text-[10px] text-muted uppercase font-bold">Parent Hash = Hash(Left + Right)</p>
      </motion.div>
    </div>
  );
};

const LeafNodeVisualizer = () => {
  const [data, setData] = useState("Transaction #42");
  const [hash, setHash] = useState("");

  useEffect(() => {
    sha256(data).then(h => setHash(h.substring(0, 32)));
  }, [data]);
  
  return (
    <div className="flex flex-col items-center justify-center space-y-12 w-full">
      <div className="relative group w-full max-w-xs">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-background border-2 border-primary/20 p-6 rounded-xl text-center">
          <Database className="w-8 h-8 text-primary mx-auto mb-2" />
          <input 
            value={data} 
            onChange={(e) => setData(e.target.value)}
            className="bg-transparent text-center font-bold text-lg outline-none w-full"
          />
          <p className="text-[10px] text-muted uppercase mt-2">Raw Data Input</p>
        </div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowRight className="w-8 h-8 text-primary rotate-90 opacity-50" />
      </motion.div>

      <motion.div 
        key={data}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-xs bg-primary/10 border-2 border-primary border-dashed p-6 rounded-2xl relative"
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full">HASHED</div>
        <div className="font-mono text-xs break-all text-primary text-center">
          {hash}...
        </div>
      </motion.div>
    </div>
  );
};

const ProofVisualizer = () => {
  const [step, setStep] = useState(0);
  
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          {[0, 1, 2].map(i => (
            <div key={i} className={`w-3 h-3 rounded-full transition-colors ${step >= i ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>
        
        <div className="relative h-64 w-full flex flex-col items-center justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="p-6 rounded-2xl border-2 border-primary bg-primary/5 text-center z-10 w-64"
            >
              <h4 className="text-xs font-bold text-primary uppercase mb-2">
                {step === 0 && "Start with Target Leaf"}
                {step === 1 && "Add Sibling Hash"}
                {step === 2 && "Final Result matches Root!"}
              </h4>
              <div className="font-mono text-[10px] break-all">
                {step === 0 && "0x74a...31"}
                {step === 1 && "Hash(0x74a...31 + 0x8b2...f0)"}
                {step === 2 && "0xROOT_HASH_VERIFIED"}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <ShieldCheck className="w-48 h-48 text-primary" />
          </div>
        </div>

        <button 
          onClick={() => setStep((step + 1) % 3)}
          className="mt-4 px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          {step === 2 ? "Reset Proof" : "Next Verification Step"}
        </button>
      </div>
    </div>
  );
};

const TopicVisualizer = ({ type }: { type: string }) => {
  switch (type) {
    case 'hashing': return <HashingVisualizer />;
    case 'pairing': return <PairingVisualizer />;
    case 'tree': return <LeafNodeVisualizer />;
    case 'proof': return <ProofVisualizer />;
    default: return null;
  }
};

const topicData: Record<string, {
  title: string;
  definition: string;
  analogy: string;
  details: string[];
  icon: any;
  visualizationType: 'hashing' | 'pairing' | 'tree' | 'proof';
}> = {
  'why-integrity': {
    title: 'Why Data Integrity Matters',
    definition: 'Data integrity is the assurance that digital information is uncorrupted and remains consistent throughout its life cycle.',
    analogy: 'Imagine sending a sealed letter. If the seal is broken when it arrives, you know someone tampered with it.',
    details: [
      'Detects unauthorized changes instantly.',
      'Ensures trust in distributed systems.',
      'Prevents malicious data injection.'
    ],
    icon: Database,
    visualizationType: 'hashing'
  },
  'hashing-recap': {
    title: 'Hashing Recap',
    definition: 'A cryptographic hash function takes an input and returns a fixed-length string of characters. Even a tiny change in input produces a completely different hash.',
    analogy: 'A hash is like a fingerprint for data. Unique, fixed-size, and impossible to reverse-engineer.',
    details: [
      'Deterministic: Same input always gives same output.',
      'Fast to compute.',
      'Avalanche effect: Small change = big difference.'
    ],
    icon: Hash,
    visualizationType: 'hashing'
  },
  'leaf-nodes': {
    title: 'Leaf Nodes',
    definition: 'The lowest level of a Merkle Tree. Each leaf node represents the hash of a single piece of data.',
    analogy: 'The individual bricks at the base of a pyramid.',
    details: [
      'Leaves are the raw data points transformed into hashes.',
      'They represent the actual content being protected.',
      'A tree with 8 items has 8 leaf nodes.'
    ],
    icon: Database,
    visualizationType: 'tree'
  },
  'internal-nodes': {
    title: 'Internal Nodes',
    definition: 'Nodes that are not leaves. Each internal node is the hash of its children nodes joined together.',
    analogy: 'Managers who summarize reports from their subordinates to send to the CEO.',
    details: [
      'Formed by concatenating and hashing child pairs.',
      'Each level up reduces the number of nodes by half.',
      'They act as a cryptographic bridge to the root.'
    ],
    icon: GitMerge,
    visualizationType: 'pairing'
  },
  'merkle-root': {
    title: 'Merkle Root',
    definition: 'The single hash at the very top of the tree. It represents the integrity of the entire dataset.',
    analogy: 'The final signature on a multi-page contract that covers every single clause.',
    details: [
      'Changing one byte anywhere in the data changes the root.',
      'Used as a summary for an entire block of transactions.',
      'Provides a "Short Hash" for huge datasets.'
    ],
    icon: Zap,
    visualizationType: 'tree'
  },
  'merkle-proofs': {
    title: 'Merkle Proofs',
    definition: 'A small set of hashes that allows someone to verify that a specific piece of data belongs in the tree without having the whole tree.',
    analogy: 'Proving you were at a party by showing a photo of you with the host, rather than a video of the entire night.',
    details: [
      'Only requires log₂(N) hashes.',
      'Crucial for "Light Clients" in blockchain.',
      'Enables efficient partial data verification.'
    ],
    icon: ShieldCheck,
    visualizationType: 'proof'
  }
};

const topics = [
  'why-integrity', 'hashing-recap', 'leaf-nodes', 'internal-nodes', 'merkle-root', 
  'merkle-proofs'
];

const TopicPage: FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const data = topicData[topicId || ''] || topicData['why-integrity'];

  const currentIndex = topics.indexOf(topicId || '');
  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic = currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-10">
      <Link to="/learn" className="flex items-center text-muted hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Path
      </Link>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={`${topicId}-content`}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <data.icon className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold">{data.title}</h1>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-3">The Concept</h3>
                <p className="text-xl leading-relaxed font-medium">{data.definition}</p>
              </section>

              <div className="grid sm:grid-cols-2 gap-4">
                <section className="p-6 rounded-2xl bg-secondary border border-muted/10">
                  <h3 className="text-sm font-bold mb-3 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-accent" />
                    Analogy
                  </h3>
                  <p className="text-muted italic text-sm leading-relaxed">{data.analogy}</p>
                </section>

                <section className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                  <h3 className="text-sm font-bold mb-3">Key Takeaways</h3>
                  <ul className="space-y-2">
                    {data.details.map((detail, i) => (
                      <li key={i} className="text-xs text-muted flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center justify-between pt-8 border-t border-muted/20">
            {prevTopic ? (
              <Link to={`/learn/${prevTopic}`} className="flex items-center text-primary font-medium hover:translate-x-[-4px] transition-transform">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Topic
              </Link>
            ) : <div />}
            {nextTopic ? (
              <Link to={`/learn/${nextTopic}`} className="flex items-center text-primary font-bold bg-primary/10 px-6 py-3 rounded-full hover:bg-primary/20 transition-all">
                Next Topic
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            ) : (
              <Link to="/playground" className="flex items-center text-accent font-bold bg-accent/10 px-6 py-3 rounded-full hover:bg-accent/20 transition-all">
                Explore Playground
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 aspect-square rounded-[3rem] border border-muted/20 bg-secondary/30 flex items-center justify-center p-12 relative overflow-hidden">
           <div className="absolute top-6 left-10 flex items-center space-x-2">
             <div className="w-2 h-2 rounded-full bg-red-500" />
             <div className="w-2 h-2 rounded-full bg-yellow-500" />
             <div className="w-2 h-2 rounded-full bg-green-500" />
             <span className="text-[10px] font-mono text-muted ml-2">Interactive Visualizer</span>
           </div>
           
           <AnimatePresence mode="wait">
            <motion.div
              key={topicId}
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.1, rotate: 2 }}
              className="w-full"
            >
              <TopicVisualizer type={data.visualizationType} />
            </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TopicPage;