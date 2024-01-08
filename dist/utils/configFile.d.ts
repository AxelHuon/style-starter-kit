export interface ConfigInterface {
    language: 'TypeScript' | 'JavaScript';
    framework: 'react' | 'vue' | 'nuxt' | 'nextjs' | 'unknown';
    styleLib: 'css-modules' | 'styled-components';
    fonts?: string | string[];
}
type WriteMode = 'replace' | 'appendToArray';
export declare const writeConfigFile: (key: string, value: string | string[], writeMode?: WriteMode) => void;
export declare function loadConfig(): ConfigInterface | number;
export {};
