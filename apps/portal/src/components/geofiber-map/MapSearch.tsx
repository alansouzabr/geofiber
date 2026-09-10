import { useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function MapSearch() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState('');

  const handleSearch = async (q: string) => {
    if (!q) return;
    setLoading(true);
    setErr('');
    
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(q)}`;
      const res = await apiFetch(url);
      const data = await res.json() as any[];
      
      if (!data?.length) {
        setErr("Não encontrei este CEP/número.");
      }
    } catch (err) {
      setErr("Erro ao buscar localização.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar endereço..."
      />
      <button onClick={() => handleSearch(search)} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}
