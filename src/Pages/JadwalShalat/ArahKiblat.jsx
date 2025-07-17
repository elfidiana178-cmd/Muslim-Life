import { useEffect, useState } from 'react';

export default function ArahKiblat() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [azimuth, setAzimuth] = useState(null);
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    // Dapatkan lokasi pengguna
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);

        // Hitung arah kiblat
        const kaabaLat = 21.4225 * (Math.PI / 180);
        const kaabaLng = 39.8262 * (Math.PI / 180);
        const userLat = lat * (Math.PI / 180);
        const userLng = lon * (Math.PI / 180);

        const deltaLng = kaabaLng - userLng;
        const x = Math.sin(deltaLng);
        const y = Math.cos(userLat) * Math.tan(kaabaLat) - Math.sin(userLat) * Math.cos(deltaLng);
        const kiblatAzimuth = Math.atan2(x, y) * (180 / Math.PI);

        setAzimuth((kiblatAzimuth + 360) % 360);
      });
    }

    // Sensor kompas dari device
    const handleOrientation = (event) => {
      const alpha = event.alpha;
      if (alpha !== null) {
        setHeading(360 - alpha); // arah searah jarum jam
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <div className="min-h-screen px-4 py-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Arah Kiblat</h1>
      
      {latitude && longitude && azimuth !== null ? (
        <>
          <p>Lokasi Anda: {latitude.toFixed(4)}, {longitude.toFixed(4)}</p>
          <p>Arah Kiblat: {azimuth.toFixed(2)}° dari Utara</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Putar perangkat Anda untuk menghadap arah kiblat.
          </p>

          <div className="relative mt-8 w-48 h-48">
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-40 h-40 border-4 border-green-500 rounded-full flex items-center justify-center"
                style={{ transform: `rotate(${heading}deg)` }}
              >
                <div className="w-1 h-20 bg-red-600" />
              </div>
            </div>
            <div className="absolute bottom-0 w-full text-center text-sm mt-2">
              Arah saat ini: {heading.toFixed(0)}°
            </div>
          </div>
        </>
      ) : (
        <p>Memuat lokasi dan sensor perangkat Anda...</p>
      )}
    </div>
  );
}
