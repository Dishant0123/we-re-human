import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, Users, Droplet, Plus, Leaf, Edit2, Trash2, XCircle } from 'lucide-react';
import CreatePostModal from '../components/CreatePostModal';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchDashboardData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        if (user.role === 'ngo_admin') {
          const res = await axios.get('http://localhost:5000/api/events/my-events', config);
          setData(res.data.events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } else {
          const res = await axios.get('http://localhost:5000/api/users/profile', config);
          setData(res.data.history || []); 
        }
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    fetchDashboardData();
  }, [user, navigate]);

  const handlePostCreated = (newEvent) => setData([newEvent, ...data]);
  const handlePostUpdated = (updatedEvent) => setData(data.map(item => item._id === updatedEvent._id ? updatedEvent : item));

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to permanently delete this initiative?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`http://localhost:5000/api/events/${eventId}`, config);
        setData(data.filter(item => item._id !== eventId));
      } catch (err) { alert('Failed to delete event.'); }
    }
  };

  const handleCancelEnrollment = async (eventId) => {
    if (window.confirm("Are you sure you want to drop out of this initiative?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`http://localhost:5000/api/events/${eventId}/register`, config);
        setData(data.filter(item => item._id !== eventId));
      } catch (err) { alert('Failed to cancel enrollment.'); }
    }
  };

  if (loading) return <div className="min-h-screen pt-40 text-center">Loading...</div>;

  return (
    <div className="min-h-screen pt-32 px-4 max-w-6xl mx-auto pb-12">
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEventToEdit(null); }} 
        onPostCreated={handlePostCreated} 
        onPostUpdated={handlePostUpdated}
        editData={eventToEdit} 
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-theme-border pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-theme-black tracking-tight mb-2">Hello, {user?.name}</h1>
          <p className="text-theme-grey text-lg">Manage your initiatives and impact.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-theme-teal text-white rounded-xl shadow-md hover:bg-theme-teal-dark font-medium">
          <Plus size={18} /> Create Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white/40 border border-theme-border border-dashed rounded-[24px] text-theme-grey">
            <Leaf size={48} className="text-theme-teal-pale mb-4" />
            <p className="text-lg font-medium">No activity found. Time to make an impact!</p>
          </div>
        ) : (
          data.map((item) => (
            <div key={item._id} className="flex flex-col bg-white/80 backdrop-blur-md border border-theme-border rounded-[24px] p-6 shadow-theme-glass hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 text-[10px] uppercase font-bold rounded-md ${item.category === 'Blood Request' ? 'bg-red-100 text-red-700' : 'bg-theme-teal-pale text-theme-teal-dark'}`}>
                  {item.category === 'Blood Request' ? 'Urgent Blood' : 'Event'}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-theme-black mb-2 leading-tight line-clamp-1">{item.title}</h3>
              <p className="text-theme-grey text-sm mb-6 flex-grow line-clamp-2">{item.description}</p>
              
              <div className="space-y-3 text-sm border-t border-theme-border pt-4 mt-auto">
                <div className="flex justify-between items-center text-theme-grey">
                  <div className="flex items-center gap-2"><MapPin size={16} /> {item.city}</div>
                  <div className="flex items-center gap-2"><Calendar size={16} /> {new Date(item.date).toLocaleDateString()}</div>
                </div>
                
                <div className="pt-4 flex gap-3">
                  {user.role === 'ngo_admin' ? (
                    <>
                      <button onClick={() => { setEventToEdit(item); setIsModalOpen(true); }} className="flex-1 flex items-center justify-center gap-2 py-2 bg-theme-light text-theme-teal-dark border border-theme-teal-pale rounded-lg font-medium hover:bg-theme-teal hover:text-white transition-colors"><Edit2 size={16} /> Edit</button>
                      <button onClick={() => handleDeleteEvent(item._id)} className="flex items-center justify-center p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </>
                  ) : (
                    <button onClick={() => handleCancelEnrollment(item._id)} className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-500 border border-red-100 rounded-lg font-medium hover:bg-red-500 hover:text-white transition-colors"><XCircle size={16} /> Cancel Enrollment</button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;