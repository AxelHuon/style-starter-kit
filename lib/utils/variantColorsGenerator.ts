interface ColorVariants {
  [key: string]: string;
}

export function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const red = r.toString(16).padStart(2, '0'),
    green = g.toString(16).padStart(2, '0'),
    blue = b.toString(16).padStart(2, '0');

  return '#' + red + green + blue;
}

export function generateColorVariants(
  hexColor: string,
  name: string,
  type: 'css' | 'ts',
): ColorVariants {
  const [r, g, b] = hexToRgb(hexColor);
  const variants: ColorVariants = {};

  for (let i = 1; i <= 9; i++) {
    const alpha = i * 0.1;
    let label;
    if (type === 'ts') {
      label = `${name.toUpperCase()}_${9 - i + 1}00`;
    } else {
      label = `--${name}-${i}00`;
    }
    const interpolatedR = Math.min(255, Math.round(r + (255 - r) * alpha));
    const interpolatedG = Math.min(255, Math.round(g + (255 - g) * alpha));
    const interpolatedB = Math.min(255, Math.round(b + (255 - b) * alpha));
    variants[label] = rgbToHex(interpolatedR, interpolatedG, interpolatedB);
  }

  return variants;
}
