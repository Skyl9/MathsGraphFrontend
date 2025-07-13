// src/utils/logger.ts
const isDev = process.env.NODE_ENV !== "production";

type LogFn = (...args: unknown[]) => void;

interface Logger {
    debug: LogFn;
    info: LogFn;
    warn: LogFn;
    error: LogFn;
}

const timestamp = () => new Date().toISOString();

export const logger: Logger = {
    debug: (...args) => {
        if (isDev) console.debug(`[DEBUG][${timestamp()}]`, ...args);
    },
    info: (...args) => {
        console.info(`[INFO][${timestamp()}]`, ...args);
    },
    warn: (...args) => {
        console.warn(`[WARN][${timestamp()}]`, ...args);
    },
    error: (...args) => {
        console.error(`[ERROR][${timestamp()}]`, ...args);
    },
};