export default function DoaHarian() {
  const doa = [
    {title:'Doa Pagi', text:'...'},
    {title:'Doa Sebelum Makan', text:'...'},
  ];
  return (
    <div className="min-h-screen p-6">
      {doa.map(d => (
        <div key={d.title} className="mb-4">
          <h3 className="font-semibold text-lg">{d.title}</h3>
          <p>{d.text}</p>
        </div>
      ))}
      <Link to="/" className="text-blue-600">← Kembali</Link>
    </div>
  );
}
