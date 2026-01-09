import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Hash, MousePointer2, GitBranch, Binary, CheckCircle2, BarChart3, Globe } from 'lucide-react';

const topics = [
  { id: 'why-integrity', title: 'Why Data Integrity Matters', icon: BookOpen },
  { id: 'hashing-recap', title: 'Hashing Recap', icon: Hash },
  { id: 'leaf-nodes', title: 'Leaf Nodes', icon: MousePointer2 },
  { id: 'internal-nodes', title: 'Internal Nodes', icon: GitBranch },
  { id: 'merkle-root', title: 'Merkle Root', icon: Binary },
  { id: 'binary-tree-structure', title: 'Binary Tree Structure', icon: GitBranch },
  { id: 'merkle-proofs', title: 'Merkle Proofs', icon: CheckCircle2 },
  { id: 'efficiency', title: 'Efficiency & Scalability', icon: BarChart3 },
  { id: 'blockchains', title: 'Merkle Trees in Blockchains', icon: Globe },
];

const Learn = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Learning Path</h1>
        <p className="text-muted text-lg">Follow the steps to understand how Merkle Trees work from the ground up.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={`/learn/${topic.id}`}
              className="group block p-6 h-full rounded-2xl border border-muted/20 bg-secondary/30 hover:bg-primary/5 hover:border-primary/50 transition-all"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <topic.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-mono text-muted">0{index + 1}</span>
              </div>
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{topic.title}</h3>
              <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Topic <span className="ml-2">→</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Learn;
