import notificationsModels from "~/models/notifications.models";
import { Notification, UserBlock } from "../type";
import conversationsService from "./conversations.service";
import userBlocksService from "./userBlocks.service";
import userService from "./user.service";

// model of notification
// {id: number, firstName: string, userId: number, action: string, createdAt: date}

async function formatNotification(n: Notification, userId: string | number) {
    let convId;
    if (n.action === "match" || n.action === "message") {
        convId = await conversationsService.getConvIdFromUserIds(n.userId1, n.userId2);
    }

    let target = await userService.getUserDatasFieldsFromUserId(["userId", "firstName"], Number(n.userId1) === parseInt(userId as string) ? Number(n.userId2) : Number(n.userId1));
    if (target) {
        return ({
            id: n.id,
            firstName: target.firstName,
            userId: target.userId,
            action: n.action,
            convId,
            createdAt: n.createdAt
        })
    }
    return (n)
}


// get all notifications, fromat and sort them (more recents)
const getAll = exports.getAll = async (userId: string | number) => {
    let res = await notificationsModels.getAll(userId);
    if (res && res.length) {

        const userBlocks = await userBlocksService.getUserBlocks(userId);
        if (userBlocks && userBlocks.length) {
            res = res.map((n: Notification) => {
                const _userBlockObj = userBlocks.find((o: UserBlock) => o.blockUserId === n.userId1);
                if (_userBlockObj && _userBlockObj.createdAt < n.createdAt) {
                    return (null);
                }
                return (n)
            })
            res = res.filter((n: Notification) => n)
        }

        if (res) {
            res = await Promise.all(
                res.map(async (n: Notification) => {
                    return (await formatNotification(n, userId))
                })
            )
            res = res.sort((a: Notification, b: Notification) =>
                new Date(a.createdAt) > new Date(b.createdAt) ? -1 : new Date(a.createdAt) === new Date(b.createdAt) && a.id > b.id ? -1 : 0)
        }
    }
    return (res)
}

// {id: number, firstName: string, userId: number, action: string, createdAt: date}

const getNotifFromIds = exports.getNotifFromIds = async (eUserId: string | number, lUserId: string | number, action: string) => {
    let conv = await notificationsModels.getNotifFromIds(eUserId, lUserId, action);
    if (conv && conv.length) {
        return (await formatNotification(conv[0], lUserId));
    }
    return (null)
}

const updateNotifTime = exports.updateNotifTime = async (userId1: string | number, userId2: string | number, action: string) => {
    return (await notificationsModels.updateNotifTime(userId1, userId2, action))
}

const insertNotif = exports.insertNotif = async (userId1: string | number, userId2: string | number, action: string) => {
    return (await notificationsModels.insertNotif(userId1, userId2, action));
}

export default {
    getAll,
    getNotifFromIds,
    updateNotifTime,
    insertNotif,
}