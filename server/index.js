const express = require('express');
const { PeerServer } = require('peer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 9000;

// Enable CORS
app.use(cors());

// Serve static files (Frontend build)
// Assumes the React build is in the 'dist' or 'build' folder at the root
app.use(express.static(path.join(__dirname, '../dist')));

// Start the Express Server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initialize PeerJS Server
// This handles the WebRTC signaling logic
const peerServer = PeerServer({
  port: PORT,
  path: '/peerjs',
  proxied: true, // Important for Render.com behind load balancers
  debug: true
});

// Mount PeerJS on the Express server (alternative method if using Express wrapper)
// However, the standard PeerServer runs standalone or attached via 'http' server.
// The `peer` library's `PeerServer` function actually creates a new server or wraps one.
// For integration with the SAME port as Express on Render:
// We use the 'ExpressPeerServer' middleware pattern.

const { ExpressPeerServer } = require('peer');

const peerServerMiddleware = ExpressPeerServer(server, {
  debug: true,
  path: '/peerjs' // This matches the client config
});

app.use('/peerjs', peerServerMiddleware);

// Handle PeerJS events
peerServerMiddleware.on('connection', (client) => {
  console.log('Peer connected:', client.getId());
});

peerServerMiddleware.on('disconnect', (client) => {
  console.log('Peer disconnected:', client.getId());
});

// Catch-all route for SPA (React Router)
app.get('*', (req, res) => {
    // If you build the react app to 'dist' folder
    const indexFile = path.join(__dirname, '../dist/index.html');
    // Check if file exists, else send simple message
    res.sendFile(indexFile, (err) => {
        if(err) res.status(200).send("Server is running. Deploy frontend build to /dist to see the app.");
    });
});
