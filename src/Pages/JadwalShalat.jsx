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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) setIsDarkMode(savedMode === 'true');

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
        } catch (err) {
          console.error(err);
          setLokasi('Gagal mendapatkan data lokasi');
        } finally {
          setIsLoading(false);
        }
      }, () => {
        setLokasi('Izin lokasi ditolak');
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

  const modeClass = isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-blue-50 to-white text-gray-800';
  const waktuStyle = {
    Fajr: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Sunrise: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    Dhuhr: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Asr: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    Maghrib: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Isha: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
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
      {/* Navbar */}
      <div className={`flex justify-between items-center p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <Link to="/" title="Home">
          <IoHome className={`text-2xl ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`} />
        </Link>
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
          Jadwal Shalat
        </h1>
        <button 
          onClick={toggleMode}
          className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          {isDarkMode ? <CiLight className="text-xl" /> : <CiDark className="text-xl" />}
        </button>
      </div>

      <div className="max-w-xl mx-auto p-6 text-center">
        {/* Current Time Section */}
        <div className={`p-6 rounded-xl mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Waktu sekarang:</p>
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
            {jamSekarang}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">{tanggal}</p>
        </div>

        {/* Location and Prayer Times */}
        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className="text-xl font-bold mb-2">Jadwal Shalat</h2>
          <p className="text-sm opacity-70 mb-4">{lokasi}</p>

          <button
            onClick={mintaLokasi}
            disabled={isLoading}
            className={`relative px-6 py-3 rounded-full font-medium shadow-md transition-all duration-300 mb-6
              ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white'}`}
          >
            {isLoading ? (
              <>
                <span className="opacity-0">Memuat...</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </>
            ) : (
              'Lihat Jadwal Shalat'
            )}
          </button>

          {jadwal ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.keys(labels).map((key) => (
                  <div 
                    key={key} 
                    className={`p-3 rounded-lg transition-all duration-200 hover:scale-105 ${waktuStyle[key]}`}
                  >
                    <span className="block text-sm font-semibold">{labels[key]}</span>
                    <span className="block text-xl font-bold">{jadwal[key]}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-center opacity-60">
                Menurut: Kemenag · Zona: GMT+07:00 · Waktu dapat berbeda
              </p>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Klik tombol di atas untuk melihat jadwal shalat berdasarkan lokasimu.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center p-4 text-xs text-gray-500 dark:text-gray-400 mt-8">
        Jadwal shalat akan diperbarui secara otomatis
      </div>
    </div>
  );
}