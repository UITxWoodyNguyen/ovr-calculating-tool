'use client';

import { useState, useEffect } from 'react';

interface Position {
  id: string;
  code: string;
  nameVi: string;
  groupLabel?: string;
  weights: Array<{ statCode: string; weight: number; stat: { nameVi: string } }>;
}

interface Stat {
  id: string;
  code: string;
  nameVi: string;
  category: string;
}

export default function AdminPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [editingWeights, setEditingWeights] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [posRes, statsRes] = await Promise.all([
        fetch('/api/positions'),
        fetch('/api/admin/stats'),
      ]);
      const posData = await posRes.json();
      const statsData = await statsRes.json();
      setPositions(posData);
      setStats(statsData);
      if (posData.length > 0) {
        setSelectedPosition(posData[0].code);
        loadWeights(posData[0].code);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const loadWeights = async (positionCode: string) => {
    try {
      const res = await fetch(`/api/positions/${positionCode}/weights`);
      const data = await res.json();
      setEditingWeights(data.weights || {});
    } catch (error) {
      console.error('Error loading weights:', error);
    }
  };

  const handlePositionChange = (code: string) => {
    setSelectedPosition(code);
    loadWeights(code);
  };

  const handleWeightChange = (statCode: string, value: number) => {
    setEditingWeights(prev => ({ ...prev, [statCode]: value }));
  };

  const handleSave = async () => {
    if (!selectedPosition) return;
    setSaving(true);
    setMessage(null);
    
    try {
      const res = await fetch(`/api/admin/positions/${selectedPosition}/weights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weights: editingWeights }),
      });
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'Đã lưu hệ số thành công!' });
        fetchData();
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Lưu thất bại' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Lỗi kết nối' });
    } finally {
      setSaving(false);
    }
  };

  const position = positions.find(p => p.code === selectedPosition);
  const positionWeights = position?.weights || [];
  const statList = stats.filter(s => s.category === 'outfield' || s.category === 'goalkeeper');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin - Quản lý hệ số vị trí</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold text-gray-900 mb-4">Vị trí</h2>
            <div className="space-y-2">
              {positions.map(pos => (
                <button
                  key={pos.code}
                  onClick={() => handlePositionChange(pos.code)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedPosition === pos.code
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{pos.nameVi}</div>
                  <div className="text-xs text-gray-500">{pos.code}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-lg shadow p-6">
            {position && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Hệ số: {position.nameVi} ({position.code})
                  </h2>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-2 px-3 font-medium text-gray-700 w-1/3">Chỉ số</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700 w-1/3">Mã chỉ số</th>
                        <th className="text-right py-2 px-3 font-medium text-gray-700 w-1/6">Hệ số</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statList.map(stat => {
                        const currentWeight = editingWeights[stat.code] ?? 
                          positionWeights.find(w => w.statCode === stat.code)?.weight ?? 0;
                        return (
                          <tr key={stat.code} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-3 text-gray-900">{stat.nameVi}</td>
                            <td className="py-2 px-3 text-gray-500 font-mono">{stat.code}</td>
                            <td className="py-2 px-3">
                              <input
                                type="number"
                                min="0"
                                max="99"
                                value={currentWeight}
                                onChange={e => handleWeightChange(stat.code, parseInt(e.target.value) || 0)}
                                className="w-20 text-right border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}