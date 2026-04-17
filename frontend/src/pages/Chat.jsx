import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Send, MessageCircle, Users, Hash } from 'lucide-react';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [socket, setSocket] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);

  // 1. Fetch User's Events & Initialize Socket
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Connect to the WebSocket server
    const newSocket = io('https://we-re-human-1.onrender.com');
    setSocket(newSocket);

    // Fetch the events to populate the sidebar
    const fetchChatRooms = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const endpoint = user.role === 'ngo_admin' 
          ? 'https://we-re-human-1.onrender.com/api/events/my-events' 
          : 'https://we-re-human-1.onrender.com/api/users/profile';
          
        const res = await axios.get(endpoint, config);
        setEvents(user.role === 'ngo_admin' ? res.data.events : res.data.history);
      } catch (err) {
        console.error("Failed to load chat rooms", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();

    // Cleanup socket on unmount
    return () => newSocket.disconnect();
  }, [user, navigate]);

  // 2. Listen for Incoming Messages
  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off('receive_message');
  }, [socket]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Join a Specific Event Room
  const joinRoom = (event) => {
    if (selectedEvent?._id === event._id) return;
    
    setSelectedEvent(event);
    setMessages([]); // Clear previous chat history for the UI
    
    // Tell the backend to put this user in this specific event's socket room
    socket.emit('join_event_room', event._id);
  };

  // 4. Send a Message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (currentMessage.trim() === '' || !selectedEvent) return;

    const messageData = {
      eventId: selectedEvent._id,
      sender: user.name,
      text: currentMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderId: user._id // To align messages left/right
    };

    // Send to backend via socket
    socket.emit('send_message', messageData);
    
    // Immediately display it on our own screen
    setMessages((prev) => [...prev, messageData]);
    setCurrentMessage('');
  };

  if (loading) return <div className="min-h-screen pt-40 text-center text-theme-grey">Connecting to live servers...</div>;

  return (
    <div className="min-h-screen pt-32 px-4 max-w-6xl mx-auto flex flex-col h-screen pb-6">
      <div className="mb-6">
        <h1 className="text-4xl font-semibold text-theme-black tracking-tight mb-2">Communications</h1>
        <p className="text-theme-grey text-lg">Coordinate in real-time with your initiative members.</p>
      </div>

      {/* Main Chat Interface - Split layout */}
      <div className="flex-grow flex flex-col md:flex-row gap-6 bg-white/50 backdrop-blur-md border border-theme-border rounded-[24px] shadow-theme-glass overflow-hidden h-[600px]">
        
        {/* LEFT PANE: Event Room Selector */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-theme-border bg-white/40 overflow-y-auto">
          <div className="p-4 border-b border-theme-border bg-white/60 sticky top-0">
            <h2 className="font-semibold text-theme-black flex items-center gap-2"><Hash size={18} /> Active Rooms</h2>
          </div>
          
          <div className="p-2 space-y-2">
            {events.length === 0 ? (
              <p className="p-4 text-sm text-theme-grey text-center">No active initiatives found.</p>
            ) : (
              events.map((event) => (
                <button
                  key={event._id}
                  onClick={() => joinRoom(event)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                    selectedEvent?._id === event._id 
                      ? 'bg-theme-teal text-white shadow-md' 
                      : 'hover:bg-theme-teal-light text-theme-black'
                  }`}
                >
                  <h3 className="font-medium truncate">{event.title}</h3>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${selectedEvent?._id === event._id ? 'text-theme-teal-light' : 'text-theme-grey'}`}>
                    <Users size={12} /> {event.city}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANE: The Live Chat */}
        <div className="w-full md:w-2/3 flex flex-col bg-[#fcfbf9]/50 relative">
          {!selectedEvent ? (
            <div className="flex-grow flex flex-col items-center justify-center text-theme-grey">
              <MessageCircle size={48} className="text-theme-teal-pale mb-4" />
              <p>Select an initiative to start chatting.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-theme-border bg-white/60 backdrop-blur-sm shadow-sm z-10">
                <h2 className="font-semibold text-theme-black">{selectedEvent.title}</h2>
                <p className="text-xs text-theme-teal-dark font-medium">Live Connection Established</p>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-theme-grey text-sm mt-10">
                    This is the start of the conversation for <strong>{selectedEvent.title}</strong>.
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe = msg.senderId === user._id;
                    return (
                      <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-theme-grey mb-1 ml-1">{msg.sender} • {msg.time}</span>
                        <div className={`px-4 py-2.5 rounded-[18px] max-w-[80%] shadow-sm text-sm ${
                          isMe 
                            ? 'bg-theme-teal text-white rounded-br-sm' 
                            : 'bg-white border border-theme-border text-theme-black rounded-bl-sm'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white/60 border-t border-theme-border">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow px-4 py-3 rounded-full bg-white border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-teal-pale focus:border-theme-teal transition-all text-sm"
                  />
                  <button 
                    type="submit" 
                    disabled={!currentMessage.trim()}
                    className="p-3 bg-theme-teal text-white rounded-full hover:bg-theme-teal-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-md hover:shadow-lg"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;