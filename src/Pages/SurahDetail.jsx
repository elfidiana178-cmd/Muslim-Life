import { Link, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { IoHome } from "react-icons/io5";
import { FaPlay, FaPause } from "react-icons/fa";
import { CiDark, CiLight } from "react-icons/ci";

function SurahDetail() {
  const { id } = useParams();
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [playingIndex, setPlayingIndex] = useState(null); // Index ayat yang sedang dimainkan
  const [isPaused, setIsPaused] = useState(false);        // Status pause
  const audioRef = useRef(null);

  useEffect(() => {
  const fetchSurah = async () => {
    try {
      const res = await axios.get(`https://api.quran.gading.dev/surah/${id}`);
      setSurah(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Gagal mengambil data surah:', err);
    }
  };

  fetchSurah();

  const savedMode = localStorage.getItem('darkMode');
  if (savedMode) setIsDarkMode(savedMode === 'true');

  // 👉 Cleanup saat keluar halaman
  return () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };
}, [id]);


  const toggleMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  const handlePlayPause = (index, audioUrl) => {
    if (playingIndex === index && !isPaused) {
      // Jika sedang diputar, maka pause
      audioRef.current.pause();
      setIsPaused(true);
    } else if (playingIndex === index && isPaused) {
      // Jika dipause, maka lanjutkan
      audioRef.current.play();
      setIsPaused(false);
    } else {
      // Jika ayat baru, stop audio sebelumnya
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;
      newAudio.play().catch(err => console.error('Gagal memutar audio:', err));
      setPlayingIndex(index);
      setIsPaused(false);

      // Otomatis lanjut ke ayat berikutnya
      newAudio.addEventListener('ended', () => {
        const nextIndex = index + 1;
        if (surah && nextIndex < surah.verses.length) {
          const nextAudioUrl = surah.verses[nextIndex].audio.primary;
          handlePlayPause(nextIndex, nextAudioUrl);
        } else {
          setPlayingIndex(null);
          setIsPaused(false);
          audioRef.current = null;
        }
      });
    }
  };

  const modeClass = isDarkMode ? 'dark' : 'light';

  if (loading) {
    return <img src="/img/loading.png" className="mx-auto w-20" alt="Loading..." />;
  }

  return (
    <div className={`flex justify-center items-center ${modeClass}`}>
      <div className="w-full max-w-3xl">
        <div className={`flex-col w-full p-5 rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          {/* Header */}
          <div className="flex justify-between">
            <Link to={'/'}>
              <IoHome className="text-2xl opacity-50" />
            </Link>
            <button onClick={toggleMode}>
              {isDarkMode ? <CiLight className='text-3xl' /> : <CiDark className='text-3xl' />}
            </button>
          </div>

          <h1 className="text-xl text-center font-medium">{surah.name.transliteration.id}</h1>
          <p className="font-[Amiri] text-2xl text-center">{surah.name.short}</p>
          <hr className='opacity-50' />
          <p className="mb-10 text-center opacity-50">
            Surah ke-{surah.number} | {surah.numberOfVerses} Ayat
          </p>

          {/* Daftar Ayat */}
          <div className="mt-5">
            {surah.verses.map((verse, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between mb-6 items-center">
                  {/* Tombol Play/Pause */}
                  <button
                    onClick={() => handlePlayPause(i, verse.audio.primary)}
                    className="opacity-50"
                  >
                    {(playingIndex === i && !isPaused) ? (
                      <FaPause className="text-xl" />
                    ) : (
                      <FaPlay className="text-xl" />
                    )}
                  </button>
                </div>
                <p className="text-right font-[Amiri] text-2xl">{verse.text.arab}</p>
                <p className="text-right opacity-70">{verse.text.transliteration.en}</p>
                <p className="text-right mt-2 opacity-50">{verse.translation.id}</p>
                <hr className="my-3 opacity-50" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="footer footer-center bg-emerald-400 text-base-content p-4 mt-5">
          <aside className='text-center'>
            <p className='font-medium'>Made With By @Bangkah</p>
          </aside>
        </footer>
      </div>
    </div>
  );
}

export default SurahDetail;
