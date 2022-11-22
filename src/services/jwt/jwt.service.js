import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import fs from "fs";

export const generateAccessToken = (uid) => {
    return jwt.sign({ uid: uid }, fs.readFileSync(process.env.PRIVATE_KEY), {
        algorithm: "RS256",
        expiresIn: "1d",
    });
}

export const generateRefreshToken = (uid) => {
    return jwt.sign({ uid: uid }, fs.readFileSync(process.env.PRIVATE_KEY), {
        algorithm: "RS256",
        expiresIn: "7d",
    });
}

export const verifyAccessToken = (token) => {
    return jwt.verify(token, fs.readFileSync(process.env.PUBLIC_KEY), {
        algorithms: ["RS256"],
    });
}