describe('Utility Functions', () => {
  describe('calculateBMI', () => {
    const calculateBMI = (weight, height) => {
      if (!weight || !height) return 0;
      const heightInMeters = height / 100;
      return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    };

    it('calculates BMI correctly', () => {
      expect(calculateBMI(70, 175)).toBe('22.9');
      expect(calculateBMI(80, 180)).toBe('24.7');
    });

    it('returns 0 for invalid inputs', () => {
      expect(calculateBMI(0, 175)).toBe(0);
      expect(calculateBMI(70, 0)).toBe(0);
      expect(calculateBMI(null, 175)).toBe(0);
    });
  });

  describe('estimateCalories', () => {
    const estimateCalories = (duration, intensity) => {
      const multiplier = { Beginner: 4, Intermediate: 6, Advanced: 8 };
      return Math.round(duration * (multiplier[intensity] || 4));
    };

    it('estimates calories based on duration and intensity', () => {
      expect(estimateCalories(30, 'Beginner')).toBe(120);
      expect(estimateCalories(45, 'Intermediate')).toBe(270);
      expect(estimateCalories(60, 'Advanced')).toBe(480);
    });
  });
});
