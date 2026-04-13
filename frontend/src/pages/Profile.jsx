import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Activity } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div className="pt-40 text-center">Please log in.</div>;

  return (
    <div className="min-h-screen pt-32 px-4 max-w-3xl mx-auto">
      <h1 className="text-4xl font-semibold text-theme-black tracking-tight mb-8">My Profile</h1>
      
      <div className="bg-white/70 backdrop-blur-md border border-theme-border rounded-[24px] p-8 shadow-theme-glass">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-theme-border">
          <div className="w-24 h-24 bg-gradient-to-br from-theme-teal to-theme-teal-dark rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-theme-black">{user.name}</h2>
            <p className="text-theme-teal font-medium capitalize">{user.role.replace('_', ' ')}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 text-theme-grey">
            <Mail className="text-theme-teal" size={20}/>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider">Email Address</p>
              <p className="text-theme-black">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-theme-grey">
            <Shield className="text-theme-teal" size={20}/>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider">Account Status</p>
              <p className="text-theme-black">Verified & Active</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-theme-grey">
            <Activity className="text-theme-teal" size={20}/>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider">Member Since</p>
              <p className="text-theme-black">2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;