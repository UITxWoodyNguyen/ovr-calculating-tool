'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Player {
  id: string;
  name: string;
  externalId: string;
  season: { code: string; nameVi: string; id: string };
  primaryPosition: { code: string; nameVi: string; id: string };
  secondaryPositions: string[];
  statValues: Array<{ statCode: string; baseValue: number; stat: { nameVi: string; code: string } }>;
  trainingPlans: Array<{
    id: string;
    baseOvr: number;
    optimizedOvr: number;
    trainingsUsed: number;
    createdAt: string;
    position: { code: string; nameVi: string };
    items: Array<{ statCode: string; pointsAdded: number }>;
  }>;
}

interface PositionWeights {
  position: { code: string; nameVi: string };
  weights: Record<string, number>;
}

interface OptimizerResult {
  baseOvr: number;
  optimizedOvr: number;
  ovrGain: number;
  plan: Array<{ statCode: string; pointsAdded: number }>;
  trainingsUsed: number;
  statsTrained: number;
  alternatives: OptimizerResult[];
}

export default function PlayerDetailPage() {
  const params = useParams();
  const playerId = params.id as string;

  const [player, setPlayer] = useState<Player | null>(null);
  const [weights, setWeights] = useState<PositionWeights | null>(null);
  const [optimizerResult, setOptimizerResult] = useState<OptimizerResult | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const playerRes = await fetch(`/api/players/${playerId}`);
        const playerData = await playerRes.json();
        setPlayer(playerData);
        setSelectedPosition(playerData.primaryPosition.code);

        const weightsRes = await fetch(`/api/positions/${playerData.primaryPosition.code}/weights?seasonId=${playerData.season.id}`);
        const weightsData = await weightsRes.json();
        setWeights(weightsData);
      } catch (error) {
        console.error('Error fetching player:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [playerId]);

  const handleOptimize = async () => {
    if (!player || !weights) return;
    setOptimizing(true);
    try {
      const res = await fetch('/api/training/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statValues: player.statValues.map(sv => ({ statCode: sv.statCode, value: sv.baseValue })),
          positionCode: selectedPosition,
          seasonId: player.season.id,
        }),
      });
      const data = await res.json();
      setOptimizerResult(data);
      await fetchAIExplanation(data);
    } catch (error) {
      console.error('Error optimizing:', error);
    } finally {
      setOptimizing(false);
    }
  };

  const fetchAIExplanation = async (result: OptimizerResult) => {
    if (!player || !weights) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statValues: player.statValues.map(sv => ({ statCode: sv.statCode, value: sv.baseValue })),
          positionCode: selectedPosition,
          seasonId: player.season.id,
          plan: result.plan,
        }),
      });
      const data = await res.json();
      setAiExplanation(data.explanation || '');
    } catch (error) {
      console.error('Error fetching AI explanation:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handlePositionChange = async (newPosition: string) => {
    setSelectedPosition(newPosition);
    setOptimizerResult(null);
    setAiExplanation('');
    
    try {
      const res = await fetch(`/api/positions/${newPosition}/weights?seasonId=${player?.season.id}`);
      const data = await res.json();
      setWeights(data);
    } catch (error) {
      console.error('Error fetching weights:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Không tìm thấy cầu thủ</h2>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">Quay lại trang chủ</Link>
        </div>
      </div>
    );
  }

  const baseStats = player.statValues.map(sv => ({
    statCode: sv.statCode,
    value: sv.baseValue,
    statName: sv.stat.nameVi,
    weight: weights?.weights[sv.statCode] || 0,
  })).filter(s => s.weight > 0);

  const trainedStats = new Set(optimizerResult?.plan.map(p => p.statCode) || []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-600 hover:underline text-sm mb-2 inline-block">← Quay lại danh sách</Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{player.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{player.season.nameVi}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">{player.primaryPosition.nameVi}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">ID: {player.externalId}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Chỉ số gốc & Hệ số vị trí ({selectedPosition})</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Chỉ số</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-700 w-20">Giá trị</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-700 w-20">Hệ số</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-700 w-24">Đóng góp</th>
                      {optimizerResult && (
                        <th className="text-center py-2 px-3 font-medium text-gray-700 w-24">Đào tạo</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {baseStats.map(s => {
                      const training = optimizerResult?.plan.find(p => p.statCode === s.statCode);
                      return (
                        <tr key={s.statCode} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3 text-gray-900">{s.statName}</td>
                          <td className="py-2 px-3 text-right font-mono font-medium">
                            {training ? (
                              <span className="text-green-600">{s.value} → {s.value + training.pointsAdded}</span>
                            ) : (
                              s.value
                            )}
                          </td>
                          <td className="py-2 px-3 text-right text-gray-500">{s.weight}</td>
                          <td className="py-2 px-3 text-right text-gray-600 font-mono">
                            {s.value * s.weight}
                          </td>
                          {optimizerResult && (
                            <td className="py-2 px-3 text-center">
                              {training ? (
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  training.pointsAdded === 2 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  +{training.pointsAdded}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {optimizerResult && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Kết quả tối ưu hóa đào tạo</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-sm text-blue-800">OVR gốc</p>
                    <p className="text-3xl font-bold text-blue-600">{optimizerResult.baseOvr}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <p className="text-sm text-green-800">OVR sau đào tạo</p>
                    <p className="text-3xl font-bold text-green-600">{optimizerResult.optimizedOvr}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <p className="text-sm text-purple-800">Tăng</p>
                    <p className="text-3xl font-bold text-purple-600">+{optimizerResult.ovrGain}</p>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium text-gray-700">Số lượt đào tạo:</span>
                    <span className="px-3 py-1 bg-white rounded border font-mono">{optimizerResult.trainingsUsed} / 10</span>
                    <span className="font-medium text-gray-700">Số chỉ số:</span>
                    <span className="px-3 py-1 bg-white rounded border font-mono">{optimizerResult.statsTrained} / 5</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Phụng án: {optimizerResult.plan.map(p => `+${p.pointsAdded} ${p.statCode}`).join(', ') || 'Không cần đào tạo'}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => fetchAIExplanation(optimizerResult)}
                    disabled={aiLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {aiLoading ? 'Đang sinh giải thích...' : 'Giải thích bằng AI'}
                  </button>
                  <button
                    onClick={() => setShowAlternatives(!showAlternatives)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    {showAlternatives ? 'Ẩn' : 'Xem'} phương án khác ({optimizerResult.alternatives.length})
                  </button>
                </div>
              </div>
            )}

            {optimizerResult && showAlternatives && optimizerResult.alternatives.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Các phương án thay thế (cùng OVR tối đa)</h2>
                <div className="space-y-3">
                  {optimizerResult.alternatives.map((alt, idx) => (
                    <div key={idx} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Phương án #{idx + 1}</span>
                        <span className="text-sm text-gray-500">
                          {alt.trainingsUsed} lượt, {alt.statsTrained} chỉ số
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {alt.plan.map(p => `+${p.pointsAdded} ${p.statCode}`).join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiExplanation && (
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-purple-600">🤖</span>
                  Giải thích từ AI
                </h2>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                  {aiExplanation}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Chọn vị trí tính OVR</h2>
              <div className="space-y-2">
                {player.primaryPosition && (
                  <button
                    onClick={() => handlePositionChange(player.primaryPosition.code)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedPosition === player.primaryPosition.code
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{player.primaryPosition.nameVi}</span>
                    <span className="text-xs text-gray-500 ml-2">(Chính)</span>
                  </button>
                )}
                {player.secondaryPositions.map(posCode => (
                  <button
                    key={posCode}
                    onClick={() => handlePositionChange(posCode)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedPosition === posCode
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {posCode} (Phụ)
                  </button>
                ))}
              </div>
            </div>

            {!optimizerResult && (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-600 mb-4">Chọn vị trí và bấm nút dưới để tìm phương án đào tạo tối ưu</p>
                <button
                  onClick={handleOptimize}
                  disabled={optimizing}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {optimizing ? 'Đang tối ưu...' : 'Tối ưu hoá đào tạo'}
                </button>
              </div>
            )}

            {player.trainingPlans.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử tối ưu</h2>
                <div className="space-y-3">
                  {player.trainingPlans.slice(0, 5).map(plan => (
                    <div key={plan.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{plan.position.nameVi}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(plan.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-gray-600">OVR: {plan.baseOvr} → {plan.optimizedOvr}</span>
                        <span className="text-green-600 font-medium">+{plan.optimizedOvr - plan.baseOvr}</span>
                        <span className="text-gray-500">{plan.trainingsUsed} lượt</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}