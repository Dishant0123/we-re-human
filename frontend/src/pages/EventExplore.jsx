import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, MapPin, Calendar, Users, CheckCircle, Droplet, ArrowDown } from 'lucide-react';

const EventExplore = () => {
  const { user } = useContext(AuthContext);
  
  // Data States
  const [allEvents, setAllEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Infinite Scroll States
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // 1. Fetch ALL events (Bulletproofed)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events');
        
        // Debugging log: Let's see exactly what the backend is sending
        console.log("Raw Backend Response:", res.data);

        // Safely extract the array whether the backend sends {events: []} or just []
        const eventArray = Array.isArray(res.data.events) ? res.data.events : 
                           Array.isArray(res.data) ? res.data : [];

        // Safely sort (fall back to the event date if createdAt is missing)
        const sortedEvents = [...eventArray].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.date);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.date);
          return dateB - dateA;
        });

        setAllEvents(sortedEvents);
      } catch (err) {
        console.error("Failed to load events:", err);
        setError('Failed to load events. Please check the console.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 2. Filter logic (Bulletproofed against missing fields)
  const filteredEvents = allEvents.filter(event => {
    // If a title or city is missing in the database, default to an empty string so it doesn't crash
    const safeTitle = event.title || '';
    const safeCity = event.city || '';
    const query = searchQuery.toLowerCase();
    
    return safeTitle.toLowerCase().includes(query) || safeCity.toLowerCase().includes(query);
  });

  // Reset page to 1 if the user starts typing a new search
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // 3. The Infinite Scroll Slice
  const displayedEvents = filteredEvents.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = displayedEvents.length < filteredEvents.length;

  // 4. The Intersection Observer Magic (Watches the bottom of the list)
  const observer = useRef();
  const lastEventElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        // When the user hits the bottom, increase the page number!
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // 5. Handle Volunteer Registration
  const handleRegister = async (eventId) => {
    setError(null);
    setSuccessMsg(null);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`http://localhost:5000/api/events/${eventId}/register`, {}, config);
      
      setSuccessMsg('Successfully joined the initiative!');
      
      // Instantly update the UI state
      setAllEvents(prevEvents => prevEvents.map(ev => 
        ev._id === eventId 
          ? { ...ev, registeredVolunteers: [...ev.registeredVolunteers, user._id] } 
          : ev
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register.');
    }
  };

  if (loading) return <div className="min-h-screen pt-40 text-center text-theme-grey">Discovering initiatives...</div>;

  return (
    <div className="min-h-screen pt-32 px-4 max-w-3xl mx-auto pb-20"> {/* max-w-3xl for a sleek center feed */}
      
      {/* Header & Search Section */}
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-6 sticky top-24 z-20 bg-[#fcfbf9]/90 backdrop-blur-md py-4 border-b border-theme-border">
        <div>
          <h1 className="text-4xl font-semibold text-theme-black tracking-tight mb-2">Explore</h1>
          <p className="text-theme-grey text-lg">Scroll to discover opportunities.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-grey" size={20} />
          <input 
            type="text" 
            placeholder="Search city or title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-theme-border shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-teal transition-all"
          />
        </div>
      </div>

      {/* Notifications */}
      {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">{error}</div>}
      {successMsg && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-center gap-2"><CheckCircle size={20}/> {successMsg}</div>}

      {/* Infinite Vertical Feed List */}
      <div className="flex flex-col gap-8">
        {displayedEvents.length === 0 ? (
          <div className="py-20 text-center text-theme-grey text-lg bg-white/40 rounded-[24px] border border-theme-border border-dashed">
            No initiatives found matching your search.
          </div>
        ) : (
          displayedEvents.map((event, index) => {
            const isFull = event.registeredVolunteers?.length >= event.volunteerCapacity;
            const isRegistered = user && event.registeredVolunteers?.includes(user._id);
            const isBloodRequest = event.category === 'Blood Request';
            
            // Check if this is the very last element in our currently displayed array
            const isLastElement = displayedEvents.length === index + 1;

            return (
              <div 
                key={event._id} 
                ref={isLastElement ? lastEventElementRef : null} // Attach the observer to the last item
                className="flex flex-col bg-white/80 backdrop-blur-md border border-theme-border rounded-[24px] p-8 shadow-theme-glass hover:shadow-lg transition-all duration-300"
              >
                
                {/* Header Badge */}
                <div className="mb-4 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${isBloodRequest ? 'bg-red-50 text-red-500' : 'bg-theme-teal-light text-theme-teal'}`}>
                      {isBloodRequest ? <Droplet size={24} /> : <Calendar size={24} />}
                    </div>
                    <div>
                      <span className={`text-[10px] uppercase tracking-wider font-bold rounded-md ${isBloodRequest ? 'text-red-600' : 'text-theme-teal-dark'}`}>
                        {isBloodRequest ? 'Urgent Blood Need' : 'Community Event'}
                      </span>
                      <div className="flex items-center text-xs text-theme-grey mt-1 gap-1">
                        <MapPin size={12} /> {event.city} • {new Date(event.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                    event.status === 'completed' ? 'bg-gray-50 text-gray-500 border-gray-200' :
                    event.status === 'ongoing' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-white text-theme-black border-theme-border shadow-sm'
                  }`}>
                    {event.status?.toUpperCase() || 'UPCOMING'}
                  </span>
                </div>
                
                <h3 className="text-2xl font-semibold text-theme-black mb-3 leading-tight">{event.title}</h3>
                <p className="text-theme-grey text-base mb-6 leading-relaxed">{event.description}</p>
                
                {/* Footer Stats & Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-theme-border pt-6">
                  
                  {isBloodRequest ? (
                    <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 px-4 py-2 rounded-xl w-full sm:w-auto justify-center">
                      <Droplet size={18} /> {event.bloodGroup || 'Any'} Needed
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-theme-teal-dark font-medium bg-theme-teal-light px-4 py-2 rounded-xl w-full sm:w-auto justify-center">
                      <Users size={18} /> {event.registeredVolunteers?.length || 0} / {event.volunteerCapacity} Volunteers
                    </div>
                  )}

                  {/* Dynamic Action Button */}
                  <div className="w-full sm:w-auto">
                    {!user ? (
                      <button disabled className="w-full px-8 py-3 bg-gray-100 text-gray-500 rounded-xl text-sm font-medium">Log in to Register</button>
                    ) : user.role === 'ngo_admin' ? (
                      <button disabled className="w-full px-8 py-3 bg-theme-light text-theme-grey border border-theme-border rounded-xl text-sm font-medium">NGOs cannot register</button>
                    ) : isRegistered ? (
                      <button disabled className="w-full px-8 py-3 bg-green-50 text-green-600 border border-green-200 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                        <CheckCircle size={18} /> Joined
                      </button>
                    ) : event.status === 'completed' ? (
                      <button disabled className="w-full px-8 py-3 bg-gray-100 text-gray-500 rounded-xl text-sm font-medium">Closed</button>
                    ) : isFull && !isBloodRequest ? (
                      <button disabled className="w-full px-8 py-3 bg-red-50 text-red-500 rounded-xl text-sm font-medium">Event Full</button>
                    ) : (
                      <button 
                        onClick={() => handleRegister(event._id)}
                        className="w-full px-8 py-3 bg-theme-teal text-white rounded-xl text-sm font-medium shadow-md hover:bg-theme-teal-dark hover:shadow-lg transition-all duration-300"
                      >
                        {isBloodRequest ? 'I Can Donate' : 'Join Initiative'}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Loading Indicator at bottom */}
      {hasMore && displayedEvents.length > 0 && (
        <div className="mt-8 flex flex-col items-center justify-center text-theme-teal opacity-50 animate-pulse">
          <ArrowDown size={24} className="mb-2" />
          <p className="text-sm font-medium text-theme-grey">Loading more...</p>
        </div>
      )}
      
      {!hasMore && displayedEvents.length > 0 && (
        <div className="mt-12 text-center text-theme-grey text-sm">
          --ooo--
        </div>
      )}

    </div>
  );
};

export default EventExplore;