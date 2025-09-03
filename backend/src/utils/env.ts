/**
 * Safely gets an environment variable with type checking and default value support.
 * Logs warnings if a default value is used when `DEBUG_ENV` is enabled.
 */

const DEBUG_ENV = process.env.DEBUG_ENV === "true";

export function getEnv<T extends string | number | boolean>(
    key: string,
    defaultValue?: T
): T {
    const value = process.env[key];

    if (value === undefined) {
        if (defaultValue !== undefined) {
            if (DEBUG_ENV) {
                console.warn(
                    `[env] ${key} not set. Using default: ${defaultValue}`
                );
            }
            return defaultValue;
        }
        throw new Error(`Environment variable ${key} is required but not set`);
    }

    // Type conversion based on the defaultValue type
    if (typeof defaultValue === "number") {
        const num = Number(value);
        if (isNaN(num)) {
            throw new Error(`Environment variable ${key} must be a number`);
        }
        return num as T;
    }

    if (typeof defaultValue === "boolean") {
        if (value.toLowerCase() === "true") return true as T;
        if (value.toLowerCase() === "false") return false as T;
        throw new Error(`Environment variable ${key} must be a boolean`);
    }

    return value as T;
}

/**
 * Gets an optional environment variable. Returns undefined if not set or invalid.
 */
export function getOptionalEnv<T extends string | number | boolean>(
    key: string
): T | undefined {
    try {
        return getEnv<T>(key);
    } catch {
        return undefined;
    }
}

/**
 * Pre-parsed, type-safe environment variables for centralized access.
 * Update this as needed based on your project.
 */
export const ENV = {
    NODE_ENV: getEnv<"development" | "production">("NODE_ENV", "development"),
    PORT: getEnv<number>("PORT", 5000),
    MONGO_DB_URI: getEnv<string>("MONGO_DB_URI"),
    IS_PROD: getEnv<boolean>("IS_PROD", false),
    JWT_SECRET: getEnv<string>("JWT_SECRET"),
    UPLOAD_DIR: getEnv<string>("UPLOAD_DIR", "uploads/"),
    GOOGLE_API_KEY: getEnv<string>("GOOGLE_API_KEY"),
};
