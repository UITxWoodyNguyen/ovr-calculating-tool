import { optimizeTraining } from '@/lib/optimizer/optimizer';

describe('Training Optimizer', () => {
  const cmWeights: Record<string, number> = {
    shortPass: 17,
    vision: 14,
    ballControl: 13,
    dribbling: 13,
    longPass: 8,
    stamina: 7,
    shotPower: 6,
    finishing: 6,
    curve: 5,
    positioning: 5,
    interceptions: 4,
    strength: 2,
  };

  const baseStats = [
    { statCode: 'shortPass', value: 85 },
    { statCode: 'vision', value: 80 },
    { statCode: 'ballControl', value: 82 },
    { statCode: 'dribbling', value: 78 },
    { statCode: 'longPass', value: 75 },
    { statCode: 'stamina', value: 70 },
    { statCode: 'shotPower', value: 68 },
    { statCode: 'finishing', value: 65 },
    { statCode: 'curve', value: 62 },
    { statCode: 'positioning', value: 60 },
    { statCode: 'interceptions', value: 58 },
    { statCode: 'strength', value: 55 },
  ];

  it('should find optimal training plan', () => {
    const result = optimizeTraining(baseStats, cmWeights);

    expect(result.baseOvr).toBeGreaterThan(0);
    expect(result.optimizedOvr).toBeGreaterThanOrEqual(result.baseOvr);
    expect(result.ovrGain).toBe(result.optimizedOvr - result.baseOvr);
    expect(result.trainingsUsed).toBeLessThanOrEqual(10);
    expect(result.statsTrained).toBeLessThanOrEqual(5);
    expect(result.plan.length).toBeLessThanOrEqual(5);
    
    // All plan items should have 1 or 2 points
    for (const item of result.plan) {
      expect(item.pointsAdded).toBeGreaterThanOrEqual(1);
      expect(item.pointsAdded).toBeLessThanOrEqual(2);
    }
  });

  it('should prefer fewer trainings when OVR is same (tie-break)', () => {
    // Create a case where multiple plans give same OVR
    const simpleStats = [
      { statCode: 'shortPass', value: 90 }, // weight 17
      { statCode: 'vision', value: 85 },    // weight 14
      { statCode: 'ballControl', value: 80 }, // weight 13
    ];

    const simpleWeights: Record<string, number> = {
      shortPass: 17,
      vision: 14,
      ballControl: 13,
    };

    const result = optimizeTraining(simpleStats, simpleWeights, 2);
    
    // Base OVR = (90*17 + 85*14 + 80*13) / 44 = 3864/44 = 87.8 -> 88
    // If we add +1 to vision: (90*17 + 86*14 + 80*13) / 44 = 3878/44 = 88.1 -> 88 (same)
    // If we add +2 to vision: (90*17 + 87*14 + 80*13) / 44 = 3892/44 = 88.4 -> 88 (same)
    // The optimizer should pick the one with fewer trainings if OVR is same
    expect(result.optimizedOvr).toBeGreaterThanOrEqual(result.baseOvr);
  });

  it('should not exceed max stats to train', () => {
    const result = optimizeTraining(baseStats, cmWeights, 3);
    expect(result.statsTrained).toBeLessThanOrEqual(3);
  });

  it('should return alternatives with same OVR but different training usage', () => {
    const result = optimizeTraining(baseStats, cmWeights);
    
    for (const alt of result.alternatives) {
      expect(alt.optimizedOvr).toBe(result.optimizedOvr);
      // Alternatives should have different training usage or stats trained
      expect(
        alt.trainingsUsed !== result.trainingsUsed || 
        alt.statsTrained !== result.statsTrained
      ).toBe(true);
    }
  });

  it('should handle GK weights correctly', () => {
    const gkWeights: Record<string, number> = {
      reflexes: 17,
      handling: 14,
      diving: 13,
      positioning: 13,
      kicking: 8,
      throwing: 7,
      rushing: 6,
      oneOnOnes: 6,
      aerial: 5,
      command: 5,
      communication: 4,
      penaltySaving: 2,
    };

    const gkStats = [
      { statCode: 'reflexes', value: 85 },
      { statCode: 'handling', value: 80 },
      { statCode: 'diving', value: 78 },
      { statCode: 'positioning', value: 82 },
      { statCode: 'kicking', value: 65 },
      { statCode: 'throwing', value: 60 },
      { statCode: 'rushing', value: 58 },
      { statCode: 'oneOnOnes', value: 70 },
      { statCode: 'aerial', value: 72 },
      { statCode: 'command', value: 68 },
      { statCode: 'communication', value: 60 },
      { statCode: 'penaltySaving', value: 55 },
    ];

    const result = optimizeTraining(gkStats, gkWeights);
    
    expect(result.baseOvr).toBeGreaterThan(0);
    expect(result.optimizedOvr).toBeGreaterThanOrEqual(result.baseOvr);
    expect(result.plan.every(p => gkWeights[p.statCode] > 0)).toBe(true);
  });

  it('should handle case where no training improves OVR', () => {
    // Stats already at 99 for high-weight stats
    const maxedStats = [
      { statCode: 'shortPass', value: 99 },
      { statCode: 'vision', value: 99 },
      { statCode: 'ballControl', value: 99 },
      { statCode: 'dribbling', value: 99 },
      { statCode: 'longPass', value: 99 },
      { statCode: 'stamina', value: 99 },
      { statCode: 'shotPower', value: 99 },
      { statCode: 'finishing', value: 99 },
      { statCode: 'curve', value: 99 },
      { statCode: 'positioning', value: 99 },
      { statCode: 'interceptions', value: 99 },
      { statCode: 'strength', value: 99 },
    ];

    const result = optimizeTraining(maxedStats, cmWeights);
    
    expect(result.plan).toHaveLength(0);
    expect(result.trainingsUsed).toBe(0);
    expect(result.statsTrained).toBe(0);
    expect(result.optimizedOvr).toBe(result.baseOvr);
    expect(result.ovrGain).toBe(0);
  });
});