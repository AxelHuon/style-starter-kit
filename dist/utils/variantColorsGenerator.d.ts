interface ColorVariants {
    [key: string]: string;
}
export declare function hexToRgb(hex: string): [number, number, number];
export declare function rgbToHex(r: number, g: number, b: number): string;
export declare function generateColorVariants(hexColor: string, name: string, type: 'css' | 'ts'): ColorVariants;
export {};
