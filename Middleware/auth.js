import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    try {
        console.log("Authenticating user...");
        console.log("Cookies:", req.cookies);

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET);

        req.user = decoded;

        console.log("Decoded user:", decoded);

        next();

    } catch (error) {
        console.error("Authentication error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};