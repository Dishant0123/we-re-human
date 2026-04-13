import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import About from './pages/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EventExplore from './pages/EventExplore';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Setting from './pages/Setting';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-theme-light via-[#ffffff] to-theme-teal-light text-theme-black font-sans selection:bg-theme-teal-pale selection:text-theme-teal-dark">
        <Navbar />
        
        <main className="w-full relative z-10 flex-grow pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} /> 
            <Route path="/events" element={<EventExplore />} />
            <Route path="/explore" element={<EventExplore />} /> 
            
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Setting /></ProtectedRoute>} />
            
            <Route path="*" element={<div className="pt-40 text-center text-theme-grey text-xl font-medium">404: Page not found</div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;