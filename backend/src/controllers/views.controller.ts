import { Request, Response } from "express";
import userService from "~/services/user.service";
import { validNumber } from "~/utils";

const viewProfile = exports.viewProfile = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.token.id;
        if (!validNumber(req.params.id))
            return (res.status(400).json({ message: "Invalid id" }))
        await userService.addView(userId, req.params.id);
        return (res.status(200).json({ message: "User successfully view" }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(404).json({ message: "User not found" }))
    }
}

const views = exports.views = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.token.id;
        let userIds = await userService.getUserIdsViewedMe(userId);
        return (res.status(200).json({ userIds, message: "Views successfully sent" }))
    }
    catch (e) {
        // console.log(e);
        return (res.status(404).json({ message: "User not found" }))
    }
}

export default {
    views,
    viewProfile
}
