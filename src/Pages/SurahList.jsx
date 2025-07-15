// src/Pages/SurahList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CiDark, CiLight } from 'react-icons/ci';

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

  return (
    <div className={isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-black'}>
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Daftar Surah</h1>
          <button onClick={toggleMode}>
            {isDarkMode ? <CiLight size={28}/> : <CiDark size={28}/>}
          </button>
        </div>

        <input
          className="w-full p-2 border rounded mb-4"
          type="text"
          placeholder="Cari surah..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ul className="space-y-3">
          {filtered.map(surah => (
            <li key={surah.number} className="p-4 bg-green-100 rounded">
              <Link to={`/surah/${surah.number}`}>
                <div className="flex justify-between">
                  <span>{surah.number}. {surah.name.transliteration.id}</span>
                  <span className="font-[Amiri]">{surah.name.short}</span>
                </div>
                <p className="text-sm opacity-60">{surah.name.translation.id}</p>
              </Link>
            </li>
          ))}
        </ul>

        <Link to="/" className="block mt-6 text-blue-600">← Kembali ke Dashboard</Link>
      </div>
    </div>
  );
}
