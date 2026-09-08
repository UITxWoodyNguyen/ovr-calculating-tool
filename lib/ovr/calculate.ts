export interface StatValue {
  statCode: string;
  value: number;
}

export interface PositionWeights {
  [statCode: string]: number;
}

export interface OVRCalculationResult {
  ovr: number;
  weightedSum: number;
  totalWeight: number;
  details: Array<{
    statCode: string;
    value: number;
    weight: number;
    contribution: number;
  }>;
}

export function calculateOVR(
  statValues: StatValue[],
  positionWeights: PositionWeights
): OVRCalculationResult {
  const details: OVRCalculationResult['details'] = [];
  let weightedSum = 0;
  let totalWeight = 0;

  for (const { statCode, value } of statValues) {
    const weight = positionWeights[statCode] ?? 0;
    if (weight > 0) {
      const contribution = value * weight;
      weightedSum += contribution;
      totalWeight += weight;
      details.push({
        statCode,
        value,
        weight,
        contribution,
      });
    }
  }

  const ovr = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

  return {
    ovr,
    weightedSum,
    totalWeight,
    details,
  };
}

export function calculateOVRSimple(
  statValues: Record<string, number>,
  positionWeights: PositionWeights
): number {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [statCode, value] of Object.entries(statValues)) {
    const weight = positionWeights[statCode] ?? 0;
    if (weight > 0) {
      weightedSum += value * weight;
      totalWeight += weight;
    }
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}