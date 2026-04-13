import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Smart routing: If already logged in, redirect away from the login page
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setError(null);
    setIsLoading(true);

    try {
      // Hit your Express backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      // If successful, save the token/user data to Context and LocalStorage
      login(response.data);
      
      // Redirect to the Dashboard
      navigate('/dashboard');
    } catch (err) {
      // If the backend sends a 401 or 404, display the error message safely
      setError(err.response?.data?.message || 'Invalid credentials or server error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-4 flex items-center justify-center pb-12">
      {/* Floating Glass Card */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-theme-border rounded-[24px] shadow-theme-glass p-10">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-theme-black tracking-tight mb-2">Welcome Back</h2>
          <p className="text-theme-grey text-sm">Log in to continue your impact.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-theme-grey mb-1 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-teal-pale focus:border-theme-teal transition-all"
              placeholder="hello@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-theme-grey mb-1 ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-teal-pale focus:border-theme-teal transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-2 w-full py-4 bg-theme-teal text-white rounded-xl font-medium shadow-md hover:bg-theme-teal-dark hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Log In'}
          </button>
        </form>

        {/* Dynamic Link to Register Page */}
        <p className="mt-6 text-center text-sm text-theme-grey">
          Don't have an account? <Link to="/register" className="text-theme-teal font-medium hover:underline">Register here</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;