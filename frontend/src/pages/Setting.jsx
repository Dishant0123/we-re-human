import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { User, Lock, Moon, Bell, CheckCircle } from 'lucide-react';

const Setting = () => {
  const { user, login } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('account');
  
  // States for Account Tab
  const [name, setName] = useState(user?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // States for Appearance/Preferences Tab (Saved to LocalStorage)
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [notifications, setNotifications] = useState(localStorage.getItem('notifications') !== 'false');

  // Handle Dark Mode Toggle Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Handle Notification Toggle Effect
  useEffect(() => {
    localStorage.setItem('notifications', notifications);
  }, [notifications]);

  // Handle Profile Update Submission
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.put('http://localhost:5000/api/users/profile', { name }, config);
      
      // Update the global context so the navbar updates instantly!
      login({ ...user, name: response.data.user.name });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const tabs = [
    { id: 'account', icon: <User size={18} />, label: 'Account Details' },
    { id: 'security', icon: <Lock size={18} />, label: 'Security' },
    { id: 'preferences', icon: <Moon size={18} />, label: 'Preferences' }
  ];

  return (
    <div className="min-h-screen pt-32 px-4 max-w-4xl mx-auto pb-12">
      <h1 className="text-4xl font-semibold text-theme-black tracking-tight mb-8">Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-2 flex-shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-theme-teal text-white shadow-md' 
                  : 'bg-white/60 text-theme-grey hover:bg-white/90 border border-transparent hover:border-theme-border'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-grow bg-white/70 backdrop-blur-md border border-theme-border rounded-[24px] shadow-theme-glass p-8 min-h-[400px]">
          
          {/* Success/Error Notifications */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 text-sm font-medium border ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
            }`}>
              {message.type === 'success' && <CheckCircle size={18} />}
              {message.text}
            </div>
          )}

          {/* TAB 1: ACCOUNT DETAILS */}
          {activeTab === 'account' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-2xl font-semibold text-theme-black mb-6">Profile Information</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-theme-grey mb-1 ml-1">Full Name / Organization</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-teal-pale"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-theme-grey mb-1 ml-1">Email Address (Non-editable)</label>
                  <input 
                    type="email" 
                    disabled 
                    value={user?.email || ''} 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-theme-border text-gray-500 cursor-not-allowed"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="mt-4 px-8 py-3 bg-theme-teal text-white rounded-xl shadow-md hover:bg-theme-teal-dark transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: SECURITY */}
          {activeTab === 'security' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-2xl font-semibold text-theme-black mb-6">Update Password</h2>
              <p className="text-theme-grey text-sm mb-6">To maintain security, please contact system administration to request a password reset link, or implement the email-verification flow.</p>
              <button disabled className="px-8 py-3 bg-theme-light text-theme-grey border border-theme-border rounded-xl font-medium cursor-not-allowed">
                Request Password Reset
              </button>
            </div>
          )}

          {/* TAB 3: PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-2xl font-semibold text-theme-black mb-6">App Preferences</h2>
              <div className="space-y-4 max-w-md">
                
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-theme-border">
                  <div className="flex items-center gap-3 text-theme-black font-medium">
                    <Moon className="text-theme-teal" size={20} /> Dark Mode
                  </div>
                  <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-theme-teal' : 'bg-theme-border'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                {/* Notifications Toggle */}
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-theme-border">
                  <div className="flex items-center gap-3 text-theme-black font-medium">
                    <Bell className="text-theme-teal" size={20} /> Push Notifications
                  </div>
                  <button 
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${notifications ? 'bg-theme-teal' : 'bg-theme-border'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Setting;