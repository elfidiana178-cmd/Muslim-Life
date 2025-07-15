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

  const mintaLokasi = () => {
    if (!navigator.geolocation) return setLokasi('Browser tidak mendukung lokasi');

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
      }
    }, () => setLokasi('Izin lokasi ditolak'));
  };

  const modeClass = isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-black';
  const waktuStyle = {
    Fajr: 'text-blue-400',
    Sunrise: 'text-yellow-400',
    Dhuhr: 'text-yellow-500',
    Asr: 'text-orange-400',
    Maghrib: 'text-red-500',
    Isha: 'text-purple-400',
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
    <div className={`min-h-screen ${modeClass}`}>
      {/* Navbar */}
      <div className="flex justify-between items-center p-4 shadow-md border-b">
        <Link to="/" title="Home"><IoHome className="text-2xl opacity-70" /></Link>
        <h1 className="text-lg font-medium">Jadwal Shalat</h1>
        <button onClick={toggleMode}>
          {isDarkMode ? <CiLight className="text-2xl" /> : <CiDark className="text-2xl" />}
        </button>
      </div>

      <div className="max-w-xl mx-auto p-6 text-center">
        <button
          onClick={mintaLokasi}
          className="bg-emerald-500 text-white px-4 py-2 rounded-full mb-4 hover:bg-emerald-600"
        >
          Lihat Jadwal Shalat
        </button>

        {/* Jam sekarang */}
        <p className="text-sm text-gray-500 mb-1">Waktu sekarang:</p>
        <h2 className="text-2xl font-bold mb-2">{jamSekarang}</h2>

        <h2 className="text-xl font-bold mt-4">Jadwal Shalat</h2>
        <p className="text-sm opacity-70">{lokasi} · {tanggal}</p>

        {/* Jadwal Shalat */}
        {jadwal ? (
          <div className="bg-gray-800 text-white rounded-lg p-4 mt-4">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center">
              {Object.keys(labels).map((key) => (
                <div key={key} className="flex flex-col">
                  <span className={`text-sm font-semibold ${waktuStyle[key]}`}>{labels[key]}</span>
                  <span className="text-lg">{jadwal[key]}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-center opacity-60">
              Menurut: Kemenag · Zona: GMT+07:00 · Waktu dapat berbeda
            </p>
          </div>
        ) : (
          <p className="text-sm opacity-70 mt-4">Klik tombol untuk melihat jadwal shalat berdasarkan lokasimu.</p>
        )}
      </div>
    </div>
  );
}
