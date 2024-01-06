export interface ParsedFontsInterface {
    fontName: string;
    fontsData: FontsDataInterface[];
}
export interface FontsDataInterface {
    fontsVariant: string;
    fontsWeight: string;
    fontStyle: string;
    fontUrl: string;
}
export declare const getGooglFontsData: (fontName: string) => Promise<{
    cssText?: string | undefined;
    fontName?: string | undefined;
    error?: string | undefined;
}>;
export declare const parseFontsIntoJson: (cssText: string, fontName: string) => ParsedFontsInterface;
export declare const downloadFont: (url: string, fontsVariant: string) => Promise<string | boolean>;
export declare const genereateCSSContent: (filePath: string, fontsData: FontsDataInterface, fontName: string) => string | boolean;
export declare const addContentToCssFile: (content: string) => boolean;
