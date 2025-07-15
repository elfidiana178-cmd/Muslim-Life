// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import HomeDashboard from './Pages/HomeDashboard';
import SurahList from './Pages/SurahList';
import SurahDetail from './Pages/SurahDetail';
import JadwalShalat from './Pages/JadwalShalat';
import DoaHarian from './Pages/DoaHarian';
import AsmaulHusna from './Pages/AsmaulHusna';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Utama */}
        <Route path="/" element={<HomeDashboard />} />

        {/* Al-Qur'an */}
        <Route path="/quran" element={<SurahList />} />
        <Route path="/surah/:id" element={<SurahDetail />} />

        {/* Fitur Lain */}
        <Route path="/jadwal-shalat" element={<JadwalShalat />} />
        <Route path="/doa-harian" element={<DoaHarian />} />
        <Route path="/asmaul-husna" element={<AsmaulHusna />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
