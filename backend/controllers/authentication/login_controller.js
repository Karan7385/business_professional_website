import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import getUserByUsername from "../../models/auth/authentication_model.js";
import { create_logs } from "../../models/logs/logs_model.js";

// How long access tokens are valid
const ACCESS_TOKEN_EXPIRES_IN = "1d"; // 1 day

async function login_controller(req, res) {
    try {
        let { username, password } = req.body;

        const user = await getUserByUsername(username);

        if (!user) {
            return res
                .status(401)
                .json({ error: "Invalid username or password." });
        }

        // ---- Compare password safely ----
        const passwordMatches = await bcrypt.compare(password, user.passkey);
        if (!passwordMatches) {
            return res
                .status(401)
                .json({ error: "Invalid username or password." });
        }

        // ---- Build JWT payload (keep it small) ----
        const payload = {
            sub: user.id,
            username: user.username,
            role: "admin",
        };

        // ---- Sign access token ----
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        });

        // ---- Send as httpOnly cookie (recommended) ----
        // You can use only JSON if you're doing a pure SPA; cookie is safer for XSS
        const isProd = process.env.NODE_ENV === "production";

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: isProd,        // true in production (HTTPS)
            sameSite: "strict",    // helps against CSRF
            maxAge: 1 * 24 * 60 * 60 * 1000 //1 day
        });

        const log_res = await create_logs(
            "login",
            `User ${username} logged in at ${new Date().toISOString()}`
        );        

        if (log_res.affectedRows != 1) {
            console.error("Failed to create log for user login.");
        }

        // Return some basic info (WITHOUT password/hash)
        return res.status(200).json({
            message: "Login successful.",
            token,
        });
    } catch (error) {
        console.error("Error in login_controller:", error);
        return res
            .status(500)
            .json({ error: "Something went wrong while logging in." });
    }
}

export default login_controller;