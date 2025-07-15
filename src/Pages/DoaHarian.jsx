import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CiDark, CiLight } from 'react-icons/ci';
import { IoHome } from 'react-icons/io5';

const daftarDoa = [
  {
    judul: "Doa Sebelum Makan",
    arab: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا، وَقِنَا عَذَابَ النَّارِ",
    latin: "Allahumma barik lanaa fiimaa razaqtanaa waqinaa ‘adzaa bannar",
    arti: "Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka."
  },
  {
    judul: "Doa Sesudah Makan",
    arab: "الْـحَمْـدُ للهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِينَ",
    latin: "Alhamdulillahilladzii ath’amanaa wasaqaanaa waja’alanaa minal muslimiin",
    arti: "Segala puji bagi Allah yang telah memberi kami makan dan minum, serta menjadikan kami termasuk orang-orang muslim."
  },
  {
    judul: "Doa Masuk Rumah",
    arab: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ",
    latin: "Allahumma inni as’aluka khaira al-mawliji wa khaira al-makhraji",
    arti: "Ya Allah, aku memohon kepada-Mu kebaikan saat masuk dan keluar rumah."
  },
];

export default function DoaHarian() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setIsDarkMode(saved === "true");
  }, []);

  const toggleMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem("darkMode", newMode.toString());
      return newMode;
    });
  };

  const modeClass = isDarkMode ? "dark bg-gray-900 text-white" : "light bg-white text-black";

  return (
    <div className={`min-h-screen ${modeClass}`}>
      {/* Navbar */}
      <div className="flex justify-between items-center p-4 shadow-md">
        <Link to="/" title="Home">
          <IoHome className="text-2xl opacity-70" />
        </Link>
        <h1 className="text-lg font-medium">Doa Harian</h1>
        <button onClick={toggleMode}>
          {isDarkMode ? <CiLight className="text-2xl" /> : <CiDark className="text-2xl" />}
        </button>
      </div>

      {/* Daftar Doa */}
      <div className="p-4 space-y-6 max-w-3xl mx-auto">
        {daftarDoa.map((doa, index) => (
          <div key={index} className={`p-4 rounded-lg shadow ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
            <h2 className="text-lg font-semibold mb-2">{doa.judul}</h2>
            <p className="text-right font-[Amiri] text-xl leading-loose">{doa.arab}</p>
            <p className="text-sm italic mt-2 opacity-80">{doa.latin}</p>
            <p className="text-sm mt-1">{doa.arti}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
