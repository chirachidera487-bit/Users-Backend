import jwt from "jsonwebtoken";
import { verifyToken } from "./jwt.js";

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

const analyseCookie = (cookieHeader, name) => {
console.log("Cookie Header:", cookieHeader);
const cookie = cookieHeader
?.split(";")
.map((part) =>part.trim())
.find((part)=> part.startwith(`${name}=`));

console.log(`Found the cookie ${cookie}`)
return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;

};

const getTheAuthenticatedUser = ( token ) => {
 if (!token) {
    const error = new Error("Token is required to get the user authenticated");
    error.statusCode = 401;
    throw error;
 }

 try {
    return verifyToken(token);
 } catch {
 const error = new Error ("Invalid user or expired token")
error.statusCode = 401;
throw error;
 }
};

export const authentication = (req, res, next)=>{
 try {
       req.user = getTheAuthenticatedUser(req.cookie?.token);
       return next();

 } catch (error) {
    return res.status(error.statusCode || 500).send({ message: error.message})
 }
};

export const authenticateSocket = (socket, next) => {
  try {
    const token = analyseCookie(socket.handshake.header.cookie, "token")
socket.data.user = getTheAuthenticatedUser(token);
return next();
  } catch (error) {
    return next (new Error(error.message));
  }
}