import { doubleCsrf } from "csrf-csrf";
import { ENV } from "../utils/env";

const isProd = process.env.NODE_ENV === "production";

export const {
    invalidCsrfTokenError,
    generateCsrfToken,
    doubleCsrfProtection,
} = doubleCsrf({
    getSecret: () => ENV.JWT_SECRET || "fallback_secret_csrfx2131xyz",
    getSessionIdentifier: () => "session_csrf",
    cookieName: "x-csrf-token",
    cookieOptions: {
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
        httpOnly: true,
    },
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    getCsrfTokenFromRequest: (req) =>
        req.headers["x-csrf-token"] as string | undefined,
});
