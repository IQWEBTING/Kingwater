import React, { useEffect, useState, useRef } from 'react';
import { UserProfile, CallStatus } from '../types';
import Peer, { MediaConnection, DataConnection } from 'peerjs';
import { PEER_SERVER_CONFIG, ADMIN_PEER_ID, SHOP_GREETING_TEXT } from '../constants';

interface CallInterfaceProps {
  user: UserProfile;
  onLogout: () => void;
}

const CallInterface: React.FC<CallInterfaceProps> = ({ user, onLogout }) => {
  const [status, setStatus] = useState<CallStatus>(CallStatus.IDLE);
  const [peerId, setPeerId] = useState<string>('');
  const [peerError, setPeerError] = useState<string>('');
  
  const peerRef = useRef<Peer | null>(null);
  const callRef = useRef<MediaConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize PeerJS
  useEffect(() => {
    const initPeer = async () => {
      try {
        // Dynamic import if needed, but standard import works in most bundles
        const PeerJs = (await import('peerjs')).default;
        
        const peer = new PeerJs(undefined, PEER_SERVER_CONFIG);

        peer.on('open', (id) => {
          console.log('My Peer ID:', id);
          setPeerId(id);
        });

        peer.on('error', (err) => {
          console.error('Peer error:', err);
          setPeerError('Connection error: ' + err.type);
          setStatus(CallStatus.FAILED);
        });

        peerRef.current = peer;
      } catch (e) {
        console.error("Failed to load PeerJS", e);
      }
    };

    initPeer();

    return () => {
      endCall();
      peerRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playGreeting = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(SHOP_GREETING_TEXT);
      utterance.lang = 'th-TH'; // Thai language
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startCall = async () => {
    if (!peerRef.current) return;
    setPeerError('');

    try {
      setStatus(CallStatus.CONNECTING);
      
      // 1. Get Local Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;

      // 2. Send Data (Profile) before calling media
      const conn: DataConnection = peerRef.current.connect(ADMIN_PEER_ID);
      conn.on('open', () => {
        conn.send({
          type: 'CLIENT_PROFILE',
          profile: user
        });
      });

      // 3. Start Media Call
      const call = peerRef.current.call(ADMIN_PEER_ID, stream);
      
      call.on('stream', (remoteStream) => {
        setStatus(CallStatus.CONNECTED);
        playGreeting(); // Play automated greeting
        
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream;
          remoteAudioRef.current.play();
        }
      });

      call.on('close', () => {
        endCall();
      });

      call.on('error', (err) => {
        console.error('Call error', err);
        setStatus(CallStatus.FAILED);
      });

      callRef.current = call;
      setStatus(CallStatus.RINGING);

    } catch (err) {
      console.error('Failed to get local stream', err);
      setPeerError('Microphone access denied or error occurred.');
      setStatus(CallStatus.FAILED);
    }
  };

  const endCall = () => {
    callRef.current?.close();
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    window.speechSynthesis.cancel();
    setStatus(CallStatus.IDLE);
    callRef.current = null;
    localStreamRef.current = null;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4">
      {/* Header Profile */}
      <div className="glass-panel w-full rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img 
            src={user.pictureUrl || 'https://picsum.photos/100'} 
            alt={user.displayName} 
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div>
            <p className="text-sm text-gray-500">สวัสดี,</p>
            <p className="font-bold text-gray-800">{user.displayName}</p>
          </div>
        </div>
        <button onClick={onLogout} className="text-gray-400 hover:text-red-500">
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>

      {/* Main Call Action Area */}
      <div className="relative w-full aspect-square max-w-[300px] flex items-center justify-center mb-8">
        {/* Status Rings */}
        {status === CallStatus.RINGING && (
          <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-ping-slow"></div>
        )}
        {status === CallStatus.CONNECTED && (
          <div className="absolute inset-0 bg-green-500 rounded-full opacity-10 animate-pulse-slow"></div>
        )}

        {/* Dynamic Center Visual */}
        <div className="flex flex-col items-center z-10">
          {status === CallStatus.IDLE && (
            <div className="w-48 h-48 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-gray-50">
              <i className="fas fa-headset text-6xl text-green-500"></i>
            </div>
          )}
          
          {(status === CallStatus.RINGING || status === CallStatus.CONNECTING) && (
             <div className="w-48 h-48 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-yellow-100 relative">
                {/* Changed to Headset Icon for 'Calling Agent' visualization */}
                <i className="fas fa-headset text-7xl text-gray-300 animate-pulse"></i>
                
                {/* Overlay Status Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fas fa-phone text-3xl text-yellow-500 animate-bounce drop-shadow-md"></i>
                </div>
             </div>
          )}

          {status === CallStatus.CONNECTED && (
            <div className="w-48 h-48 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-green-400">
               {/* Changed to Green Headset Icon for Connected state */}
               <i className="fas fa-headset text-7xl text-green-500 animate-pulse"></i>
               <div className="absolute bottom-10 right-10">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
               </div>
            </div>
          )}
           
           {/* Status Text */}
           <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {status === CallStatus.IDLE && "ศูนย์บริการลูกค้า"}
                {status === CallStatus.CONNECTING && "กำลังเชื่อมต่อ..."}
                {status === CallStatus.RINGING && "กำลังติดต่อเจ้าหน้าที่..."}
                {status === CallStatus.CONNECTED && "สนทนากับเจ้าหน้าที่"}
                {status === CallStatus.FAILED && "การเชื่อมต่อล้มเหลว"}
              </h2>
              <p className="text-gray-500 mt-1">
                {status === CallStatus.IDLE && "กดปุ่มด้านล่างเพื่อโทรฟรี"}
                {status === CallStatus.CONNECTED && "Connected"} 
                {status === CallStatus.FAILED && peerError}
              </p>
           </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="w-full max-w-[280px]">
        {status === CallStatus.IDLE || status === CallStatus.FAILED ? (
          <button
            onClick={startCall}
            disabled={!peerId}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl py-5 text-xl font-bold shadow-lg shadow-green-200 transform transition hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
          >
            <i className="fas fa-phone-alt"></i>
            โทรหาเจ้าหน้าที่
          </button>
        ) : (
          <button
            onClick={endCall}
            className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl py-5 text-xl font-bold shadow-lg shadow-red-200 transform transition active:scale-95 flex items-center justify-center gap-3"
          >
            <i className="fas fa-phone-slash"></i>
            วางสาย
          </button>
        )}
      </div>

      {/* Hidden Audio Element for Remote Stream */}
      <audio ref={remoteAudioRef} autoPlay className="hidden" />
      
      {/* Connection Info */}
      <div className="mt-8 text-xs text-gray-400 text-center">
         Status: {peerId ? 'Online' : 'Offline'} • ID: {peerId ? peerId.substring(0,8) + '...' : 'Connecting...'}
      </div>
    </div>
  );
};

export default CallInterface;