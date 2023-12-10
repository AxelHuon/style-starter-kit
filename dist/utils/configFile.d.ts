export interface ConfigInterface {
    language?: 'TypeScript' | 'JavaScript';
    framework?: 'react' | 'vue' | 'nuxt' | 'nextjs' | 'unknown';
    styleLib?: 'css-modules' | 'styled-components';
}
export declare const writeConfigFile: (key: string, value: string | string[]) => void;
export declare function loadConfig(): ConfigInterface | number;
