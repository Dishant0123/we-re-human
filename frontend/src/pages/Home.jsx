import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Home = () => {
  return (
    // 1. Pure white background overriding the global gradient for this specific page
    <div className="min-h-screen bg-white pt-32 px-4 flex flex-col items-center justify-center text-center pb-20 relative overflow-hidden">
      
      {/* Optional: Very subtle background glow to make it not feel flat */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-theme-teal-pale blur-[120px] opacity-20 rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Large Logo Display */}
        <img 
          src={logo} 
          alt="We're Human" 
          className="w-64 md:w-80 h-auto mb-10 drop-shadow-sm"
        />

        <h1 className="text-5xl md:text-7xl font-light text-theme-black tracking-tight mb-6">
          Be the <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-theme-teal to-theme-teal-dark">Changemaker</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-theme-grey font-light max-w-2xl leading-relaxed mb-12">
          Bridging the gap between intent and impact. Join a community of volunteers and NGOs dedicated to crafting a better world, together.
        </p>

        {/* Clear Calls to Action */}
        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
          <Link 
            to="/register" 
            className="px-10 py-4 bg-theme-teal text-white rounded-xl shadow-md hover:bg-theme-teal-dark hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-medium tracking-wide text-lg"
          >
            Start Your Journey
          </Link>
          <Link 
            to="/about" 
            className="px-10 py-4 bg-white text-theme-teal border-2 border-theme-teal-pale rounded-xl shadow-sm hover:bg-theme-light hover:-translate-y-1 transition-all duration-300 font-medium tracking-wide text-lg"
          >
            Learn More
          </Link>
        </div>
        
      </div>
    

    </div>
  );
};

export default Home;