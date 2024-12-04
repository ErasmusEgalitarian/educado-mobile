// Tests for utility functions used in ExploreCard.jsx, Explore.jsx and CourseCard.jsx

import {
  getDifficultyLabel,
  determineCategory,
  determineIcon,
  getUpdatedDate,
  formatHours,
  convertMsToTime,
} from '../../services/utilityFunctions';

describe('Utility Functions', () => {

  describe('getDifficultyLabel', () => {
    it('should return "Iniciante" for level 1', () => {
      const result = getDifficultyLabel(1);
      expect(result).toBe('Iniciante');
    });

    it('should return "Intermediário" for level 2', () => {
      const result = getDifficultyLabel(2);
      expect(result).toBe('Intermediário');
    });

    it('should return "Avançado" for level 3', () => {
      const result = getDifficultyLabel(3);
      expect(result).toBe('Avançado');
    });
  });

  describe('determineCategory', () => {
    it('should return the translated category', () => {
      const category = 'personal finance';
      const translatedCategory = determineCategory(category);

      expect(translatedCategory).toBe('Finanças pessoais');
    });
    it('should return the translated category', () => {
      const category = 'health and workplace safety';
      const translatedCategory = determineCategory(category);

      expect(translatedCategory).toBe('Saúde e segurança no trabalho');
    });
    it('should return the translated category', () => {
      const category = 'sewing';
      const translatedCategory = determineCategory(category);

      expect(translatedCategory).toBe('Costura');
    });
    it('should return the translated category', () => {
      const category = 'electronics';
      const translatedCategory = determineCategory(category);

      expect(translatedCategory).toBe('Eletrônica');
    });
    it('should return "Outro" for unknown categories', () => {
      const category = 'unknown category';
      const translatedCategory = determineCategory(category);

      expect(translatedCategory).toBe('Outro');
    });
  });

  describe('determineIcon', () => {
    it('should return the right icon', () => {
      const category = 'personal finance';
      const icon = determineIcon(category);

      expect(icon).toBe('finance');
    });
    it('should return the right icon', () => {
      const category = 'health and workplace safety';
      const icon = determineIcon(category);

      expect(icon).toBe('medical-bag');
    });
    it('should return the right icon', () => {
      const category = 'sewing';
      const icon = determineIcon(category);

      expect(icon).toBe('scissors-cutting');
    });
    it('should return the right icon', () => {
      const category = 'electronics';
      const icon = determineIcon(category);

      expect(icon).toBe('laptop');
    });
    it('should return the right icon', () => {
      const category = 'unknown category';
      const icon = determineIcon(category);

      expect(icon).toBe('bookshelf');
    });
  });

  describe('getUpdatedDate', () => {
    it('should format the date correctly', () => {
      // Create a date in a known format for testing
      const inputDate = '2023-10-26T00:00:00.000Z';
      const expectedOutput = '2023/10/26';

      // Call the function with the input date
      const result = getUpdatedDate(inputDate);

      // Check if the result matches the expected output
      expect(result).toBe(expectedOutput);
    });

    it('should format the date correctly and ignore time', () => {
      const inputDate = '2023-12-31T15:15:30.100Z';
      const expectedOutput = '2023/12/31';

      const result = getUpdatedDate(inputDate);

      expect(result).toBe(expectedOutput);
    });
  });

  describe('convertMsToTime', () => {
    it('should convert milliseconds to time format (mm:ss)', () => {
      expect(convertMsToTime(0)).toBe('00:00');
      expect(convertMsToTime(5000)).toBe('00:05');
      expect(convertMsToTime(60000)).toBe('01:00');
      expect(convertMsToTime(120000)).toBe('02:00');
      expect(convertMsToTime(3600000)).toBe('60:00');
    });

    it('should handle negative input gracefully', () => {
      expect(convertMsToTime(-1000)).toBe('00:00');
      expect(convertMsToTime(-50000)).toBe('00:00');
    });
  });

  describe('formatHours', () => {
    it('should format hours correctly', () => {
      const inputHours = 1;
      const expectedOutput = '1 Hora';

      const result = formatHours(inputHours);

      expect(result).toBe(expectedOutput);
    });
      it('should format hours correctly', () => {
      const inputHours = 2;
      const expectedOutput = '2 Horas';

      const result = formatHours(inputHours);

      expect(result).toBe(expectedOutput);
      });
    it('input of something else that is not a number', () => {
      const inputHours = 'a';
      const expectedOutput = '- Hora';

      const result = formatHours(inputHours);

      expect(result).toBe(expectedOutput);
    });
    it('negative input', () => {
      const inputHours = -5;
      const expectedOutput = '- Hora';

      const result = formatHours(inputHours);

      expect(result).toBe(expectedOutput);
    });
    it('float input', () => {
      const inputHours = 1.5;
      const expectedOutput = '1.5 Horas';

      const result = formatHours(inputHours);

      expect(result).toBe(expectedOutput);
    });
    it('float input under 1', () => {
      const inputHours = 0.5;
      const expectedOutput = '0.5 Hora';

      const result = formatHours(inputHours);

      expect(result).toBe(expectedOutput);
    });
    it('0 input', () => {
      const inputHours = 0;
      const expectedOutput = '- Hora';

      const result = formatHours(inputHours);

      expect(result).toBe(expectedOutput);
    });
  });

});