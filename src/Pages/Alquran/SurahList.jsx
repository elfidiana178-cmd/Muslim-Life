import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CiDark, CiLight } from 'react-icons/ci';
import { IoHome } from 'react-icons/io5';

export default function SurahList() {
  const [surahs, setSurahs] = useState([]);
  const [search, setSearch] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const res = await axios.get('https://quran-api.santrikoding.com/api/surah');
        setSurahs(res.data);
      } catch (error) {
        console.error('Gagal mengambil surah:', error);
      }
    };

    fetchSurahs();

    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) setIsDarkMode(savedMode === 'true');
  }, []);

  const toggleMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  const filtered = surahs.filter(surah =>
    surah.nama_latin.toLowerCase().includes(search.toLowerCase())
  );

  const modeClass = isDarkMode ? 'dark bg-gray-900 text-white' : 'light bg-white text-black';

  return (
    <div className={`min-h-screen ${modeClass}`}>
      {/* Navbar */}
      <div className="flex justify-between items-center p-4 shadow-md">
        <Link to="/">
          <IoHome className="text-2xl opacity-70" />
        </Link>
        <h1 className="text-lg font-medium">Daftar Surah</h1>
        <button onClick={toggleMode}>
          {isDarkMode ? <CiLight className="text-2xl" /> : <CiDark className="text-2xl" />}
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
            <li key={surah.nomor}>
              <Link
                to={`/surah/${surah.nomor}`}
                className="block p-4 rounded-xl border bg-emerald-100 dark:bg-gray-800 shadow hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                    {surah.nomor}. {surah.nama_latin}
                  </span>
                  <span className="font-[Amiri] text-2xl">{surah.nama}</span>
                </div>
                <p className="text-sm opacity-70 mt-1 text-gray-800 dark:text-gray-300">
                  {surah.arti}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <Link 
          to="/" 
          className="block mt-8 text-center text-blue-500 hover:underline text-sm"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}