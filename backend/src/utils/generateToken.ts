import jwt from "jsonwebtoken";
import { ENV } from "./env";

export const generateTokens = (userId: string) => {
    const accessToken = jwt.sign({ id: userId }, ENV.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: userId }, ENV.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
};
