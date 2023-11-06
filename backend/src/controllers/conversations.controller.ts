
import { Request, Response } from "express";
import conversationsService from "~/services/conversations.service";
import messagesService from "~/services/messages.service";
import { validNumber } from "~/utils";

const conversations = exports.conversations = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.token.id;
        const conversations = await conversationsService.getConvsFromUserId(userId)
        return (res.status(200).json({ conversations, message: "Conversations successfully sent" }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(404).json({ message: "Conversations not found" }))
    }
}

const messages = exports.messages = async (req: Request, res: Response) => {
    try {
        if (!validNumber(req.params.id))
            return (res.status(400).json({ message: "Invalid id" }))
        const userId = res.locals.token.id;
        const messages = await messagesService.getMessagesFromConvId(userId, req.params.id)
        return (res.status(200).json({ messages, message: "Conversations successfully sent" }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(404).json({ message: "Messages not found" }))
    }
}

const lastMessage = exports.lastMessage = async (req: Request, res: Response) => {
    try {
        if (!validNumber(req.params.id))
            return (res.status(400).json({ message: "Invalid id" }))
        const userId = res.locals.token.id;
        const message = await messagesService.getLastMessageFromIds(parseInt(req.params.id), userId)
        return (res.status(200).json({ message }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(404).json({ message: "Conversation not found" }))
    }
}

export default {
    conversations,
    messages,
    lastMessage
}