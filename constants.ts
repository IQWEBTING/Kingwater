// Replace with your actual LIFF ID from LINE Developers Console
export const LIFF_ID = '2008852420-gFn29SXB'; 

// The Peer ID of the "Shop/Admin" device that receives the calls
export const ADMIN_PEER_ID = 'shop-admin-001';

// Server Configuration
// For Vercel deployment, we must use the public PeerJS Cloud because 
// Vercel does not support hosting a persistent WebSocket server (Node.js).
export const PEER_SERVER_CONFIG = {
  host: '0.peerjs.com',
  port: 443,
  path: '/',
  secure: true,
  debug: 2
};

export const SHOP_GREETING_TEXT = 'ร้าน ABC สวัสดีครับ กำลังต่อสายไปยังเจ้าหน้าที่ กรุณารอสักครู่ครับ';