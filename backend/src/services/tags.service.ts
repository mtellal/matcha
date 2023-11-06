import tagsModels from "~/models/tags.models";
import { Tag } from "~/type";

const getAllTags = exports.getAllTags = async () => {
    const res = await tagsModels.getAllTags();
    if (!res || !res.length)
        throw "Tags not found";
    return (res);
}

const getTagsFromTagIds = exports.getTagsFromTagIds = async (tagIds: number[]) : Promise<Tag[]> => {
    let res = await tagsModels.getTagsFromTagIds(tagIds);
    if (res && res.length)
        return (res.map((t: Tag) => t.tag))
    return (res)
}

const getTagsIdsFromTags = exports.getTagsIdsFromTags = async (tags: string[]) => {
    let res = await tagsModels.getTagsIdsFromTags(tags);
    if (res && res.length)
        res = res.map((o: Tag) => o.tagId)
    return (res)
}

const getUserTagIds = exports.getUserTagIds = async (userId: number | string) => {
    let res = await tagsModels.getUserTagIds(userId);
    if (res && res.length)
        res = res.map((o: Tag) => o.tagId)
    return (res)
}

const insertUserTagIds = exports.insertUserTagIds = async (userId: number | string, tagsIds: number[] | string[]) => {
    const res = await tagsModels.insertUserTagIds(userId, tagsIds);
    if (!res || !res.length)
        throw "Insert tags ids failed";
    return (res)
}

const updateUserTagsFromTags = exports.updateUserTagsFromTags = async (userId: number | string, tags: string[]) => {
    if (tags && !tags.length)
        return (await tagsModels.deleteUserTagIds(userId))
    if (tags && tags.length) {
        let tagsIds = await getTagsIdsFromTags(tags);
        await tagsModels.deleteUserTagIds(userId)
        if (tagsIds && tagsIds.length) {
            return (await tagsModels.insertUserTagIds(userId, tagsIds));
        }
    }
}

const deleteUserTagIds = exports.deleteUserTagIds = async (userId: string | number) => {
    const res = await tagsModels.deleteUserTagIds(userId);
    if (!res || !res.length)
        throw "delete tags ids failed";
    return (res)
}

export default {
    getAllTags,
    getTagsFromTagIds,
    getTagsIdsFromTags,
    getUserTagIds,
    insertUserTagIds,
    updateUserTagsFromTags,
    deleteUserTagIds
}