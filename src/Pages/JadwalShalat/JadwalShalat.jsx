import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoHome } from 'react-icons/io5';
import { CiDark, CiLight } from 'react-icons/ci';
import axios from 'axios';

export default function JadwalShalat() {
  const [lokasi, setLokasi] = useState('...');
  const [jadwal, setJadwal] = useState(null);
  const [tanggal, setTanggal] = useState('');
  const [jamSekarang, setJamSekarang] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    setIsDarkMode(savedMode ? savedMode === 'true' : true);

    const updateWaktu = () => {
      const now = new Date();
      const jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setJamSekarang(jam);

      const tglFormatted = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      }).format(now);
      setTanggal(tglFormatted);
    };

    updateWaktu();
    const timer = setInterval(updateWaktu, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  const mintaLokasi = async () => {
    if (!navigator.geolocation) return setLokasi('Browser tidak mendukung lokasi');
    setIsLoading(true);
    try {
      navigator.geolocation.getCurrentPosition(async pos => {
        const { latitude: lat, longitude: lon } = pos.coords;
        try {
          const res1 = await axios.get('https://nominatim.openstreetmap.org/reverse', {
            params: { format: 'json', lat, lon }
          });
          const { city, town, village, county, state } = res1.data.address;
          setLokasi(`${city || town || village || county}, ${state}`);

          const now = new Date();
          const tgl = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

          const res2 = await axios.get(`https://api.aladhan.com/v1/timings/${tgl}`, {
            params: { latitude: lat, longitude: lon, method: 2, timezonestring: tz }
          });

          setJadwal(res2.data.data.timings);
        } catch {
          setLokasi('Gagal mendapatkan data lokasi');
        } finally {
          setIsLoading(false);
        }
      }, () => {
        setLokasi('Izin lokasi ditolak');
        setIsLoading(false);
      });
    } catch {
      setIsLoading(false);
    }
  };

  const modeClass = isDarkMode ? 'dark bg-[#0f172a] text-white' : 'bg-white text-gray-800';
  const waktuStyle = {
    Fajr: 'bg-blue-800 text-white',
    Sunrise: 'bg-amber-700 text-white',
    Dhuhr: 'bg-yellow-600 text-white',
    Asr: 'bg-orange-600 text-white',
    Maghrib: 'bg-red-600 text-white',
    Isha: 'bg-purple-800 text-white',
  };

  const labels = {
    Fajr: 'Subuh',
    Sunrise: 'Terbit',
    Dhuhr: 'Zuhur',
    Asr: 'Asar',
    Maghrib: 'Maghrib',
    Isha: 'Isya'
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${modeClass}`}>
      <div className="flex justify-between items-center p-4 shadow bg-[#1e293b]">
        <Link to="/" title="Home">
          <IoHome className="text-2xl text-white hover:opacity-80" />
        </Link>
        <h1 className="text-xl font-bold text-white">Jadwal Shalat</h1>
        <button onClick={toggleMode} className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full">
          {isDarkMode ? <CiLight className="text-white text-xl" /> : <CiDark className="text-gray-800 text-xl" />}
        </button>
      </div>

      <div className="max-w-xl mx-auto p-6 text-center">
        <div className="p-6 rounded-xl mb-6 bg-gray-800 shadow">
          <p className="text-sm text-gray-400 mb-1">Waktu sekarang:</p>
          <h2 className="text-4xl font-bold text-emerald-400">{jamSekarang}</h2>
          <p className="text-sm text-gray-300 mt-1">{tanggal}</p>
        </div>

        <div className="p-6 rounded-xl bg-gray-800 shadow">
          <h2 className="text-xl font-bold mb-2 text-white">Jadwal Shalat</h2>
          <p className="text-sm text-gray-400 mb-4">{lokasi}</p>

          <button
            onClick={mintaLokasi}
            disabled={isLoading}
            className={`relative px-6 py-3 rounded-full font-medium shadow-md mb-6 transition-all
              ${isLoading ? 'bg-gray-500' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
          >
            {isLoading ? 'Memuat...' : 'Lihat Jadwal Shalat'}
          </button>

          {/* ✅ Tambahan button ke arah kiblat */}
          <div className="text-center mb-6">
            <Link
              to="/arah-kiblat"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition"
            >
              Lihat Arah Kiblat
            </Link>
          </div>

          {jadwal ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.keys(labels).map((key) => (
                <div key={key} className={`p-4 rounded-xl shadow ${waktuStyle[key]}`}>
                  <span className="block text-sm font-semibold">{labels[key]}</span>
                  <span className="block text-2xl font-bold mt-1">{jadwal[key]}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400">Klik tombol untuk melihat jadwal berdasarkan lokasimu.</div>
          )}
        </div>
      </div>

      <footer className="text-center p-4 text-xs text-gray-400 mt-10">
        Jadwal otomatis berdasarkan lokasi dan zona waktu Anda.
      </footer>
    </div>
  );
}
