export declare const useTheme: (storageKey?: string, defaultTheme?: string) => {
    readonly current: string | undefined;
    readonly resolved: string | undefined;
    set: (value: string | ((current?: string) => string)) => void;
};
