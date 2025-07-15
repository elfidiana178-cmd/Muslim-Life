import { Link } from 'react-router-dom';
import { CiDark, CiLight } from 'react-icons/ci';
import { useState } from 'react';

export default function HomeDashboard() {
  const [dark, setDark] = useState(localStorage.darkMode === 'true');
  const toggle = () => {
    localStorage.darkMode = JSON.stringify(!dark);
    setDark(!dark);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-white'}`}>
      <div className="max-w-md mx-auto py-10 px-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
            MUSLIM LIFE
          </h1>
          <button 
            onClick={toggle}
            className={`p-2 rounded-full ${dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {dark ? <CiLight size={24} className="text-gray-200"/> : <CiDark size={24} className="text-gray-600"/>}
          </button>
        </div>

        {/* Navigation Cards */}
        <nav className="grid grid-cols-2 gap-5">
          <Link 
            to="/quran" 
            className={`p-5 rounded-xl shadow-md transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center
              ${dark ? 'bg-emerald-900/50 hover:bg-emerald-900/70 border border-emerald-800' : 'bg-emerald-100 hover:bg-emerald-200'}`}
          >
            <span className="text-3xl mb-2">📖</span>
            <span className="font-semibold">Al-Quran</span>
          </Link>
          
          <Link 
            to="/jadwal-shalat" 
            className={`p-5 rounded-xl shadow-md transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center
              ${dark ? 'bg-blue-900/50 hover:bg-blue-900/70 border border-blue-800' : 'bg-blue-100 hover:bg-blue-200'}`}
          >
            <span className="text-3xl mb-2">🕌</span>
            <span className="font-semibold">Jadwal Shalat</span>
          </Link>
          
          <Link 
            to="/doa-harian" 
            className={`p-5 rounded-xl shadow-md transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center
              ${dark ? 'bg-amber-900/50 hover:bg-amber-900/70 border border-amber-800' : 'bg-amber-100 hover:bg-amber-200'}`}
          >
            <span className="text-3xl mb-2">🤲</span>
            <span className="font-semibold">Doa Harian</span>
          </Link>
          
          <Link 
            to="/asmaul-husna" 
            className={`p-5 rounded-xl shadow-md transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center
              ${dark ? 'bg-purple-900/50 hover:bg-purple-900/70 border border-purple-800' : 'bg-purple-100 hover:bg-purple-200'}`}
          >
            <span className="text-3xl mb-2">🌟</span>
            <span className="font-semibold">Asmaul Husna</span>
          </Link>
        </nav>

        {/* Donation Button */}
        <div className="mt-12 text-center">
          <a 
            href="https://buymeacoffee.com/username" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`inline-block px-6 py-3 rounded-full font-medium shadow-md transition-all duration-300 hover:scale-105
              ${dark ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700' : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600'} text-white`}
          >
            ☕ Belikan Kopi
          </a>
        </div>
      </div>
    </div>
  );
}