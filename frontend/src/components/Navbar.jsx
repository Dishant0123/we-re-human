import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, LayoutDashboard, Compass, MessageCircle, User, Settings, LogOut } from 'lucide-react';
import logo from '../assets/logo.svg';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-6xl bg-white/90 backdrop-blur-md border border-theme-border shadow-sm rounded-[20px] px-6 py-3 z-50 transition-all duration-300">
      <div className="flex justify-between items-center">
        
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex-shrink-0 transition-transform hover:scale-105">
          <img src={logo} alt="We're Human Logo" className="h-10 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-theme-grey">
          {user ? (
            <>
              <Link to="/dashboard" className={`flex items-center gap-2 hover:text-theme-teal transition-colors ${isActive('/dashboard') ? 'text-theme-teal' : ''}`}><LayoutDashboard size={18} /> Dashboard</Link>
              <Link to="/events" className={`flex items-center gap-2 hover:text-theme-teal transition-colors ${isActive('/events') ? 'text-theme-teal' : ''}`}><Compass size={18} /> Events</Link>
              <Link to="/chat" className={`flex items-center gap-2 hover:text-theme-teal transition-colors ${isActive('/chat') ? 'text-theme-teal' : ''}`}><MessageCircle size={18} /> Chat</Link>
              <Link to="/profile" className={`flex items-center gap-2 hover:text-theme-teal transition-colors ${isActive('/profile') ? 'text-theme-teal' : ''}`}><User size={18} /> Profile</Link>
              <Link to="/settings" className={`flex items-center gap-2 hover:text-theme-teal transition-colors ${isActive('/settings') ? 'text-theme-teal' : ''}`}><Settings size={18} /> Settings</Link>
              <div className="h-6 w-px bg-theme-border mx-2"></div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"><LogOut size={18} /> Log Out</button>
            </>
          ) : (
            <>
              <Link to="/about" className={`hover:text-theme-teal transition-colors ${isActive('/about') ? 'text-theme-teal' : ''}`}>About Us</Link>
              <Link to="/login" className="px-6 py-2.5 bg-theme-light text-theme-teal rounded-xl hover:bg-theme-teal-light transition-all border border-theme-teal-pale shadow-sm">Log In</Link>
              <Link to="/register" className="px-6 py-2.5 bg-theme-teal text-white rounded-xl hover:bg-theme-teal-dark transition-all shadow-md">Sign Up</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-theme-black hover:text-theme-teal transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      
      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[115%] left-0 w-full bg-white/95 backdrop-blur-xl border border-theme-border shadow-2xl rounded-[20px] p-5 flex flex-col gap-3 text-theme-grey font-medium z-[100] transition-all origin-top animate-in slide-in-from-top-2 fade-in duration-200">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-theme-teal-light hover:text-theme-teal"><LayoutDashboard size={20} /> Dashboard</Link>
              <Link to="/events" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-theme-teal-light hover:text-theme-teal"><Compass size={20} /> Events</Link>
              <Link to="/chat" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-theme-teal-light hover:text-theme-teal"><MessageCircle size={20} /> Chat</Link>
              <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-left rounded-xl text-red-500 hover:bg-red-50"><LogOut size={20} /> Log Out</button>
            </>
          ) : (
            <>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="p-3 rounded-xl hover:bg-theme-teal-light hover:text-theme-teal text-center">About Us</Link>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-center bg-theme-light text-theme-teal rounded-xl border border-theme-border">Log In</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-center bg-theme-teal text-white rounded-xl shadow-md">Sign Up</Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;