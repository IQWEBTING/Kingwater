import React, { useEffect, useState } from 'react';
import CallInterface from './components/CallInterface';
import { initLiff, isLoggedIn, getUserProfile, login, logout } from './services/liffService';
import { UserProfile } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        // Attempt to initialize LIFF
        const liffInitialized = await initLiff();
        
        if (!liffInitialized) {
          setError('ไม่สามารถเชื่อมต่อกับ LINE ได้ (LIFF Init Failed)');
          setLoading(false);
          return;
        }

        // Check if user is logged in
        if (isLoggedIn()) {
          const profile = await getUserProfile();
          if (profile) {
            setUser(profile);
          } else {
            setError('ไม่สามารถดึงข้อมูลโปรไฟล์ได้');
          }
          setLoading(false);
        } else {
          // Auto Login immediately if not logged in
          // This will trigger a redirect, so we keep loading = true
          login();
        }
      } catch (err) {
        console.error(err);
        setError('เกิดข้อผิดพลาดในระบบ');
        setLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-green-500/10 to-transparent pointer-events-none"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-400 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl opacity-10"></div>

      <main className="z-10 w-full px-4">
        {loading || (!user && !error) ? (
          <div className="flex flex-col items-center justify-center text-green-600">
             <i className="fas fa-circle-notch fa-spin text-4xl mb-4"></i>
             <p>กำลังตรวจสอบข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-sm mx-auto">
            <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-3"></i>
            <p className="text-gray-700 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="text-blue-500 underline">ลองใหม่อีกครั้ง</button>
          </div>
        ) : (
          <CallInterface user={user!} onLogout={logout} />
        )}
      </main>
    </div>
  );
};

export default App;