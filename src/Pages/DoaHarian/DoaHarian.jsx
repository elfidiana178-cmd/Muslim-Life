import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CiDark, CiLight } from 'react-icons/ci';
import { IoHome } from 'react-icons/io5';

const doaList = [
  {
    judul: "Doa Bangun Tidur",
    arab: "الْـحَمْـدُ للهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    latin: "Alhamdu lillaahil-ladzii ahyaanaa ba’da maa amaatanaa wa ilayhin-nushuuru",
    arti: "Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kami akan kembali."
  },
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
    judul: "Doa Keluar Rumah",
    arab: "بِسْمِ اللهِ، تَوَكَّلْتُ عَلَى اللهِ، لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللهِ",
    latin: "Bismillaah, tawakkaltu ‘alallaah, laa hawla wa laa quwwata illaa billaah",
    arti: "Dengan nama Allah, aku bertawakal kepada Allah, tidak ada daya dan kekuatan kecuali dengan pertolongan Allah."
  },
  {
    judul: "Doa Masuk Rumah",
    arab: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ",
    latin: "Allahumma inni as’aluka khaira al-mawliji wa khaira al-makhraji",
    arti: "Ya Allah, aku memohon kepada-Mu kebaikan saat masuk dan keluar rumah."
  },
  {
    judul: "Doa Sebelum Tidur",
    arab: "بِاسْمِكَ اللَّهُمَّ أَحْيَا وَأَمُوتُ",
    latin: "Bismikallahumma ahyaa wa amuut",
    arti: "Dengan nama-Mu ya Allah aku hidup dan aku mati."
  },
];

export default function DoaHarian() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      setIsDarkMode(saved === "true");
    }
  }, []);

  const toggleMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem("darkMode", next.toString());
      return next;
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

      {/* Doa List */}
      <div className="p-4 space-y-6 max-w-3xl mx-auto">
        {doaList.map((doa, i) => (
          <div key={i} className={`p-4 rounded-lg shadow transition ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
            <h2 className="text-lg font-semibold mb-2">{doa.judul}</h2>
            <p className="text-right font-[Amiri] text-xl leading-relaxed mb-2">{doa.arab}</p>
            <p className="text-sm italic text-gray-400">{doa.latin}</p>
            <p className="text-sm mt-2">{doa.arti}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
