import { Link } from 'react-router-dom';
import { CiDark, CiLight } from 'react-icons/ci';
import { useState, useEffect } from 'react';

export default function HomeDashboard() {
  const [dark, setDark] = useState(localStorage.darkMode === 'true');
  const [jamSekarang, setJamSekarang] = useState('');

  const toggle = () => {
    localStorage.darkMode = JSON.stringify(!dark);
    setDark(!dark);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setJamSekarang(jam);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'dark bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-blue-50 to-white text-gray-800'}`}>
      <div className="max-w-md mx-auto py-10 px-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-1">
            MUSLIM LIFE
          </h1>
          <p className="text-sm opacity-60">{jamSekarang}</p>
          <button 
            onClick={toggle}
            className={`mt-2 p-2 rounded-full ${dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {dark ? <CiLight size={24} className="text-gray-200"/> : <CiDark size={24} className="text-gray-600"/>}
          </button>
        </div>

        {/* Navigation Cards */}
        <nav className="space-y-4">
          <Link 
            to="/quran" 
            className={`w-full block p-5 rounded-xl shadow-md transition-all duration-300 hover:scale-105 flex items-center gap-4
              ${dark ? 'bg-emerald-900/50 hover:bg-emerald-900/70 border border-emerald-800' : 'bg-emerald-100 hover:bg-emerald-200'}`}
          >
            <span className="text-3xl">📖</span>
            <div>
              <p className="font-bold text-lg">Al-Quran</p>
              <p className="text-sm opacity-70">Baca dan dengarkan Al-Quran</p>
            </div>
          </Link>

          <Link 
            to="/jadwal-shalat" 
            className={`w-full block p-5 rounded-xl shadow-md transition-all duration-300 hover:scale-105 flex items-center gap-4
              ${dark ? 'bg-blue-900/50 hover:bg-blue-900/70 border border-blue-800' : 'bg-blue-100 hover:bg-blue-200'}`}
          >
            <span className="text-3xl">🕌</span>
            <div>
              <p className="font-bold text-lg">Jadwal Shalat</p>
              <p className="text-sm opacity-70">Waktu shalat sesuai lokasi</p>
            </div>
          </Link>

          <Link 
            to="/doa-harian" 
            className={`w-full block p-5 rounded-xl shadow-md transition-all duration-300 hover:scale-105 flex items-center gap-4
              ${dark ? 'bg-amber-900/50 hover:bg-amber-900/70 border border-amber-800' : 'bg-amber-100 hover:bg-amber-200'}`}
          >
            <span className="text-3xl">🤲</span>
            <div>
              <p className="font-bold text-lg">Doa Harian</p>
              <p className="text-sm opacity-70">Doa-doa harian penting</p>
            </div>
          </Link>

          <Link 
            to="/asmaul-husna" 
            className={`w-full block p-5 rounded-xl shadow-md transition-all duration-300 hover:scale-105 flex items-center gap-4
              ${dark ? 'bg-purple-900/50 hover:bg-purple-900/70 border border-purple-800' : 'bg-purple-100 hover:bg-purple-200'}`}
          >
            <span className="text-3xl">🌟</span>
            <div>
              <p className="font-bold text-lg">Asmaul Husna</p>
              <p className="text-sm opacity-70">99 Nama Allah SWT</p>
            </div>
          </Link>

          <Link 
            to="/pengingat" 
            className={`w-full block p-5 rounded-xl shadow-md transition-all duration-300 hover:scale-105 flex items-center gap-4
              ${dark ? 'bg-teal-900/50 hover:bg-teal-900/70 border border-teal-800' : 'bg-teal-100 hover:bg-teal-200'}`}
          >
            <span className="text-3xl">📝</span>
            <div>
              <p className="font-bold text-lg">Pengingat Harian</p>
              <p className="text-sm opacity-70">Kutipan inspiratif setiap hari</p>
            </div>
          </Link>

          <Link 
            to="/artikel" 
            className={`w-full block p-5 rounded-xl shadow-md transition-all duration-300 hover:scale-105 flex items-center gap-4
              ${dark ? 'bg-indigo-900/50 hover:bg-indigo-900/70 border border-indigo-800' : 'bg-indigo-100 hover:bg-indigo-200'}`}
          >
            <span className="text-3xl">📚</span>
            <div>
              <p className="font-bold text-lg">Artikel Islami</p>
              <p className="text-sm opacity-70">Bacaan ringan dan bermanfaat</p>
            </div>
          </Link>
        </nav>

        {/* Donation Button */}
        <div className="mt-12 text-center">
          <a 
            href="https://saweria.co/mdhyaulatha" 
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