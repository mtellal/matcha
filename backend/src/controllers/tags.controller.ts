import { Request, Response } from "express";
import tagsService from "~/services/tags.service";

const tags = exports.tags = async (req: Request, res: Response) => {
    try {
        const tags = await tagsService.getAllTags();
        return (res.status(200).json({ tags, message: "Tags successfully sent" }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(404).json({ message: "Tags not found" }))
    }
}

export default {
    tags
}

