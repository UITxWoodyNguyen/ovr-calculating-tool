'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Player {
  id: string;
  name: string;
  externalId: string;
  season: { code: string; nameVi: string };
  primaryPosition: { code: string; nameVi: string };
  statValues: Array<{ statCode: string; baseValue: number; stat: { nameVi: string } }>;
}

interface Season {
  id: string;
  code: string;
  nameVi: string;
}

interface Position {
  code: string;
  nameVi: string;
  groupLabel?: string;
}

export default function HomePage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/seasons').then(r => r.json()).then(setSeasons);
    fetch('/api/positions').then(r => r.json()).then(setPositions);
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedSeason) params.append('season', selectedSeason);
    if (selectedPosition) params.append('position', selectedPosition);
    if (searchQuery) params.append('q', searchQuery);
    
    const res = await fetch(`/api/players?${params}`);
    const data = await res.json();
    setPlayers(data);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(fetchPlayers, 300);
    return () => clearTimeout(timer);
  }, [selectedSeason, selectedPosition, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">OVR Calculating Tool</h1>
          <p className="text-gray-600 mt-1">FIFA Online 4 / FC Online - Tối ưu đào tạo cầu thủ</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mùa thẻ</label>
              <select
                value={selectedSeason}
                onChange={e => setSelectedSeason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả</option>
                {seasons.map(s => <option key={s.id} value={s.id}>{s.nameVi} ({s.code})</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí</label>
              <select
                value={selectedPosition}
                onChange={e => setSelectedPosition(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả</option>
                {positions.map(p => <option key={p.code} value={p.code}>{p.nameVi} ({p.code})</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tên cầu thủ..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchPlayers}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang tải...' : 'Tìm cầu thủ'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map(player => (
            <Link
              key={player.id}
              href={`/player/${player.id}`}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-lg">{player.name}</h3>
                <span className="text-xs text-gray-500">ID: {player.externalId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{player.season.nameVi}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{player.primaryPosition.nameVi}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-xs">
                {player.statValues.slice(0, 6).map(sv => (
                  <div key={sv.statCode} className="flex justify-between">
                    <span className="text-gray-500">{sv.stat.nameVi}</span>
                    <span className="font-medium">{sv.baseValue}</span>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {players.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            Không tìm thấy cầu thủ nào. Hãy thử thay đổi bộ lọc.
          </div>
        )}
      </main>
    </div>
  );
}