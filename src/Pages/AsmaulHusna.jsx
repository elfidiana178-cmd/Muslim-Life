import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CiDark, CiLight } from 'react-icons/ci';
import { IoHome } from 'react-icons/io5';

export default function AsmaulHusna() {
  const [asmaulHusna, setAsmaulHusna] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchAsmaulHusna = async () => {
      try {
        const res = await axios.get('https://api.aladhan.com/v1/asmaAlHusna');
        setAsmaulHusna(res.data.data);
      } catch (error) {
        console.error('Gagal memuat Asmaul Husna:', error);
      }
    };

    fetchAsmaulHusna();

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

  const modeClass = isDarkMode ? 'dark bg-gray-900 text-white' : 'light bg-white text-black';

  return (
    <div className={`min-h-screen ${modeClass}`}>
      {/* Navbar */}
      <div className="flex justify-between items-center p-4 shadow-md">
        <Link to="/">
          <IoHome className="text-2xl opacity-70" />
        </Link>
        <h1 className="text-lg font-medium">Asmaul Husna</h1>
        <button onClick={toggleMode}>
          {isDarkMode ? <CiLight className="text-2xl" /> : <CiDark className="text-2xl" />}
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {asmaulHusna.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border p-4 bg-emerald-100 dark:bg-gray-800 shadow hover:shadow-lg transition-all"
            >
              <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                {item.name} ({item.transliteration})
              </h2>
              <p className="mt-1 italic text-lg text-gray-800 dark:text-gray-300">
                {item.en.meaning} {/* Karena API belum punya versi Bahasa Indonesia */}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
