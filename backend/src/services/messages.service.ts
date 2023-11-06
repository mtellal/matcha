import messagesModel from "~/models/messages.model";
import userBlocksService from "./userBlocks.service";

type TMessage = {
    id: string | number,
    convId: string | number,
    authorId: string | number,
    userId: string | number,
    createdAt: Date
}

const getMessagesFromConvId = exports.getMessagesFromConvId = async (_userId: string | number, convId: string | number) => {
    let res = await messagesModel.getMessagesFromConvId(convId);
    if (res && res.length) {
        const userId2 = _userId === res[0].authorId ? res[0].userId : res[0].authorId;
        const isUserBlocked = await userBlocksService.isUserIdBlocked(_userId, userId2)
        if (isUserBlocked) {
            res = res.map((m: TMessage) => {
                if (m.authorId === userId2 && m.createdAt > isUserBlocked.createdAt)
                    return;
                return (m)
            })
            res = res.filter((m: TMessage) => m)
        }
    }
    return (res)
}

const getMessageFromIds = exports.getMessageFromIds = async (convId: number | string, authorId: number | string, userId: number | string, text: string) => {
    let res = await messagesModel.getMessageFromIds(convId, authorId, userId, text);
    if (res && res.length) {
        return (res[res.length - 1]);
    }
    return (null)
}

const getLastMessageFromIds = exports.getLastMessageFromIds = async (convId: number | string, userId: string | number) => {
    let res = await messagesModel.getLastMessageFromIds(convId, userId);
    if (res && res.length)
        return (res[res.length - 1])
    return (null)
}

const addMessage = exports.addMessage = async (convId: string | number, authorId: string | number, userId: string | number, text: string) => {
    let res = await messagesModel.addMessage(convId, authorId, userId, text);
    return (res)
}

export default {
    getMessagesFromConvId,
    getMessageFromIds,
    getLastMessageFromIds,
    addMessage,
}