import { generateColorVariants, hexToRgb, rgbToHex } from '../../lib/utils/variantColorsGenerator';

describe('Color Conversion Tests', () => {
  describe('hexToRgb', () => {
    it('converts hex to RGB correctly', () => {
      expect(hexToRgb('#FFFFFF')).toEqual([255, 255, 255]);
      expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
      // Add more test cases for different colors
    });
  });

  describe('rgbToHex', () => {
    it('converts RGB to hex correctly', () => {
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
      // Add more test cases for different colors
    });
  });

  describe('generateColorVariants', () => {
    it('generates correct color variants for css', () => {
      const variants = generateColorVariants('#ff0000', 'red', 'css');
      expect(variants).toHaveProperty('--red-900');
      // Test other properties and their values
    });

    it('generates correct color variants for ts', () => {
      const variants = generateColorVariants('#ff0000', 'red', 'ts');
      expect(variants).toHaveProperty('RED_100');
      expect(variants).toHaveProperty('RED_500');
      expect(variants).toHaveProperty('RED_900');
    });
  });
});
