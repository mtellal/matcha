import { DisconnectReason, Socket } from "socket.io";
import { MatchaSocket, Message } from "./types";

import userService from "~/services/user.service";
import notificationsService from "~/services/notifications.service";
import messagesService from "~/services/messages.service";
import userBlocksService from "~/services/userBlocks.service";
import userReportsService from "~/services/userReports.service";
import { SocketIds } from "./SocketIds";

module.exports = async (io: any, socket: Socket, Sockets: SocketIds) => {

    const userId = socket.data.token.id;

    const onLine = async () => {
        try {
            await userService.updateUserStatusFromUserId("true", userId);
        }
        catch (e) {
            // console.log(e)
        }
    }

    const offLine = async () => {
        try {
            await userService.updateUserStatusFromUserId("false", userId);
        }
        catch (e) {
            // console.log(e)
        }
    }

    onLine();

    socket.on('view', async (viewUserId: string) => {
        try {
            if (parseInt(userId) === parseInt(viewUserId))
                return;
            await userService.addView(userId, viewUserId);

            let data: MatchaSocket | undefined = Sockets.socketIds.find((o: MatchaSocket) => Number(o.userId) === parseInt(viewUserId));

            let notification = await notificationsService.getNotifFromIds(userId, viewUserId, "view");
            if (!notification)
                await notificationsService.insertNotif(parseInt(userId), parseInt(viewUserId), "view")
            else
                notification = await notificationsService.updateNotifTime(parseInt(userId), parseInt(viewUserId), "view")
            notification = await notificationsService.getNotifFromIds(userId, viewUserId, "view");

            const userIdBlocked = await userBlocksService.isUserIdBlocked(viewUserId, userId);
            if (userIdBlocked)
                return;

            if (data && data.socket) {
                data.socket.emit('notification', notification)
            }
            else {
                await userService.incrementUserNotif(viewUserId);
            }
        }
        catch (e) {
            // console.log("error view event ", e)
        }
    })

    socket.on('like', async (likeUserId: string) => {
        try {
            if (parseInt(userId) === parseInt(likeUserId))
                return;
            const conv = await userService.addLike(userId, likeUserId);

            let matchNotif1;
            let matchNotif2;

            if (conv) {

                const likeUserIdBlocked = await userBlocksService.isUserIdBlocked(userId, likeUserId);

                if (!likeUserIdBlocked)
                    socket.emit('addConversation', { ...conv, userId, memberId: parseInt(conv.memberId) === parseInt(userId) ? parseInt(conv.userId) : parseInt(conv.memberId) })

                matchNotif1 = await notificationsService.getNotifFromIds(userId, likeUserId, "match");
                if (!matchNotif1) {
                    await notificationsService.insertNotif(userId, likeUserId, "match");
                }
                else {
                    await notificationsService.updateNotifTime(userId, likeUserId, "match")
                }
                matchNotif1 = await notificationsService.getNotifFromIds(userId, likeUserId, "match");

                matchNotif2 = await notificationsService.getNotifFromIds(likeUserId, userId, "match");
                if (!matchNotif2) {
                    await notificationsService.insertNotif(likeUserId, userId, "match");
                }
                else {
                    await notificationsService.updateNotifTime(likeUserId, userId, "match")
                }
                matchNotif2 = await notificationsService.getNotifFromIds(likeUserId, userId, "match");

                if (!likeUserIdBlocked)
                    socket.emit('notification', matchNotif2);
            }

            let data: MatchaSocket | undefined = Sockets.socketIds.find((o: MatchaSocket) => Number(o.userId) === parseInt(likeUserId));

            let likeNotif = await notificationsService.getNotifFromIds(userId, likeUserId, "like");
            if (!likeNotif) {
                await notificationsService.insertNotif(userId, likeUserId, "like");
            }
            else {
                await notificationsService.updateNotifTime(userId, likeUserId, "like")
            }
            likeNotif = await notificationsService.getNotifFromIds(userId, likeUserId, "like");

            const userIdBlocked = await userBlocksService.isUserIdBlocked(likeUserId, userId);
            if (userIdBlocked)
                return;

            if (data && data.socket) {
                data.socket.emit('like', userId)
                data.socket.emit('notification', likeNotif)
                if (conv) {
                    data.socket.emit('addConversation', { ...conv, userId: likeUserId, memberId: parseInt(conv.memberId) === parseInt(likeUserId) ? parseInt(conv.userId) : parseInt(conv.memberId) })
                    data.socket.emit('notification', matchNotif1);
                }
            }
            else {
                userService.incrementUserNotif(likeUserId);
            }
        }
        catch (e) {
            // console.log("error like event ", e)
        }
    })

    socket.on('unlike', async (likeUserId: string) => {
        try {
            if (parseInt(userId) === parseInt(likeUserId))
                return;
            const conv = await userService.removeLike(userId, likeUserId);

            if (conv) {
                socket.emit('deleteConversation', { ...conv, userId, memberId: parseInt(conv.memberId) === parseInt(userId) ? parseInt(conv.userId) : parseInt(conv.memberId) })
            }

            let data: MatchaSocket | undefined = Sockets.socketIds.find((o: MatchaSocket) => Number(o.userId) === parseInt(likeUserId));

            let unlikeNotif = await notificationsService.getNotifFromIds(userId, likeUserId, "unlike");
            if (!unlikeNotif) {
                await notificationsService.insertNotif(userId, likeUserId, "unlike");
            }
            else {
                await notificationsService.updateNotifTime(userId, likeUserId, "unlike")
            }
            unlikeNotif = await notificationsService.getNotifFromIds(userId, likeUserId, "unlike");

            const userIdBlocked = await userBlocksService.isUserIdBlocked(likeUserId, userId);
            if (userIdBlocked)
                return;

            if (data && data.socket) {
                data.socket.emit("unlike", userId)
                data.socket.emit('notification', unlikeNotif)

                if (conv) {
                    data.socket.emit('deleteConversation', { ...conv, userId: likeUserId, memberId: parseInt(conv.memberId) === parseInt(likeUserId) ? parseInt(conv.userId) : parseInt(conv.memberId) })
                }
            }
            else {
                await userService.incrementUserNotif(likeUserId);
            }
        }

        catch (e) {
            // console.log("error like event ", e)
        }
    })


    socket.on('removeNotifs', async () => {
        try {
            await userService.updateUserDataFieldFromUserId("notifications", "0", userId)
        }
        catch (e) {
            // console.log("error viewUser ", e)
        }
    })

    socket.on('message', async (message: Message) => {
        try {
            if (!message.convId || !message.authorId || !message.userId || !message.text || !message.text.trim())
                throw ("Invalid message")

            const authorId = message.authorId;
            const userId = message.userId;

            await messagesService.addMessage(message.convId, message.authorId, message.userId, message.text)
            const _message = await messagesService.getMessageFromIds(message.convId, message.authorId, message.userId, message.text);

            if (_message) {
                socket.emit('message', _message)
            }

            let messageNotif = await notificationsService.getNotifFromIds(authorId, userId, "message");
            if (!messageNotif) {
                await notificationsService.insertNotif(authorId, userId, "message");
            }
            else {
                await notificationsService.updateNotifTime(authorId, userId, "message")
            }
            messageNotif = await notificationsService.getNotifFromIds(authorId, userId, "message");

            const userIdBlocked = await userBlocksService.isUserIdBlocked(userId, authorId);
            if (userIdBlocked)
                return;

            let data: MatchaSocket | undefined = Sockets.socketIds.find((o: MatchaSocket) => Number(o.userId) === Number(message.userId));

            if (data && data.socket && _message) {

                data.socket.emit('message', _message)
                data.socket.emit('notification', messageNotif)
            }
            else
                userService.incrementUserNotif(userId)
        }
        catch (e) {
            // console.log(e)
        }
    })

    socket.on('block', async (blockUserId: string) => {
        try {
            if (parseInt(userId) === parseInt(blockUserId))
                return;
            await userBlocksService.insertUserBlock(userId, blockUserId);
        }
        catch (e) {
            // console.log("Error block event => ", e)
        }
    })


    socket.on('unblock', async (blockUserId: string) => {
        try {
            if (parseInt(userId) === parseInt(blockUserId))
                return;
            await userBlocksService.deleteUserBlock(userId, blockUserId);
        }
        catch (e) {
            // console.log("Error unblock event => ", e)
        }
    })


    socket.on('reportUser', async (reportUserId: string) => {
        try {
            if (parseInt(userId) === parseInt(reportUserId))
                return;
            await userReportsService.insertUserReport(userId, reportUserId);
        }
        catch (e) {
            // console.log("Error report User ", e)
        }
    })

    socket.on('disconnect', (reason: DisconnectReason) => {
        // console.log("user socket ", userId, " disconnected");
        offLine();
    })

}