import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeDashboard from './Pages/HomeDashboard';
import SurahList from './Pages/Alquran/SurahList';
import SurahDetail from './Pages/Alquran/SurahDetail';
import JadwalShalat from './Pages/JadwalShalat/JadwalShalat';
import DoaHarian from './Pages/DoaHarian/DoaHarian';
import AsmaulHusna from './Pages/Asmaulhusna/AsmaulHusna';
import PengingatHarian from './Pages/PengingatHarian/PengingatHarian';
import ArtikelList from './Pages/artikelislami/ArtikelList';
import ArtikelDetail from './Pages/artikelislami/ArtikelDetail';
import ArahKiblat from './Pages/JadwalShalat/ArahKiblat';



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
        <Route path="/artikel" element={<ArtikelList />} />
<Route path="/artikel/:id" element={<ArtikelDetail />} />

<Route path="/arah-kiblat" element={<ArahKiblat />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;





































































































































































































console.log('%c Muslim Life by Atha (https://github.com/Bangkah)', 'color: teal; font-size: 16px; font-weight: bold;');
