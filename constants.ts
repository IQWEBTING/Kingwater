// Replace with your actual LIFF ID from LINE Developers Console
export const LIFF_ID = '2008852420-gFn29SXB'; 

// The Peer ID of the "Shop/Admin" device that receives the calls
export const ADMIN_PEER_ID = 'shop-admin-001';

// Server Configuration
// Connecting to your custom Render server: https://kingwatercall.onrender.com
export const PEER_SERVER_CONFIG = {
  host: 'kingwatercall.onrender.com', // Domain without https://
  port: 443,                          // Standard HTTPS port
  path: '/peerjs',                    // The path defined in your server/index.js
  secure: true,                       // Render uses HTTPS by default
  debug: 2
};

export const SHOP_GREETING_TEXT = 'ร้าน ABC สวัสดีครับ กำลังต่อสายไปยังเจ้าหน้าที่ กรุณารอสักครู่ครับ';