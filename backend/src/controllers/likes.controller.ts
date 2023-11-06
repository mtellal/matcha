
import { Request, Response } from "express";
import userService from "~/services/user.service";
import { validNumber } from "~/utils";

const likes = exports.likes = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.token.id;
        let userIds = await userService.getUserIdsLikedMe(userId);
        return (res.status(200).json({ userIds, message: "Likes successfully sent" }))
    }
    catch (e) {
        // console.log(e);
        return (res.status(400).json({ message: "Likes error" }))
    }
}

const likeProfile = exports.likeProfile = async (req: Request, res: Response) => {
    try {
        if (!validNumber(req.params.id))
            return (res.status(400).json({ message: "Invalid id" }))
        const userId = res.locals.token.id;
        const conversation = await userService.addLike(userId, req.params.id);
        return (res.status(200).json({ message: "User successfully liked", conversation }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(400).json({ message: e }))
    }
}

const unlikeProfile = exports.unlikeProfile = async (req: Request, res: Response) => {
    try {
        if (!validNumber(req.params.id))
            return (res.status(400).json({ message: "Invalid id" }))
        const userId = res.locals.token.id;
        const conversation = await userService.removeLike(userId, req.params.id);
        return (res.status(200).json({ message: "User like successfully removed", conversation }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(404).json({ message: "User not found" }))
    }
}

export default {
    likes,
    likeProfile,
    unlikeProfile
}