import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeDashboard from './Pages/HomeDashboard';
import SurahList from './Pages/SurahList';
import SurahDetail from './Pages/SurahDetail';
import JadwalShalat from './Pages/JadwalShalat';
import DoaHarian from './Pages/DoaHarian';
import AsmaulHusna from './Pages/AsmaulHusna';
import PengingatHarian from './Pages/PengingatHarian';
import ArtikelIslami from './Pages/ArtikelIslami';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/quran" element={<SurahList />} />
        <Route path="/surah/:id" element={<SurahDetail />} />
        <Route path="/jadwal-shalat" element={<JadwalShalat />} />
        <Route path="/doa-harian" element={<DoaHarian />} />
        <Route path="/asmaul-husna" element={<AsmaulHusna />} />
        <Route path="/pengingat" element={<PengingatHarian />} />
<Route path="/artikel" element={<ArtikelIslami />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;





































































































































































































console.log('%c Muslim Life by Atha (https://github.com/Bangkah)', 'color: teal; font-size: 16px; font-weight: bold;');
