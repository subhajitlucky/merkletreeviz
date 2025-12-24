import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Layers, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-20 py-10">
      <section className="text-center space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight"
        >
          Master the <span className="text-primary">Merkle Tree</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-muted max-w-2xl mx-auto"
        >
          A visual journey into the heart of data integrity. Understand how blockchains and distributed systems verify massive amounts of data in seconds.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link 
            to="/playground" 
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-all flex items-center group"
          >
            Open Playground
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/learn" 
            className="px-8 py-3 bg-secondary text-secondary-foreground rounded-full font-semibold hover:opacity-90 transition-all"
          >
            Start Learning
          </Link>
        </motion.div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: ShieldCheck,
            title: "Data Integrity",
            description: "Learn how a single hash can represent thousands of data points reliably."
          },
          {
            icon: Zap,
            title: "Efficient Proofs",
            description: "See how logarithmic scaling allows for lightning-fast verification at any scale."
          },
          {
            icon: Layers,
            title: "Blockchains",
            description: "Discover why Merkle Trees are the fundamental backbone of Bitcoin and Ethereum."
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="p-6 rounded-2xl border border-muted/20 bg-secondary/50"
          >
            <feature.icon className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-muted">{feature.description}</p>
          </motion.div>
        ))}
      </section>

      <section className="relative h-64 md:h-96 rounded-[3rem] overflow-hidden border-2 border-primary/10 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center shadow-inner">
        {/* Simplified Tree Animation Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
           <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] blur-3xl" />
        </div>
        <div className="text-center z-10 space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.3em]">
            Live Construction
          </div>
          <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
            Watch Data Become a Root
          </div>
          <div className="flex gap-5 justify-center pt-2">
            {[1, 2, 3, 4].map(n => (
              <motion.div
                key={n}
                animate={{ 
                  y: [0, -15, 0],
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: n * 0.2, ease: "easeInOut" }}
                className="w-16 h-16 rounded-[1.25rem] bg-white dark:bg-slate-800 border-2 border-primary/40 flex items-center justify-center shadow-md"
              >
                <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
