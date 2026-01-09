const express = require('express');
const { ExpressPeerServer } = require('peer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 9000;

// Enable CORS
app.use(cors());

// Serve static files (Frontend build) - Optional for signaling server
app.use(express.static(path.join(__dirname, '../dist')));

// Start the Express Server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initialize PeerJS Server via Middleware
// This connects the Peer functionality to the existing Express server
const peerServerMiddleware = ExpressPeerServer(server, {
  debug: true,
  path: '/' // This maps internally, but the route below handles the prefix
});

// Mount the PeerJS middleware
// Important: Client connects to https://your-render-url.com/peerjs
app.use('/peerjs', peerServerMiddleware);

// Handle PeerJS events
peerServerMiddleware.on('connection', (client) => {
  console.log('Peer connected:', client.getId());
});

peerServerMiddleware.on('disconnect', (client) => {
  console.log('Peer disconnected:', client.getId());
});

// Simple Health Check Route
app.get('/', (req, res) => {
  res.send({ status: 'OK', message: 'ShopCall Signaling Server is Running' });
});
