import { calculateOVR, calculateOVRSimple, StatValue, PositionWeights } from '../ovr/calculate';

export interface TrainingOption {
  statCode: string;
  pointsAdded: number; // 0, 1, or 2
}

export interface OptimizerResult {
  baseOvr: number;
  optimizedOvr: number;
  ovrGain: number;
  plan: TrainingOption[];
  trainingsUsed: number;
  statsTrained: number;
  alternatives: OptimizerResult[];
}

interface Candidate {
  plan: TrainingOption[];
  ovr: number;
  trainingsUsed: number;
  statsTrained: number;
}

function generateCombinations(
  stats: StatValue[],
  weights: PositionWeights,
  maxStatsToTrain: number = 5
): Candidate[] {
  const candidates: Candidate[] = [];
  const eligibleStats = stats
    .filter(s => (weights[s.statCode] ?? 0) > 0)
    .sort((a, b) => (weights[b.statCode] ?? 0) - (weights[a.statCode] ?? 0));

  const statCodes = eligibleStats.map(s => s.statCode);
  const baseValues = Object.fromEntries(eligibleStats.map(s => [s.statCode, s.value]));

  const baseOvr = calculateOVRSimple(baseValues, weights);

  function evaluatePlan(deltas: Record<string, number>): Candidate {
    const newValues: Record<string, number> = { ...baseValues };
    let trainingsUsed = 0;
    let statsTrained = 0;

    for (const [statCode, delta] of Object.entries(deltas)) {
      if (delta > 0) {
        newValues[statCode] = baseValues[statCode] + delta;
        trainingsUsed += delta;
        statsTrained++;
      }
    }

    const ovr = calculateOVRSimple(newValues, weights);

    return {
      plan: Object.entries(deltas)
        .filter(([, delta]) => delta > 0)
        .map(([statCode, pointsAdded]) => ({ statCode, pointsAdded })),
      ovr,
      trainingsUsed,
      statsTrained,
    };
  }

  const initialDeltas: Record<string, number> = {};
  for (const code of statCodes) {
    initialDeltas[code] = 0;
  }

  candidates.push(evaluatePlan(initialDeltas));

  function backtrack(index: number, statsUsed: number, deltas: Record<string, number>) {
    if (statsUsed > maxStatsToTrain) return;
    if (index >= statCodes.length) {
      if (statsUsed > 0) {
        candidates.push(evaluatePlan({ ...deltas }));
      }
      return;
    }

    const statCode = statCodes[index];

    for (let delta = 1; delta <= 2; delta++) {
      deltas[statCode] = delta;
      backtrack(index + 1, statsUsed + 1, deltas);
      deltas[statCode] = 0;
    }

    backtrack(index + 1, statsUsed, deltas);
  }

  backtrack(0, 0, initialDeltas);

  return candidates;
}

export function optimizeTraining(
  statValues: StatValue[],
  positionWeights: PositionWeights,
  maxStatsToTrain: number = 5,
  maxAlternatives: number = 3
): OptimizerResult {
  const candidates = generateCombinations(statValues, positionWeights, maxStatsToTrain);

  const baseOvr = candidates[0].ovr;

  candidates.sort((a, b) => {
    if (b.ovr !== a.ovr) return b.ovr - a.ovr;
    if (a.trainingsUsed !== b.trainingsUsed) return a.trainingsUsed - b.trainingsUsed;
    return a.statsTrained - b.statsTrained;
  });

  const best = candidates[0];
  const alternativeCandidates = candidates
    .filter(c => c.ovr === best.ovr && (c.trainingsUsed !== best.trainingsUsed || c.statsTrained !== best.statsTrained))
    .slice(0, maxAlternatives);

  const alternatives: OptimizerResult[] = alternativeCandidates.map(c => ({
    baseOvr,
    optimizedOvr: c.ovr,
    ovrGain: c.ovr - baseOvr,
    plan: c.plan,
    trainingsUsed: c.trainingsUsed,
    statsTrained: c.statsTrained,
    alternatives: [],
  }));

  return {
    baseOvr,
    optimizedOvr: best.ovr,
    ovrGain: best.ovr - baseOvr,
    plan: best.plan,
    trainingsUsed: best.trainingsUsed,
    statsTrained: best.statsTrained,
    alternatives,
  };
}

export function getTrainingPlanSummary(result: OptimizerResult): string {
  if (result.plan.length === 0) {
    return 'Không cần đào tạo thêm - OVR đã tối đa.';
  }

  const lines = result.plan.map(p => 
    `+${p.pointsAdded} ${p.statCode}`
  );

  return `Đào tạo ${result.statsTrained} chỉ số (${result.trainingsUsed} lượt): ${lines.join(', ')}. OVR: ${result.baseOvr} → ${result.optimizedOvr} (+${result.ovrGain})`;
}