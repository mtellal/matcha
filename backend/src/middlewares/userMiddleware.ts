import { Response, Request, NextFunction } from 'express';

import { Socket } from 'socket.io';

const jwt = require('jsonwebtoken');

function extractCookie(cookies: string | undefined, key: string) {
    if (!cookies || !cookies.length)
        return (undefined)
    let tab = cookies.split("; ");
    for (let data of tab) {
        let cookie = data.split("=");
        if (cookie[0] === key)
            return (cookie[1])
    }
    return (undefined)
}

const JWTAuthentification = exports.JWTAuthentification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined = extractCookie(req.headers.cookie, "access_token")
        if (!token) {
            token = req.headers['authorization']?.split(" ")[1];
        }
        if (!token || token === "null")
            throw "Authorization empty";
        token = await jwt.verify(token, process.env.JWT_SECRET)
        // console.log("token found => ", token);
        res.locals.token = token;
        next();
    }
    catch (e) {
        // console.log("token not found from jwrAuthentification", e);
        return (res.status(401).json({ message: "Token invalid" }));
    }
}

const SocketJWTAuthentification = exports.SocketJWTAuthentification = async (socket: Socket, next: NextFunction) => {
    try {
        let token: string | undefined = extractCookie(socket.handshake.headers.cookie, "access_token")
        if (socket.handshake.headers.authorization)
            token = socket.handshake.headers.authorization?.split(" ")[1];
        else if (socket.handshake.auth.token)
            token = socket.handshake.auth.token;
        if (!token || token === "null")
            throw "Authorization empty";
        token = await jwt.verify(token, process.env.JWT_SECRET)
        socket.data.token = token;
    }
    catch (e) {
        // console.log("token not found from SOCKET JWT AUTH", e);
        return;
    }
    next();
}

export {
    JWTAuthentification,
    SocketJWTAuthentification
}


