import conversationsModel from "~/models/conversations.model";
import { Conversation } from "~/type";

const getConvsFromUserId = exports.getConvsFromUserId = async (userId: string) => {
    let res = await conversationsModel.getConvsFromUserId(userId);
    if (res && res.length) {
        res = res.map((c: Conversation) => {
            return ({ ...c, userId, memberId: Number(c.memberId) === parseInt(userId) ? Number(c.userId) : Number(c.memberId) })
        })
    }
    return (res)
}

const getConvIdFromUserIds = exports.getConvIdFromUserIds = async (userId1: string | number, userId2: string | number) => {
    let res = await conversationsModel.getConvIdFromUserIds(userId1, userId2);
    if (res && res.length)
        return (res[0].id)
    return (null)
}

const getConvFromUserIds = exports.getConvFromUserIds = async (userId1: string | number, userId2: string | number) => {
    let res = await conversationsModel.getConvFromUserIds(userId1, userId2);
    if (res && res.length)
        return (res[0])
    return (null);
}



const createNewConv = exports.createNewConv = async (userId1: string | number, userId2: string | number) => {
    let res = await conversationsModel.createNewConv(userId1, userId2);
    let conv = await getConvFromUserIds(userId1, userId2);
    if (conv && conv.length)
        conv = conv[0]
    return (conv)
    // console.log("createNewConv => ", res)
}

const deleteConvFromUserIds = exports.deleteConvFromUserIds = async (userId1: string | number, userId2: number | string) => {
    let conv = await getConvFromUserIds(userId1, userId2);
    if (conv && conv.length)
        conv = conv[0]
    let res = await conversationsModel.deleteConvFromUserIds(userId1, userId2)
    return (conv)
    // console.log("deleteConvFromUserIds => ", res);
}

export default {
    getConvsFromUserId,
    getConvIdFromUserIds,
    getConvFromUserIds,
    createNewConv,
    deleteConvFromUserIds,
}