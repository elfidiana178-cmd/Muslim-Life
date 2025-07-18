// src/pages/SurahDetail.jsx
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
  const [lastReadIndex, setLastReadIndex] = useState(null);
  const [triggerScrollToLast, setTriggerScrollToLast] = useState(false);

  const audioRef = useRef(null);
  const verseRefs = useRef([]);

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        const res = await axios.get(`https://api.quran.gading.dev/surah/${id}`);
        setSurah(res.data.data);
        setLoading(false);

        const savedLastRead = localStorage.getItem(`lastRead-surah-${id}`);
        if (savedLastRead !== null) {
          setLastReadIndex(Number(savedLastRead));
        }
      } catch (err) {
        console.error('Gagal mengambil data surah:', err);
        setLoading(false);
      }
    };

    fetchSurah();

    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) setIsDarkMode(savedMode === 'true');

    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current) {
        audioRef.current.pause();
        setIsPaused(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [id]);

  useEffect(() => {
    if (triggerScrollToLast && lastReadIndex !== null && verseRefs.current[lastReadIndex]) {
      setTimeout(() => {
        verseRefs.current[lastReadIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        setTriggerScrollToLast(false);
      }, 300);
    }
  }, [triggerScrollToLast, lastReadIndex]);

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

  useEffect(() => {
    if (autoScroll && playingIndex !== null && verseRefs.current[playingIndex]) {
      verseRefs.current[playingIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [playingIndex, autoScroll]);

  const handleTandai = (index) => {
    const savedIndex = Number(localStorage.getItem(`lastRead-surah-${id}`));

    if (savedIndex === index) {
      localStorage.removeItem(`lastRead-surah-${id}`);
      setLastReadIndex(null);
    } else {
      localStorage.setItem(`lastRead-surah-${id}`, index.toString());
      setLastReadIndex(index);
    }
  };

  const modeClass = isDarkMode ? 'dark bg-gray-900 text-white' : 'light bg-white text-black';

  if (loading) {
    return <img src="/img/loading.png" className="mx-auto w-20" alt="Loading..." />;
  }

  return (
    <div className={`flex justify-center items-center min-h-screen ${modeClass}`}>
      <div className="w-full max-w-3xl p-4">
        <div className={`rounded-md p-5 shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-4">
            <Link to={'/'}>
              <IoHome className="text-2xl opacity-50" />
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAutoScroll(prev => !prev)}
                className={`text-sm px-3 py-1 border rounded-full ${isDarkMode ? 'border-gray-300' : 'border-gray-400'}`}
              >
                {autoScroll ? "🟢 Scroll Otomatis" : "⚪ Scroll Otomatis"}
              </button>
              <button onClick={toggleMode}>
                {isDarkMode ? <CiLight className="text-3xl" /> : <CiDark className="text-3xl" />}
              </button>
            </div>
          </div>

          {lastReadIndex !== null && (
            <div className="mb-4 p-3 rounded bg-yellow-200 dark:bg-yellow-900 text-sm">
              <p>Terakhir dibaca: Ayat {lastReadIndex + 1}</p>
              <button
                onClick={() => setTriggerScrollToLast(true)}
                className="text-blue-600 underline text-xs mt-1"
              >
                Lanjutkan membaca
              </button>
            </div>
          )}

          <h1 className="text-xl text-center font-medium">{surah.name.transliteration.id}</h1>
          <p className="font-[Amiri] text-2xl text-center">{surah.name.short}</p>
          <hr className="my-2 opacity-50" />
          <p className="mb-6 text-center opacity-50">
            Surah ke-{surah.number} | {surah.numberOfVerses} Ayat
          </p>

          <div className="space-y-6">
            {surah.verses.map((verse, i) => (
              <div key={i} ref={el => verseRefs.current[i] = el} className={`border-b pb-4 ${lastReadIndex === i ? 'bg-yellow-100 dark:bg-yellow-900' : ''}`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex gap-3">
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
                    <button
                      onClick={() => handleTandai(i)}
                      className={`text-sm px-2 py-1 border rounded-full ${lastReadIndex === i ? 'border-red-400 text-red-500' : 'border-emerald-400 text-emerald-500'}`}
                    >
                      {lastReadIndex === i ? 'Hapus Tanda' : 'Tandai'}
                    </button>
                  </div>
                  <span className="opacity-40 text-sm">Ayat {verse.number.inSurah}</span>
                </div>
                <p className="text-right font-[Amiri] text-2xl">{verse.text.arab}</p>
                <p className="text-right opacity-70">{verse.translation.id}</p>
              </div>
            ))}
          </div>
        </div>

        <footer className="footer footer-center bg-emerald-400 text-base-content p-4 mt-5 rounded shadow">
          <aside className="text-center">
            <p className="font-medium">Made With ❤️ by @Bangkah</p>
          </aside>
        </footer>
      </div>
    </div>
  );
}

export default SurahDetail;
