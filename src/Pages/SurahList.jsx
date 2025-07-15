import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CiDark, CiLight } from 'react-icons/ci';
import { IoHome } from 'react-icons/io5';

export default function SurahList() {
  const [surahs, setSurahs] = useState([]);
  const [search, setSearch] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(localStorage.darkMode === 'true');

  useEffect(() => {
    axios.get('https://api.quran.gading.dev/surah')
      .then(res => setSurahs(res.data.data))
      .catch(err => console.error('Gagal mengambil surah:', err));
  }, []);

  const toggleMode = () => {
    const newMode = !isDarkMode;
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    setIsDarkMode(newMode);
  };

  const filtered = surahs.filter(surah =>
    surah.name.transliteration.id.toLowerCase().includes(search.toLowerCase())
  );

  const modeClass = isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900';
  const cardClass = isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200';

  return (
    <div className={`min-h-screen transition-all duration-300 ${modeClass}`}>
      {/* Navbar */}
      <div className={`flex justify-between items-center p-4 shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <Link to="/" title="Kembali ke Home">
          <IoHome className={`text-2xl ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`} />
        </Link>
        <h1 className="text-xl font-bold">Daftar Surah</h1>
        <button onClick={toggleMode} className="p-2 rounded-full">
          {isDarkMode ? <CiLight className="text-xl" /> : <CiDark className="text-xl" />}
        </button>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        <input
          className="w-full px-4 py-2 rounded-lg mb-6 border focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:border-gray-600"
          type="text"
          placeholder="Cari surah..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ul className="space-y-3">
          {filtered.map(surah => (
            <li key={surah.number}>
              <Link 
                to={`/surah/${surah.number}`}
                className={`block p-4 rounded-lg shadow transition-transform transform hover:scale-[1.02] ${cardClass}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">{surah.number}. {surah.name.transliteration.id}</span>
                  <span className="font-[Amiri] text-2xl">{surah.name.short}</span>
                </div>
                <p className="text-sm opacity-70 mt-1">{surah.name.translation.id}</p>
              </Link>
            </li>
          ))}
        </ul>

        <Link to="/" className="block mt-8 text-center text-blue-500 hover:underline text-sm">← Kembali ke Dashboard</Link>
      </div>
    </div>
  );
}
