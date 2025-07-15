// src/Pages/ArtikelIslami.jsx
import { Link } from 'react-router-dom';
import { IoHome } from 'react-icons/io5';
import { CiLight, CiDark } from 'react-icons/ci';
import { useState } from 'react';

export default function ArtikelIslami() {
  const [isDark, setIsDark] = useState(localStorage.darkMode === 'true');

  const toggleMode = () => {
    const newMode = !isDark;
    localStorage.setItem("darkMode", newMode);
    setIsDark(newMode);
  };

  return (
    <div className={`min-h-screen px-6 py-8 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/"><IoHome size={24} /></Link>
        <h1 className="text-xl font-bold">Artikel Islami</h1>
        <button onClick={toggleMode}>
          {isDark ? <CiLight size={24} /> : <CiDark size={24} />}
        </button>
      </div>

      <article className={`max-w-3xl mx-auto p-6 rounded-lg shadow ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <h2 className="text-2xl font-semibold mb-4">Muhasabah Diri: Menata Hati Mendekat ke Ilahi</h2>
        <p className="mb-4 leading-relaxed">
          Setiap kita butuh waktu untuk berhenti sejenak dari hiruk pikuk dunia, lalu menengok ke dalam hati. Sudahkah kita ikhlas? Sudahkah amal kita murni karena Allah?
        </p>
        <p className="mb-4 leading-relaxed">
          Muhasabah adalah cermin yang jujur. Dengannya kita tahu di mana letak kekurangan. Setiap malam sebelum tidur, hitung kembali amal hari ini. Tanyakan pada hati, apakah Allah ridha?
        </p>
        <p className="mb-4 leading-relaxed">
          Mari kita kembali kepada Allah. Bersihkan hati dengan taubat, basahi lisan dengan dzikir, dan kuatkan kaki dengan shalat malam.
        </p>
        <p className="italic text-sm opacity-70">“Orang cerdas adalah yang banyak mengingat kematian dan mempersiapkan untuk kehidupan setelahnya.” (HR. Tirmidzi)</p>
      </article>
    </div>
  );
}
