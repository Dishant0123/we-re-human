import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Heart, Building2 } from 'lucide-react';

const Register = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  // If already logged in, redirect away from register page
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'volunteer' // default role
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post('https://we-re-human-1.onrender.com/api/auth/register', formData);
      
      // Auto-login the user immediately after successful registration
      login(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-4 flex items-center justify-center pb-12">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-theme-border rounded-[24px] shadow-theme-glass p-10">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-theme-black tracking-tight mb-2">Join the Movement</h2>
          <p className="text-theme-grey text-sm">Create an account to start making an impact.</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          
          {/* Role Toggle */}
          <div className="flex gap-4 mb-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'volunteer' })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all text-sm border ${
                formData.role === 'volunteer' 
                  ? 'bg-theme-teal text-white border-theme-teal shadow-md' 
                  : 'bg-white text-theme-grey border-theme-border hover:bg-theme-light'
              }`}
            >
              <Heart size={16} /> Volunteer
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'ngo_admin' })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all text-sm border ${
                formData.role === 'ngo_admin' 
                  ? 'bg-theme-teal-dark text-white border-theme-teal-dark shadow-md' 
                  : 'bg-white text-theme-grey border-theme-border hover:bg-theme-light'
              }`}
            >
              <Building2 size={16} /> NGO
            </button>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-theme-grey mb-1 ml-1">
              {formData.role === 'volunteer' ? 'Full Name' : 'Organization Name'}
            </label>
            <input 
              type="text" required
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-teal-pale focus:border-theme-teal transition-all"
              placeholder={formData.role === 'volunteer' ? "Jane Doe" : "Red Cross"}
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-theme-grey mb-1 ml-1">Email Address</label>
            <input 
              type="email" required
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-teal-pale focus:border-theme-teal transition-all"
              placeholder="hello@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-theme-grey mb-1 ml-1">Password</label>
            <input 
              type="password" required minLength="6"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-teal-pale focus:border-theme-teal transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 text-center">{error}</div>}

          <button 
            type="submit" disabled={isLoading}
            className="mt-2 w-full py-4 bg-theme-teal text-white rounded-xl font-medium shadow-md hover:bg-theme-teal-dark hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-theme-grey">
          Already have an account? <Link to="/login" className="text-theme-teal font-medium hover:underline">Log in here</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;