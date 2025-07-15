import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoHome } from 'react-icons/io5';
import { CiDark, CiLight } from 'react-icons/ci';
import axios from 'axios';

export default function JadwalShalat() {
  const [lokasi, setLokasi] = useState('...');
  const [jadwal, setJadwal] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tanggal, setTanggal] = useState('');

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkMode(savedMode === 'true');
    }

    const today = new Date();
    const tglFormatted = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(today);
    setTanggal(tglFormatted);
  }, []);

  const toggleMode = () => {
    setIsDarkMode(prev => {
      const mode = !prev;
      localStorage.setItem('darkMode', mode.toString());
      return mode;
    });
  };

  const mintaLokasi = () => {
    if (!navigator.geolocation) {
      setLokasi('Browser tidak mendukung lokasi');
      return;
    }

    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude: lat, longitude: lon } = pos.coords;
      try {
        const loc = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
          params: {
            format: 'json',
            lat, lon
          }
        });

        const { city, town, village, county, state } = loc.data.address;
        setLokasi(`${city || town || village || county}, ${state}`);

        const now = new Date();
        const tgl = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const res2 = await axios.get(`https://api.aladhan.com/v1/timings/${tgl}`, {
          params: {
            latitude: lat,
            longitude: lon,
            method: 2,
            timezonestring: tz
          }
        });

        setJadwal(res2.data.data.timings);
      } catch (e) {
        console.error(e);
        setLokasi('Gagal mendapatkan lokasi');
      }
    }, () => setLokasi('Izin lokasi ditolak'));
  };

  const modeClass = isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-black';

  const waktuStyle = {
    Subuh: 'text-blue-400',
    Terbit: 'text-yellow-400',
    Zuhur: 'text-yellow-500',
    Asar: 'text-orange-400',
    Maghrib: 'text-red-500',
    Isya: 'text-purple-400',
  };

  return (
    <div className={`min-h-screen ${modeClass}`}>
      {/* Navbar */}
      <div className="flex justify-between items-center p-4 shadow-md border-b">
        <Link to="/" title="Home">
          <IoHome className="text-2xl opacity-70" />
        </Link>
        <h1 className="text-lg font-medium">Jadwal Shalat</h1>
        <button onClick={toggleMode}>
          {isDarkMode ? <CiLight className="text-2xl" /> : <CiDark className="text-2xl" />}
        </button>
      </div>

      <div className="max-w-xl mx-auto p-6">
        <button
          onClick={mintaLokasi}
          className="bg-emerald-500 text-white px-4 py-2 rounded-full mb-5 hover:bg-emerald-600"
        >
          Lihat Jadwal Shalat
        </button>

        {/* Info lokasi dan tanggal */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">Jadwal Shalat</h2>
          <p className="text-sm opacity-70">
            {lokasi} · {tanggal}
          </p>
        </div>

        {jadwal ? (
          <div className="bg-gray-800 text-white rounded-lg p-4">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
              {['Subuh', 'Terbit', 'Zuhur', 'Asar', 'Maghrib', 'Isya'].map(waktu => (
                <div key={waktu} className="flex flex-col">
                  <span className={`text-sm ${waktuStyle[waktu] || 'text-white'} font-bold`}>{waktu}</span>
                  <span className="text-lg">{jadwal[waktu]}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-center text-xs opacity-60">
              Menurut: Kemenag · Zona: GMT+07:00 · Waktu dapat berbeda
            </p>
          </div>
        ) : (
          <p className="text-center text-sm opacity-70">Klik tombol di atas untuk melihat jadwal</p>
        )}
      </div>
    </div>
  );
}
