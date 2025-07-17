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
      const resEquran = await axios.get(`https://equran.id/api/v2/surat/${id}`);
      const resSantri = await axios.get(`https://quran-api.santrikoding.com/api/surah/${id}`);

      // Gabungkan data equran dan santrikoding
      const dataEquran = resEquran.data.data;
      const dataSantri = resSantri.data;

      // Gabungkan ayat dan tafsir per ayat
      const ayatGabungan = dataEquran.ayat.map((ayat, index) => ({
        ...ayat,
        tafsir: dataSantri.ayat[index]?.tafsir ?? "Tafsir tidak tersedia"
      }));

      setSurah({
        nama: dataEquran.nama,
        namaLatin: dataEquran.namaLatin,
        nomor: dataEquran.nomor,
        jumlahAyat: dataEquran.jumlahAyat,
        ayat: ayatGabungan
      });

      setLoading(false);
    } catch (err) {
      console.error('Gagal mengambil data surah:', err);
      setLoading(false);
    }
  };

  fetchSurah();

  return () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };
}, [id]);


  const toggleMode = () => {
    setIsDarkMode(prev => !prev);
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
        if (surah && nextIndex < surah.ayat.length) {
          const nextAudioUrl = surah.ayat[nextIndex].audio['01'];
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

  const modeClass = isDarkMode ? 'dark' : 'light';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-emerald-400 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl">Surah tidak ditemukan</p>
          <Link to="/" className="text-emerald-400 mt-4 inline-block">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${modeClass}`}>
      {/* Navbar */}
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

      {/* Surah Content */}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-3xl">
          <div className={`flex-col w-full p-5 rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <h1 className="text-xl text-center font-medium">{surah.namaLatin}</h1>
            <p className="font-[Amiri] text-2xl text-center">{surah.nama}</p>
            <hr className='opacity-50' />
            <p className="mb-10 text-center opacity-50">
              Surah ke-{surah.nomor} | {surah.jumlahAyat} Ayat
            </p>

            {/* Daftar Ayat */}
            <div className="mt-5">
              {surah.ayat.map((verse, i) => (
                <div key={i} ref={el => verseRefs.current[i] = el} className="mb-4">
                  <div className="flex justify-between mb-6 items-center">
                    <button
                      onClick={() => handlePlayPause(i, verse.audio['01'])}
                      className="opacity-50"
                    >
                      {(playingIndex === i && !isPaused) ? (
                        <FaPause className="text-xl" />
                      ) : (
                        <FaPlay className="text-xl" />
                      )}
                    </button>
                  </div>
                  <p className="text-right font-[Amiri] text-2xl">{verse.teksArab}</p>
                  <p className="text-right mt-2 opacity-50">{verse.teksIndonesia}</p>
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
