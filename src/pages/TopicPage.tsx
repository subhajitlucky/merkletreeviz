import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Zap, BarChart3, Globe, ShieldCheck, type LucideIcon } from 'lucide-react';
import { type FC } from 'react';

// Visualizers
import { TamperSimulation } from '../components/visualizers/TamperSimulation';
import { AvalancheSimulation } from '../components/visualizers/AvalancheSimulation';
import { LeafConstruction } from '../components/visualizers/LeafConstruction';
import { InternalNodeVisualizer } from '../components/visualizers/InternalNodeVisualizer';
import { MerkleRootVisualizer } from '../components/visualizers/MerkleRootVisualizer';
import { BinaryStructureVisualizer } from '../components/visualizers/BinaryStructureVisualizer';
import { ProofPathVisualizer } from '../components/visualizers/ProofPathVisualizer';
import { EfficiencyVisualizer } from '../components/visualizers/EfficiencyVisualizer';
import { BlockchainVisualizer } from '../components/visualizers/BlockchainVisualizer';

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
    icon: Zap,
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
    icon: Globe,
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
    icon: ShieldCheck,
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
    icon: ShieldCheck,
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
          <Link to={`/learn/${nextTopic}`} className="flex items-center font-bold bg-primary px-8 py-4 rounded-full text-primary-foreground hover:opacity-90 shadow-xl shadow-primary/20 transition-all">
            Next Topic
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        ) : (
          <Link to="/playground" className="flex items-center font-bold bg-accent px-8 py-4 rounded-full text-accent-foreground hover:opacity-90 shadow-xl shadow-accent/20 transition-all">
            Explore Playground
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopicPage;