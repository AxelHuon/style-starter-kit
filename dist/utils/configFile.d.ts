export interface ConfigInterface {
    language?: string;
    framework?: string;
    styleLib?: string;
}
export declare const writeConfigFile: (key: string, value: string) => void;
export declare function loadConfig(): Promise<ConfigInterface | number>;
