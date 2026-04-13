import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-6 border-t border-theme-border bg-white/50 backdrop-blur-sm mt-auto relative z-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-theme-grey text-sm">
        <p>&copy; {new Date().getFullYear()} We're Human. All rights reserved.</p>
        <p className="flex items-center gap-1.5 font-medium">
          Made with <Heart size={14} className="text-red-500 fill-red-500" /> by <span className="text-theme-teal-dark">Dishant</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;