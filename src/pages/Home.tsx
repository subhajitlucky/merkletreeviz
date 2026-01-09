import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Layers } from 'lucide-react';

const Home = () => {
  return (
    <div className="relative pt-8 md:pt-16 pb-32 overflow-hidden">
      {/* Background Decor - Minimalist */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl px-4 pointer-events-none -z-10">
        <div className="w-full h-full border-x border-muted/5 refinery-grid opacity-40" />
      </div>

      <section className="relative px-4 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12">
          {/* Subtle Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-muted/20 bg-background/50 backdrop-blur-sm text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>Cryptographic Engineering</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black font-display tracking-tight leading-[0.95]"
          >
            The Physics of <br />
            <span className="text-accent">Data Integrity</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Explore Merkle Trees—the geometric foundation of modern distributed systems. Understand how millions of data points compress into a single, immutable fingerprint.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link 
              to="/playground" 
              className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/10"
            >
              Start Forging
            </Link>
            <Link 
              to="/learn" 
              className="w-full sm:w-auto px-8 py-4 border border-muted/20 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-secondary transition-all"
            >
              Documentation
            </Link>
          </motion.div>
        </div>

        {/* Hero Visualizer - Refined & Scaled Down */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-20 max-w-5xl mx-auto aspect-video glass-panel rounded-[2rem] flex items-center justify-center overflow-hidden border-muted/10 relative"
        >
          <div className="absolute inset-0 refinery-grid opacity-20" />
          <div className="flex gap-4 md:gap-8 items-end h-32 md:h-48 relative z-10">
             {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
               <motion.div
                 key={i}
                 animate={{ height: [20, 100, 40, 140, 20] }}
                 transition={{ duration: 5, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                 className="w-4 md:w-8 bg-accent/20 rounded-t-xl border-t border-x border-accent/30 relative group"
               >
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_10px_var(--accent)]" />
               </motion.div>
             ))}
          </div>
          <div className="absolute bottom-12 w-full text-center">
             <span className="text-[10px] font-black text-muted uppercase tracking-[0.5em] opacity-50">Merkle Root Reconstruction</span>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="pt-32 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: "Immutable Proof",
              desc: "Verify gigabytes of data with a mere 32-byte hash. Mathematical certainty, at scale."
            },
            {
              icon: Zap,
              title: "O(log n) Speed",
              desc: "Complexity that barely grows. Verify one transaction among millions in milliseconds."
            },
            {
              icon: Layers,
              title: "Binary Integrity",
              desc: "The core architecture powering Bitcoin, Ethereum, and Git. Distributed trust, visualized."
            }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl border border-muted/10 bg-card hover:border-accent/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-display uppercase tracking-tight">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
