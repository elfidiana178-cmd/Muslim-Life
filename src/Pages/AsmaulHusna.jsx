export default function AsmaulHusna() {
  const names = ['Ar‑Rahman','Ar‑Rahim','Al‑Malik', /* dst */];
  return (
    <div className="min-h-screen p-6">
      <h2 className="text-xl font-semibold mb-4">Asmaul Husna</h2>
      <ul className="grid grid-cols-2 gap-3">
        {names.map(n => <li key={n} className="p-3 border rounded">{n}</li>)}
      </ul>
      <Link to="/" className="text-blue-600">← Kembali</Link>
    </div>
  );
}
