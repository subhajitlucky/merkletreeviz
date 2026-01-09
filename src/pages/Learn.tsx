import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Hash, MousePointer2, GitBranch, Binary, CheckCircle2, BarChart3, Globe, ArrowRight } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto space-y-16 py-16 px-4">
      <div className="text-center space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold font-display tracking-tight"
        >
          Master the <span className="text-gradient">Protocol</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          A step-by-step visual journey into the cryptographic structures that power the decentralized web.
        </motion.p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={`/learn/${topic.id}`}
              className="glass-panel group block p-8 h-full rounded-3xl relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-primary/20"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <topic.icon className="w-24 h-24 -rotate-12 transform translate-x-8 -translate-y-8" />
              </div>
              
              <div className="flex flex-col h-full justify-between relative z-10">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    <topic.icon className="w-6 h-6" />
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Chapter 0{index + 1}</span>
                    <h3 className="text-2xl font-bold font-display group-hover:text-primary transition-colors">{topic.title}</h3>
                  </div>
                </div>

                <div className="mt-8 flex items-center text-sm font-bold text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Start Chapter <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Learn;
