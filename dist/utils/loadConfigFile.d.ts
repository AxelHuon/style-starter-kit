interface ConfigInterface {
    language?: string;
    framework?: string;
    styleLib?: string;
}
export declare function loadConfig(): Promise<ConfigInterface>;
export {};
