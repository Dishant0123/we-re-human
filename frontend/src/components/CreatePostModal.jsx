import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { X, Droplet, Calendar as CalendarIcon } from 'lucide-react';

const CreatePostModal = ({ isOpen, onClose, onPostCreated, onPostUpdated, editData }) => {
  const { user } = useContext(AuthContext);
  const [postType, setPostType] = useState('event');
  const [formData, setFormData] = useState({ title: '', description: '', city: '', date: '', volunteerCapacity: '', bloodGroup: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editData) {
      setPostType(editData.category === 'Blood Request' ? 'blood' : 'event');
      setFormData({
        title: editData.title || '', description: editData.description || '', city: editData.city || '',
        date: editData.date ? new Date(editData.date).toISOString().slice(0, 16) : '',
        volunteerCapacity: editData.volunteerCapacity || '', bloodGroup: editData.bloodGroup || ''
      });
    } else {
      setFormData({ title: '', description: '', city: '', date: '', volunteerCapacity: '', bloodGroup: '' });
      setPostType('event');
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = {
        title: formData.title, description: formData.description, city: formData.city,
        date: new Date(formData.date).toISOString(), category: postType === 'blood' ? 'Blood Request' : 'Custom',
        volunteerCapacity: postType === 'blood' ? 1 : Number(formData.volunteerCapacity),
        bloodGroup: postType === 'blood' ? formData.bloodGroup : undefined
      };

      if (editData) {
        const res = await axios.put(`https://we-re-human-1.onrender.com/api/events/${editData._id}`, payload, config);
        onPostUpdated(res.data.event);
      } else {
        const res = await axios.post('https://we-re-human-1.onrender.com/api/events', payload, config);
        onPostCreated(res.data.event);
      }
      onClose(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-theme-black/40 backdrop-blur-sm p-4">
      <div className="bg-white/90 backdrop-blur-xl border border-theme-border w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-theme-border bg-white/50">
          <h2 className="text-xl font-semibold text-theme-black">{editData ? 'Edit Details' : 'Create New Post'}</h2>
          <button onClick={onClose} className="p-2 text-theme-grey hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"><X size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto">
          <form id="createPostForm" onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div><label className="block text-theme-grey mb-1 ml-1 font-medium">Title / Patient Name</label><input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white border border-theme-border focus:ring-2 focus:ring-theme-teal-pale focus:outline-none" /></div>
            <div><label className="block text-theme-grey mb-1 ml-1 font-medium">Description</label><textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white border border-theme-border focus:ring-2 focus:ring-theme-teal-pale focus:outline-none"></textarea></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-theme-grey mb-1 ml-1 font-medium">City</label><input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white border border-theme-border focus:ring-2 focus:ring-theme-teal-pale focus:outline-none" /></div>
              <div><label className="block text-theme-grey mb-1 ml-1 font-medium">Date Required</label><input required type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white border border-theme-border focus:ring-2 focus:ring-theme-teal-pale focus:outline-none" /></div>
            </div>
            {postType === 'event' ? (
              <div><label className="block text-theme-grey mb-1 ml-1 font-medium">Capacity</label><input required type="number" min="1" value={formData.volunteerCapacity} onChange={e => setFormData({...formData, volunteerCapacity: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white border border-theme-border focus:ring-2 focus:ring-theme-teal-pale focus:outline-none" /></div>
            ) : (
              <div><label className="block text-theme-grey mb-1 ml-1 font-medium">Blood Group</label><select required value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white border border-theme-border focus:ring-2 focus:ring-theme-teal-pale focus:outline-none">{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}</select></div>
            )}
          </form>
        </div>
        <div className="p-4 border-t border-theme-border bg-theme-light flex justify-end gap-3">
          <button onClick={onClose} type="button" className="px-6 py-2.5 text-theme-grey font-medium hover:bg-white rounded-xl transition-colors">Cancel</button>
          <button form="createPostForm" type="submit" disabled={loading} className="px-6 py-2.5 bg-theme-teal text-white font-medium rounded-xl shadow-md hover:bg-theme-teal-dark transition-colors disabled:opacity-50">{loading ? 'Saving...' : editData ? 'Update Post' : 'Publish Post'}</button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;