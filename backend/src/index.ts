import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { ENV } from "./utils/env";
import { connectDb, disconnectDb } from "./config/db";
import { serverConfigs } from "./config/serverConfig";
import authRoutes from "./routes/authRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import questionRoutes from "./routes/questionRoutes";
import {
    generateQuestions,
    generateConceptExplanations,
} from "./controllers/aiController";
import { globalErrorHandler } from "./utils/errorHandler";
import { requestLogger } from "./middlewares/requestLogger";
import { protect } from "./middlewares/authMiddleware";

const app = express();

app.use(serverConfigs.helmet);
app.use(serverConfigs.cors);
app.use(express.json({ limit: "10mb" }));
app.use(serverConfigs.generalLimiter);
app.use("/uploads", express.static(path.join(__dirname, ENV.UPLOAD_DIR)));

app.get("/", (_req, res) => {
    res.send("Backend is live! 🎉");
});

app.use(requestLogger);

app.use("/api/auth", serverConfigs.authLimiter, authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/ai/generate-questions", protect, generateQuestions);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanations);

app.use(globalErrorHandler);

const startServer = async () => {
    try {
        await connectDb();

        app.listen(ENV.PORT, () => {
            console.log(
                `[server] Listening at http://localhost:${ENV.PORT} (${ENV.NODE_ENV})`
            );
        });
    } catch (error) {
        console.error("[server] Startup error:", error);
        process.exit(1);
    }
};

startServer();

process.on("SIGINT", async () => {
    console.log("\n🛑 SIGINT received. Shutting down...");
    await disconnectDb();
    process.exit(0);
});
