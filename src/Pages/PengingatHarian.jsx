// src/Pages/PengingatHarian.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoHome } from 'react-icons/io5';
import { CiLight, CiDark } from 'react-icons/ci';

const kutipanList = [
  "“Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia.” (HR. Ahmad)",
  "“Ketahuilah, dengan mengingat Allah hati menjadi tenang.” (QS. Ar-Ra’d: 28)",
  "“Barang siapa bertakwa kepada Allah, niscaya Dia akan memberikan jalan keluar baginya.” (QS. At-Talaq: 2)",
  "“Jangan bersedih, sesungguhnya Allah bersama kita.” (QS. At-Taubah: 40)",
  "“Orang yang kuat bukanlah yang jago bergulat, tapi yang mampu mengendalikan amarahnya.” (HR. Bukhari & Muslim)"
];

export default function PengingatHarian() {
  const [kutipan, setKutipan] = useState('');
  const [isDark, setIsDark] = useState(localStorage.darkMode === 'true');

  useEffect(() => {
    const random = kutipanList[Math.floor(Math.random() * kutipanList.length)];
    setKutipan(random);
  }, []);

  const toggleMode = () => {
    const newMode = !isDark;
    localStorage.setItem("darkMode", newMode);
    setIsDark(newMode);
  };

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/"><IoHome size={24} /></Link>
        <h1 className="text-xl font-bold">Pengingat Harian</h1>
        <button onClick={toggleMode}>
          {isDark ? <CiLight size={24} /> : <CiDark size={24} />}
        </button>
      </div>

      <div className={`max-w-xl mx-auto text-center p-6 rounded-xl shadow-lg transition-all duration-300 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <p className="text-lg italic leading-relaxed">"{kutipan}"</p>
      </div>
    </div>
  );
}
