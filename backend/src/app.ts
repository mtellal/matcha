import { SocketIds } from "./events/SocketIds";
import { JWTAuthentification, SocketJWTAuthentification } from "./middlewares/userMiddleware";

import userController from "./controllers/user.controller";
import conversationsController from "./controllers/conversations.controller";
import likesController from "./controllers/likes.controller";
import viewsController from "./controllers/views.controller";
import generalController from "./controllers/general.controller";
import tagsController from "./controllers/tags.controller";
import { DisconnectReason, Socket } from "socket.io";

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { createServer } = require('http')
const { Server } = require('socket.io')

const UserEvents = require('./events/user.events')

const app = express();
const port = process.env.BACK_PORT;
const httpServer = createServer(app);

const io = new Server(httpServer, {
    transports: ['websocket'],
    cors: {
        origin: "*"
    }
})

const socketIds = new SocketIds();

io.of("/user").use(SocketJWTAuthentification)

io.of("/user").on("connection", (socket: Socket) => {
    socketIds.addSocketId(socket);
    UserEvents(io, socket, socketIds);
    socket.on('disconnect', (reason: DisconnectReason) => {
        socketIds.deleteSocketId(socket.data.token.id)
    })
})

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

// GENERAL

app.get("/searchCity", generalController.searchCity) // ?city=xxxx
app.get("/geolocation", generalController.geolocation) // ?latitude=xxx&longitude=xxx
app.get("/randomCity", generalController.randomCity)

// USER 

app.get("/users", userController.users)

app.get("/user/resetPassword", userController.resetPassword) // ?email=xxxx

app.get("/user/tags", JWTAuthentification, userController.tags)
app.get("/user/me", JWTAuthentification, userController.datas)
app.get("/user/notifications", JWTAuthentification, userController.notifications)
app.get("/user/recommandations", JWTAuthentification, userController.recommandedUsers)
app.get("/user/:id", JWTAuthentification, userController.datas)
app.get("/user/:userId/photo/:id", JWTAuthentification, userController.photo)
app.get("/user/me/photo/:id", JWTAuthentification, userController.photo)

app.post("/user/signin", userController.signin) // {username, password}
app.post("/user/signup", userController.signup) //  { email, username, firstName, lastName, password, city?}
app.post("/user/recommandations/options", JWTAuthentification, userController.recommandedUsersOptions)
app.post("/user/:id/options", JWTAuthentification, userController.datasOptions)

app.patch("/user/update", JWTAuthentification, userController.update)
app.patch("/user/password", JWTAuthentification, userController.updatePassword) // { password }
app.patch("/user/confirmAccount", JWTAuthentification, userController.confirmAccount)
app.patch("/user/photos", JWTAuthentification, userController.photos)

app.delete("/user/deleteUsers", userController.deleteUsers)

// CONVERSATIONS

app.get("/conversations", JWTAuthentification, conversationsController.conversations)
app.get("/conversations/:id/messages", JWTAuthentification, conversationsController.messages)
app.get("/conversations/:id/lastMessage", JWTAuthentification, conversationsController.lastMessage)


// LIKES

app.get("/likes", JWTAuthentification, likesController.likes)
app.patch("/likes/:id/likeProfile", JWTAuthentification, likesController.likeProfile)
app.patch("/likes/:id/unlikeProfile", JWTAuthentification, likesController.unlikeProfile)


// VIEWS

app.get("/views", JWTAuthentification, viewsController.views)
app.patch("/views/:id/viewProfile", JWTAuthentification, viewsController.viewProfile)


// TAGS
app.get("/tags", tagsController.tags)


app.get('/', (req: any, res: any) => {
    res.send("Server listening ...")
})

httpServer.listen(port);
