// Replace with your actual LIFF ID from LINE Developers Console
export const LIFF_ID = '2008852420-gFn29SXB'; 

// The Peer ID of the "Shop/Admin" device that receives the calls
// In a real app, this might be dynamic, but for this demo it is fixed.
export const ADMIN_PEER_ID = 'shop-admin-001';

// Server Configuration for Render.com
// When running locally, change secure to false and port to 9000
export const PEER_SERVER_CONFIG = {
  host: window.location.hostname, // connects to the same host serving the page
  port: window.location.port ? parseInt(window.location.port) : 443,
  path: '/peerjs',
  secure: window.location.protocol === 'https:',
  debug: 2
};

export const SHOP_GREETING_TEXT = 'ร้าน ABC สวัสดีครับ กำลังต่อสายไปยังเจ้าหน้าที่ กรุณารอสักครู่ครับ';