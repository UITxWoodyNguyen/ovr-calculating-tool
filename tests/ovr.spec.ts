import { calculateOVR, calculateOVRSimple } from '@/lib/ovr/calculate';

describe('OVR Calculation', () => {
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

  describe('calculateOVRSimple', () => {
    it('should calculate weighted average correctly', () => {
      const stats = {
        shortPass: 90,
        vision: 85,
        ballControl: 88,
        dribbling: 86,
        longPass: 80,
        stamina: 75,
        shotPower: 70,
        finishing: 72,
        curve: 68,
        positioning: 74,
        interceptions: 65,
        strength: 60,
      };

      // Weighted sum = 90*17 + 85*14 + 88*13 + 86*13 + 80*8 + 75*7 + 70*6 + 72*6 + 68*5 + 74*5 + 65*4 + 60*2
      // = 1530 + 1190 + 1144 + 1118 + 640 + 525 + 420 + 432 + 340 + 370 + 260 + 120 = 8089
      // Total weight = 17+14+13+13+8+7+6+6+5+5+4+2 = 100
      // OVR = round(8089/100) = round(80.89) = 81
      const result = calculateOVRSimple(stats, cmWeights);
      expect(result).toBe(81);
    });

    it('should handle missing stats (weight 0)', () => {
      const stats = {
        shortPass: 90,
        vision: 85,
        unknownStat: 99, // Should be ignored
      };

      const result = calculateOVRSimple(stats, cmWeights);
      // Only shortPass(17) and vision(14) have weights
      // (90*17 + 85*14) / (17+14) = (1530 + 1190) / 31 = 2720/31 = 87.74 -> 88
      expect(result).toBe(88);
    });

    it('should return 0 for empty stats', () => {
      const result = calculateOVRSimple({}, cmWeights);
      expect(result).toBe(0);
    });

    it('should match the example from documentation', () => {
      const stats = {
        stat1: 90, stat2: 85, stat3: 88, stat4: 86,
        stat5: 80, stat6: 75, stat7: 70, stat8: 72,
        stat9: 68, stat10: 74, stat11: 65, stat12: 60,
      };
      
      const weights: Record<string, number> = {
        stat1: 17, stat2: 14, stat3: 13, stat4: 13,
        stat5: 8, stat6: 7, stat7: 6, stat8: 6,
        stat9: 5, stat10: 5, stat11: 4, stat12: 2,
      };

      const result = calculateOVRSimple(stats, weights);
      // Weighted sum = 8089, Total weight = 100, OVR = round(80.89) = 81
      expect(result).toBe(81);
    });
  });

  describe('calculateOVR', () => {
    it('should return detailed calculation', () => {
      const stats = [
        { statCode: 'shortPass', value: 90 },
        { statCode: 'vision', value: 85 },
        { statCode: 'ballControl', value: 88 },
      ];

      const result = calculateOVR(stats, cmWeights);

      expect(result.ovr).toBe(88); // (90*17 + 85*14 + 88*13) / (17+14+13) = 4164/44 = 94.6 -> wait, let me recalculate
      // 90*17=1530, 85*14=1190, 88*13=1144, sum=3864, weight=44, 3864/44=87.8 -> 88
      expect(result.weightedSum).toBe(3864);
      expect(result.totalWeight).toBe(44);
      expect(result.details).toHaveLength(3);
      expect(result.details[0]).toEqual({
        statCode: 'shortPass',
        value: 90,
        weight: 17,
        contribution: 1530,
      });
    });

    it('should ignore stats with zero weight', () => {
      const stats = [
        { statCode: 'shortPass', value: 90 },
        { statCode: 'unknownStat', value: 99 },
      ];

      const result = calculateOVR(stats, cmWeights);

      expect(result.details).toHaveLength(1);
      expect(result.details[0].statCode).toBe('shortPass');
    });
  });
});