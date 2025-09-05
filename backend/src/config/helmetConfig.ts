import helmet from "helmet";
import { ENV } from "../utils/env";

// Helmet configuration for security headers
export const helmetConfig = helmet({
    contentSecurityPolicy:
        ENV.IS_PROD ?
            {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'"],
                    fontSrc: ["'self'"],
                    objectSrc: ["'none'"],
                    mediaSrc: ["'self'"],
                    frameSrc: ["'none'"],
                },
            }
        :   false,
    crossOriginEmbedderPolicy: false,
    hsts:
        ENV.IS_PROD ?
            {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true,
            }
        :   false,
});
