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

  const [playingIndex, setPlayingIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);

  const audioRef = useRef(null);
  const verseRefs = useRef([]);

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

    // Cleanup saat keluar halaman
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
      audioRef.current.pause();
      setIsPaused(true);
    } else if (playingIndex === index && isPaused) {
      audioRef.current.play();
      setIsPaused(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;
      newAudio.play().catch(err => console.error('Gagal memutar audio:', err));
      setPlayingIndex(index);
      setIsPaused(false);

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

  // Scroll otomatis ke ayat yang sedang dimainkan
  useEffect(() => {
    if (autoScroll && playingIndex !== null && verseRefs.current[playingIndex]) {
      verseRefs.current[playingIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [playingIndex, autoScroll]);

  const modeClass = isDarkMode ? 'dark' : 'light';

  if (loading) {
    return <img src="/img/loading.png" className="mx-auto w-20" alt="Loading..." />;
  }

  return (
    <div className={`min-h-screen ${modeClass}`}>
      {/* Sticky Navbar */}
      <div className={`w-full z-50 top-0 sticky px-4 py-3 flex justify-between items-center shadow-md ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <Link to={'/'}>
          <IoHome className="text-2xl opacity-50" />
        </Link>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setAutoScroll(prev => !prev)}
            className={`text-sm px-3 py-1 border rounded-full ${isDarkMode ? 'border-gray-300' : 'border-gray-400'}`}
          >
            {autoScroll ? "🟢 Scroll Otomatis" : "⚪ Scroll Otomatis"}
          </button>
          <button onClick={toggleMode}>
            {isDarkMode ? <CiLight className='text-3xl' /> : <CiDark className='text-3xl' />}
          </button>
        </div>
      </div>

      {/* Isi Surah */}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-3xl">
          <div className={`flex-col w-full p-5 rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <h1 className="text-xl text-center font-medium">{surah.name.transliteration.id}</h1>
            <p className="font-[Amiri] text-2xl text-center">{surah.name.short}</p>
            <hr className='opacity-50' />
            <p className="mb-10 text-center opacity-50">
              Surah ke-{surah.number} | {surah.numberOfVerses} Ayat
            </p>

            {/* Daftar Ayat */}
            <div className="mt-5">
              {surah.verses.map((verse, i) => (
                <div key={i} ref={el => verseRefs.current[i] = el} className="mb-4">
                  <div className="flex justify-between mb-6 items-center">
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
    </div>
  );
}

export default SurahDetail;
