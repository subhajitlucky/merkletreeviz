import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, TreeDeciduous, BookOpen, PlayCircle, Github } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: TreeDeciduous },
    { path: '/learn', label: 'Learn', icon: BookOpen },
    { path: '/playground', label: 'Playground', icon: PlayCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-muted/20 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <TreeDeciduous className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-foreground">
            MerkleTreeViz
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </nav>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-4 pb-8">
        {children}
      </main>
      <footer className="border-t border-muted/20 py-8">
        <div className="container mx-auto px-4 text-center text-muted text-sm">
          <p>© 2025 MerkleTreeViz. Built for educational purposes.</p>
        </div>
      </footer>
    </div>
  );
};