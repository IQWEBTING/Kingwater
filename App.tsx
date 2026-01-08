import React, { useEffect, useState } from 'react';
import LoginCard from './components/LoginCard';
import CallInterface from './components/CallInterface';
import { initLiff, isLoggedIn, getUserProfile, login, logout, getMockProfile } from './services/liffService';
import { UserProfile } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const initialize = async () => {
      // Attempt to initialize LIFF
      const liffInitialized = await initLiff();
      
      if (liffInitialized && isLoggedIn()) {
        const profile = await getUserProfile();
        setUser(profile);
      }
      setLoading(false);
    };

    initialize();
  }, []);

  const handleLogin = () => {
    setLoading(true);
    // In a real environment with valid LIFF ID:
    login();
    
    // For DEMO purposes only: Fallback if LIFF ID is invalid or running on localhost without https
    // Remove this timeout block in production
    setTimeout(() => {
        if (!isLoggedIn()) {
             console.warn("LIFF not configured or failed. Using Mock Profile.");
             setUser(getMockProfile());
             setLoading(false);
        }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-green-500/10 to-transparent pointer-events-none"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-400 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl opacity-10"></div>

      <main className="z-10 w-full px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center text-green-600">
             <i className="fas fa-circle-notch fa-spin text-4xl mb-4"></i>
             <p>Loading System...</p>
          </div>
        ) : !user ? (
          <LoginCard onLogin={handleLogin} loading={loading} />
        ) : (
          <CallInterface user={user} onLogout={logout} />
        )}
      </main>
    </div>
  );
};

export default App;