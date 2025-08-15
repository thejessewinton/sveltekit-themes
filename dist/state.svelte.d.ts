declare const THEME_CONTEXT_KEY: unique symbol;
export declare const useTheme: () => {
    readonly current: string | undefined;
    readonly resolved: string | undefined;
    set: (theme: string) => void;
};
export { THEME_CONTEXT_KEY };
