import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http'; 
import { Server } from 'socket.io'; 

import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
// 2. Wrap Express inside an HTTP server
const httpServer = createServer(app); 

// 3. Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(helmet()); 
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// 4. The Real-Time Chat Logic
io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on('join_event_room', (eventId) => {
    socket.join(eventId);
    console.log(`👤 User joined Event Room: ${eventId}`);
  });

  // When someone sends a message
  socket.on('send_message', (data) => {
    // Expected data format: { eventId: "123", sender: "Red Cross", text: "Bring water!" }
    // Broadcast it to everyone else in that specific room
    socket.to(data.eventId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`🛑 Client disconnected: ${socket.id}`);
  });
});

const DB_URI = process.env.MONGO_URI;
console.log("Attempting to connect to:", DB_URI);


mongoose.connect(DB_URI)
  .then(() => {
    console.log('✅ Local MongoDB connected successfully.');
    
    // 5. IMPORTANT: Change app.listen to httpServer.listen
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server AND WebSockets are listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });