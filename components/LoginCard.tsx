import React from 'react';

interface LoginCardProps {
  onLogin: () => void;
  loading: boolean;
}

const LoginCard: React.FC<LoginCardProps> = ({ onLogin, loading }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-md">
      <div className="glass-panel rounded-3xl p-8 w-full shadow-2xl text-center transform transition-all hover:scale-105 duration-300">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" 
            alt="LINE" 
            className="w-24 h-24 mx-auto relative z-10"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">ยินดีต้อนรับ</h1>
        <p className="text-gray-500 mb-8">กรุณาล็อกอินด้วย LINE เพื่อติดต่อเจ้าหน้าที่</p>

        <button
          onClick={onLogin}
          disabled={loading}
          className="w-full bg-[#06C755] hover:bg-[#05B34C] text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95"
        >
          {loading ? (
            <i className="fas fa-circle-notch fa-spin"></i>
          ) : (
            <i className="fab fa-line text-2xl"></i>
          )}
          <span>Log in with LINE</span>
        </button>
        
        <p className="mt-4 text-xs text-gray-400">
          ระบบจะขออนุญาตเข้าถึงชื่อและรูปโปรไฟล์ของคุณ
        </p>
      </div>
    </div>
  );
};

export default LoginCard;