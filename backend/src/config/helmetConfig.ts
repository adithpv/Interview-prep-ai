import helmet from "helmet";

const isProd = process.env.NODE_ENV === "production";

// Helmet configuration for security headers
export const helmetConfig = helmet({
    contentSecurityPolicy:
        isProd ?
            {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'", "https:"],
                    fontSrc: ["'self'", "https:"],
                    objectSrc: ["'none'"],
                    mediaSrc: ["'self'"],
                    frameSrc: ["'none'"],
                },
            }
        :   false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hsts:
        isProd ?
            {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true,
            }
        :   false,
});
